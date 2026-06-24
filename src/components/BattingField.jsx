import { useState, useEffect, useRef } from "react";
import StrikeZone from "./StrikeZone";
import LastPitchVisual from "./LastPitchVisual";
import { supabase } from "../lib/supabase";
import { swingAt, updateGameState } from "../lib/rooms";
import { determineHitType, effectivePitchSpeed } from "../lib/engines/hit-calculator";
import { rollFielder } from "../lib/engines/fielder";

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
    const [isBallFlying, setIsBallFlying] = useState(false);

    // Contact Point Visualizer Variables // 
    const hitZone = bats[selected].radius;
    const [lastPitchLocation, setLastPitchLocation] = useState(null);

    // Timer References
    const readDelayRef = useRef(null);
    const autoTakeTimerRef = useRef(null);
    const hintDurationRef = useRef(null);
    const reactionTimeRef = useRef(null);

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
                const effectiveSpeed = effectivePitchSpeed(pitchData.speed, pitch.power)
                setIncomingPitch(pitch);
                setHint({
                    hint_x: pitch.hint_x,
                    hint_y: pitch.hint_y,
                    breakScale: pitch.break_scale
                });
                setSwingResult(null);
                setPitchTaken(false);

                // Shows hint first then after short delay canSwing is true
                const readDelay = Math.round((10 - effectiveSpeed) * 100 + 200);
                hintDurationRef.current = readDelay;

                if (readDelayRef.current) clearTimeout(readDelayRef.current);

                readDelayRef.current = setTimeout(() => {
                    setCanSwing(true);
                    setIsBallFlying(true);
                    setPitchStartTime(Date.now());
                }, readDelay);
            })
            .subscribe()

        return () => {
            if (readDelayRef.current) clearTimeout(readDelayRef.current);
            supabase.removeChannel(channel);
        };
    }, [roomCode, pitches]);

    // Game State Listener / Auto-take Timer
    useEffect(() => {
        if (!canSwing || !incomingPitch || !hint) return;

        const pitchData = pitches[incomingPitch.pitch_type];
        const effectiveSpeed = effectivePitchSpeed(pitchData.speed, incomingPitch.power);
        const reactionTime = Math.round((10 - effectiveSpeed) * 200 + 500);
        reactionTimeRef.current = reactionTime;

        autoTakeTimerRef.current = setTimeout(async () => {

            setCanSwing(false)
            setPitchTaken(true); // Timer Expired
            setLastPitchLocation({
                x: incomingPitch.final_x,
                y: incomingPitch.final_y
            });
            setHint(null);
            setIsBallFlying(false);

            const result = incomingPitch.is_strike ? 'called_strike' : 'ball';

            await swingAt(incomingPitch.id, roomCode, {
                swing_x: null,
                swing_y: null,
                swing_type: null,
                result
            });

            await updateGameState(roomCode, result, incomingPitch.is_strike, isHost);

        }, reactionTime);

        return () => clearTimeout(autoTakeTimerRef.current);

    }, [canSwing, incomingPitch, isHost, pitches, roomCode, hint]);

    const totalHintDuration = (hintDurationRef.current ?? 0) + (reactionTimeRef.current ?? 0);

    // Pitch Set fetching guard
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

                const pitchData = pitches[incomingPitch.pitch_type];
                const effectiveSpeed = effectivePitchSpeed(pitchData.speed, incomingPitch.power);

                const swingAtTime = Date.now();
                setCanSwing(false);

                const timingOffset = swingAtTime - pitchStartTime;

                clearTimeout(autoTakeTimerRef.current);

                const distance = Math.sqrt(
                    Math.pow(cursorPos.x - incomingPitch.final_x, 2) +
                    Math.pow(cursorPos.y - incomingPitch.final_y, 2)
                );

                const isHit = distance <= hitZone;
                const hitType = isHit
                    ? determineHitType(
                        distance,
                        hitZone,
                        timingOffset,
                        effectiveSpeed,
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
                setLastPitchLocation({
                    x: incomingPitch.final_x,
                    y: incomingPitch.final_y
                });
                setHint(null);
                setIsBallFlying(false);
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
            {hint && incomingPitch && (
                <div
                    className={`absolute rounded-full border-2 pointer-events-none ${canSwing ? 'border-green-400' : 'border-white'}`}
                    style={{
                        width: isBallFlying ? '20px' : `${(hint.breakScale ?? 8) * 4}px`,
                        height: isBallFlying ? '20px' : `${(hint.breakScale ?? 8) * 4}px`,
                        left: isBallFlying
                            ? incomingPitch.final_x - 10
                            : hint.hint_x - (hint.breakScale ?? 8) * 2,
                        top: isBallFlying
                            ? incomingPitch.final_y - 10
                            : hint.hint_y - (hint.breakScale ?? 8) * 2,
                        opacity: isBallFlying ? 0 : 1,
                        transition: `
                            width ${totalHintDuration}ms ease-in, 
                            height ${totalHintDuration}ms ease-in, 
                            left ${totalHintDuration}ms ease-in, 
                            top ${totalHintDuration}ms ease-in, 
                            opacity ${totalHintDuration}ms ease-in
                            `,
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