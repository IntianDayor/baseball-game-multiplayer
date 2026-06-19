import { useState, useEffect, useRef } from "react";
import StrikeZone from "./StrikeZone";
import LastPitchVisual from "./LastPitchVisual";
import { supabase } from "../lib/supabase";
import { calculateHint } from "../lib/hint-calculator";
import { swingAt, updateGameState } from "../lib/rooms";
import { determineHitType } from "../lib/hit-calculator";
import { rollFielder } from "../lib/fielder";

function BattingField({ pitches, bats, selected, roomCode, isHost }) {
    /* VARIABLES */
    // Batting logic Variables
    const [incomingPitch, setIncomingPitch] = useState(null);
    const [hint, setHint] = useState(null);
    const [swingResult, setSwingResult] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [pitchTaken, setPitchTaken] = useState(false);
    const [canSwing, setCanSwing] = useState(false);
    const [pitchStartTime, setPitchStartTime] = useState(null);

    // Contact Point Visualizer Variables // 
    const hitZone = bats[selected].radius;
    const [lastPitchLocation, setLastPitchLocation] = useState(null);

    // Pitch Listener / Hint Visualizer
    useEffect(() => {
        if (!roomCode) return;

        const channel = supabase
            .channel('pitches:' + roomCode)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'pitches',
                filter: `room_id=eq.${roomCode}`
            }, (payload) => {
                const pitch = payload.new;
                const pitchData = pitches[pitch.pitch_type];
                const hintResult = calculateHint({ ...pitchData, aim_x: pitch.aim_x, aim_y: pitch.aim_y });
                setIncomingPitch(pitch);
                setHint(hintResult);
                setSwingResult(null);
                setPitchTaken(false);

                // Shows hint first after short delay canSwing is true
                const readDelay = Math.round((10 - pitchData.speed) * 100 + 200);
                setTimeout (() => {
                    setCanSwing(true);
                    setPitchStartTime(Date.now());
                }, readDelay);
            })
            .subscribe()

        return () => supabase.removeChannel(channel);
    }, [roomCode, pitches]);

    // Game State Listener / Auto-take Timer
    const timerRef = useRef(null);
    useEffect(() => {
        if (!canSwing || !incomingPitch) return;

        const pitchData = pitches[incomingPitch.pitch_type];
        const reactionTime = Math.round((10 - pitchData.speed) * 200 + 500);

        timerRef.current = setTimeout(async () => {

            setCanSwing(false)
            setPitchTaken(true); // Timer Expired
            setHint(null);
            setLastPitchLocation({ x: incomingPitch.aim_x, y: incomingPitch.aim_y });

            const result = incomingPitch.is_strike ? 'called_strike' : 'ball';

            await swingAt(incomingPitch.id, roomCode, {
                swing_x: null,
                swing_y: null,
                swing_type: null,
                result: result
            });

            await updateGameState(roomCode, result, incomingPitch.is_strike, isHost);

        }, reactionTime);

        return () => clearTimeout(timerRef.current);

    }, [canSwing, incomingPitch, isHost, pitches, roomCode]);

    if (!pitches) return <div>Waiting for opponent pitches...</div>;

    return (
        <div className="relative w-64 h-64 bg-green-900 rounded cursor-crosshair"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCursorPos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }}

            // Batting Logic //
            onClick={async () => {

                if (!hint || !canSwing || !incomingPitch || !pitchStartTime) return;
                const swingAtTime = Date.now();
                setCanSwing(false);

                const timingOffset = swingAtTime - pitchStartTime;

                clearTimeout(timerRef.current);

                const distance = Math.sqrt(
                    Math.pow(cursorPos.x - hint.hint_x, 2) +
                    Math.pow(cursorPos.y - hint.hint_y, 2)
                );

                const isHit = distance <= hitZone;
                const hitType = isHit
                    ? determineHitType(
                        distance, 
                        hitZone, 
                        timingOffset, 
                        pitches[incomingPitch.pitch_type].speed, 
                        incomingPitch.power, selected
                    )
                    : null;
                    
                // Roll fielder if it's a hit and not a foul
                let finalResult = isHit ? hitType : 'swing_miss'
                if (
                    isHit &&
                    ['single', 'double', 'homerun'].includes(hitType)
                ) {
                    const fielderRoll = rollFielder(hitType, selected);
                    finalResult = fielderRoll.result;
                }
                
                // After Swing
                setSwingResult(finalResult);
                setHint(null);
                setLastPitchLocation({ x: incomingPitch.aim_x, y: incomingPitch.aim_y });
                await swingAt(incomingPitch.id, roomCode, {
                    swing_x: cursorPos.x,
                    swing_y: cursorPos.y,
                    swing_type: selected,
                    result: finalResult
                });
                await updateGameState(roomCode, finalResult, incomingPitch.is_strike, isHost);
            }}
        >

            {/* Contact point - Testing */}
            <div className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none"
                style={{
                    width: `${hitZone * 2}px`,
                    height: `${hitZone * 2}px`,
                    left: cursorPos.x - hitZone,
                    top: cursorPos.y - hitZone,
                }}
            />

            {/* Hint Area */}
            {hint && (
                <div
                    className={`absolute rounded-full border-2 pointer-events-none opacity-40 ${canSwing ? 'border-green-400 opacity-100' : 'border-white'}`}
                    style={{
                        width: `${(hint.breakScale ?? 8) * 4}px`,
                        height: `${(hint.breakScale ?? 8) * 4}px`,
                        left: hint.hint_x - ((hint.breakScale ?? 8) * 2),
                        top: hint.hint_y - ((hint.breakScale ?? 8) * 2),
                    }}
                />
            )}

            {/* Last Pitch location */}
            <LastPitchVisual location={lastPitchLocation} />

            {/* Temp Bat Visual */}
            {swingResult && (
                <div className={`absolute top-2 left-2 text-sm font-bold ${['single', 'double', 'homerun'].includes(swingResult) ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {swingResult === 'homerun' && 'HOMERUN!'}
                    {swingResult === 'double' && 'DOUBLE!'}
                    {swingResult === 'single' && 'SINGLE!'}
                    {swingResult === 'out' && 'OUT!'}
                    {swingResult === 'swing_miss' && 'MISS!'}
                    {swingResult === 'foul' && 'FOUL!'}
                    {swingResult === 'sac_bunt' && 'SACRIFICIAL BUNT!'}
                </div>
            )}
            {pitchTaken && (
                <div className="absolute top-10 left-2 text-sm font-bold text-blue-400">
                    {incomingPitch.is_strike ? 'CALLED STRIKE!' : 'BALL!'}
                </div>
            )}

            {/* Strike Zone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                < StrikeZone pitches={pitches} selected={selected} />
            </div>

        </div>
    );
}

export default BattingField;