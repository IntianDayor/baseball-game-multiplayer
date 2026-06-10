import { useState, useEffect } from "react";
import StrikeZone from "./StrikeZone";
import { supabase } from "../lib/supabase";
import { calculateHint } from "../lib/hint-calculator";
import { swingAt, updateGameState } from "../lib/rooms";
import { determineHitType } from "../lib/hit-calculator";
import { rollFielder } from "../lib/fielder";

function BattingField({ pitches, bats, selected, setSelected, roomCode, strikes, balls, outs, inning, scoreHome, scoreAway, isHost }) {
    /* VARIABLES */

    const [incomingPitch, setIncomingPitch] = useState(null);
    const [hint, setHint] = useState(null);
    const [swingResult, setSwingResult] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [timeLeft, setTimeLeft] = useState(null);
    const [pitchTaken, setPitchTaken] = useState(false);
    const [canSwing, setCanSwing] = useState(false);

    // Contact Point Visualizer Variables // 
    const pitchData = incomingPitch ? pitches[incomingPitch.pitch_type] : null
    const speedModifier = pitchData ? (11 - pitchData.speed) / 10 : 0
    const breakBonus = hint ? hint.breakScale * 0.25 : 0
    const hitZones = {
        Q: Math.round(10 + (5 * speedModifier)),
        W: Math.round(20 + (5 * speedModifier)),
        E: Math.round(30 + (5 * speedModifier)),
    }

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
                setCanSwing(true);
            })
            .subscribe()

        return () => supabase.removeChannel(channel);
    }, [roomCode]);

    // Game State Listener / Timer 
    useEffect(() => {
        if (!incomingPitch) return;

        const pitchData = pitches[incomingPitch.pitch_type];
        const reactionTime = Math.round((10 - pitchData.speed) * 200 + 500);

        const timer = setTimeout(async () => {

            setCanSwing(false)
            setPitchTaken(true); // Timer Expired

            const result = incomingPitch.is_strike ? 'called_strike' : 'ball';

            await swingAt(incomingPitch.id, roomCode, {
                swing_x: null,
                swing_y: null,
                swing_type: null,
                result: result
            });

            await updateGameState(roomCode, result, incomingPitch.is_strike, isHost);

        }, reactionTime);

        return () => clearTimeout(timer)

    }, [incomingPitch]);

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
                if (!hint || !canSwing) return;

                const distance = Math.sqrt(
                    Math.pow(cursorPos.x - hint.hint_x, 2) +
                    Math.pow(cursorPos.y - hint.hint_y, 2)
                );
                const zone = hitZones[selected];
                const isHit = distance <= zone;

                // Determine hit type
                const hitType = isHit
                    ? determineHitType(distance, incomingPitch.power, selected)
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
                    width: `${hitZones[selected] * 2}px`,
                    height: `${hitZones[selected] * 2}px`,
                    left: cursorPos.x - hitZones[selected],
                    top: cursorPos.y - hitZones[selected],
                }}
            />

            {/* Hint Area */}
            {hint && (
                <div
                    className="absolute rounded-full border-2 border-yellow-400 pointer-events-none opacity-40"
                    style={{
                        width: `${(hint.breakScale ?? 8) * 4}px`,
                        height: `${(hint.breakScale ?? 8) * 4}px`,
                        left: hint.hint_x - ((hint.breakScale ?? 8) * 2),
                        top: hint.hint_y - ((hint.breakScale ?? 8) * 2),
                    }}
                />
            )}

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