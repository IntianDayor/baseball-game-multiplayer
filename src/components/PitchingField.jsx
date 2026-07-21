import { useState, useEffect, useRef } from "react";
import StrikeZone from "./StrikeZone";
import { throwPitch } from "../lib/rooms";
import { supabase } from "../lib/supabase";
import LastPitchVisual from "./LastPitchVisual";
import { resolvePitchLocation } from "../lib/engines/pitch-resolver";

function PitchingField({ pitches, selected, roomCode }) {
    /* VARIABLES */

    // Pitching Logic Variables
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isCharging, setIsCharging] = useState(false);
    const [powerTier, setPowerTier] = useState(0);
    const [thrown, setThrown] = useState(null);
    const [pitchResult, setPitchResult] = useState(null);
    const [hasActivePitch, setHasActivePitch] = useState(false);
    const [lastPitchMarker, setLastPitchMarker] = useState(null);

    // Power Mechanic
    const atMaxSinceRef = useRef(null);
    useEffect(() => {
        if (!isCharging) return;

        const TIER_STEP_MS = 250;
        const MAX_TIER_ALLOWANCE_MS = 400;

        const interval = setInterval(() => {
            setPowerTier(prev => {
                if (prev < 4) return prev + 1;

                if (atMaxSinceRef.current === null) {
                    atMaxSinceRef.current = Date.now();
                    return prev;
                }

                if (Date.now() - atMaxSinceRef.current < MAX_TIER_ALLOWANCE_MS) {
                    return prev;
                }

                atMaxSinceRef.current = null;
                return 0;

            });
        }, TIER_STEP_MS);


        return () => clearInterval(interval);

    }, [isCharging]);

    // Latest Thrown Value
    const thrownRef = useRef(null);
    useEffect(() => {
        thrownRef.current = thrown;
    }, [thrown]);

    // Swings Listener
    useEffect(() => {
        if (!roomCode) return;

        const channel = supabase
            .channel('swings:' + roomCode)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'swings',
                filter: `room_id=eq.${roomCode}`
            }, (payload) => {
                const swing = payload.new
                if (swing.result) {
                    setPitchResult(swing.result);
                    setHasActivePitch(false);

                    if (thrownRef.current) setLastPitchMarker(thrownRef.current);
                    setThrown(null);
                }
            })
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [roomCode]);

    if (!pitches) return <div>Loading pitches...</div>;

    return (
        <div className="relative w-64 h-64 bg-green-900 rounded cursor-crosshair"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCursorPos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }}
            onMouseDown={() => setIsCharging(true)}
            onMouseUp={async () => {
                
                // Pitch Power Reset
                setIsCharging(false);
                setPowerTier(0);
                atMaxSinceRef.current = null;

                // Pitching Data
                if (hasActivePitch) return;

                setHasActivePitch(true);

                const pitchData = pitches[selected];

                const resolvedPitch = resolvePitchLocation(pitchData, {
                    aim_x: cursorPos.x,
                    aim_y: cursorPos.y,
                    power: powerTier
                });

                const inZone =
                    resolvedPitch.final_x > 64 &&
                    resolvedPitch.final_x < 192 &&
                    resolvedPitch.final_y > 64 &&
                    resolvedPitch.final_y < 192;

                setLastPitchMarker(null);

                setThrown({
                    powerTier,
                    aim_x: cursorPos.x,
                    aim_y: cursorPos.y,
                    hint_x: resolvedPitch.hint_x,
                    hint_y: resolvedPitch.hint_y,
                    final_x: resolvedPitch.final_x,
                    final_y: resolvedPitch.final_y,
                    break_scale: resolvedPitch.breakScale,
                    movement_scale: resolvedPitch.movementScale,
                    is_strike: inZone,
                    pitch: pitchData
                });

                await throwPitch(roomCode, {
                    aim_x: cursorPos.x,
                    aim_y: cursorPos.y,
                    hint_x: resolvedPitch.hint_x,
                    hint_y: resolvedPitch.hint_y,
                    final_x: resolvedPitch.final_x,
                    final_y: resolvedPitch.final_y,
                    break_scale: resolvedPitch.breakScale,
                    movement_scale: resolvedPitch.movementScale,
                    power: powerTier,
                    pitch_type: selected,
                    is_strike: inZone,
                    thrown_at: new Date().toISOString()
                });

            }}
        >
            { /* Strike Zone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                < StrikeZone pitches={pitches} selected={selected} />
            </div>

            {/* Crosshair */}
            <div className="absolute w-4 h-4 border-2 border-white rounded-full pointer-events-none"
                style={{
                    left: cursorPos.x - 8,
                    top: cursorPos.y - 8,
                }}
            />

            {/* Power Bar */}
            <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className={`h-3 flex-1 rounded ${i <= powerTier ? 'bg-red-500' : 'bg-gray-700'}`}
                    />
                ))}
            </div>

            {/* Strike Feedback */}
            {thrown && (
                <div className={`absolute top-2 left-2 text-sm font-bold 
                ${thrown.is_strike ? 'text-green-400' : 'text-red-400'}`
                }>
                    {thrown.is_strike ? 'STRIKE ZONE' : 'BALL'} - Power Tier: {thrown.powerTier}/4
                </div>
            )}

            {/* Temp Pitch Result visual */}
            <div className="absolute top-8 right-4">
                {pitchResult === 'homerun' && <div className="text-red-400">HOMERUN!</div>}
                {pitchResult === 'double' && <div className="text-red-400">DOUBLE!</div>}
                {pitchResult === 'single' && <div className="text-red-400">SINGLE!</div>}
                {pitchResult === 'foul' && <div className="text-yellow-400">FOUL BALL!</div>}
                {pitchResult === 'out' && <div className="text-green-400">FIELDER CAUGHT IT!</div>}
                {pitchResult === 'swing_miss' && <div className="text-green-400">SWING AND MISS!</div>}
                {pitchResult === 'called_strike' && <div className="text-green-400">CALLED STRIKE!</div>}
                {pitchResult === 'ball' && <div className="text-yellow-400">BALL!</div>}
            </div>

            {/* Last Pitch Visual */}
            <LastPitchVisual
                location={
                    lastPitchMarker
                        ? {
                            x: lastPitchMarker.final_x,
                            y: lastPitchMarker.final_y
                        }
                        : null
                }
            />


        </div>
    )
}

export default PitchingField;
