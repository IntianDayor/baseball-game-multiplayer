import { useState, useEffect, useRef } from "react";
import StrikeZone from "./StrikeZone";
import { throwPitch } from "../lib/rooms";
import { supabase } from "../lib/supabase";
import LastPitchVisual from "./LastPitchVisual";

function PitchingField({ pitches, selected, roomCode, strikes, balls, outs, inning, scoreHome, scoreAway }) {
    /* VARIABLES */

    // Pitching Logic Variables
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isCharging, setIsCharging] = useState(false);
    const [power, setPower] = useState(0);
    const [thrown, setThrown] = useState(null);
    const [pitchResult, setPitchResult] = useState(null);
    const [hasActivePitch, setHasActivePitch] = useState(false);
    const [lastPitchMarker, setLastPitchMarker] = useState(null);

    // Power Charging
    useEffect(() => {
        if (!isCharging) return;

        const interval = setInterval(() => {
            setPower(p => Math.min(p + 2, 100));
        }, 16);

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
                
                setIsCharging(false);

                if (hasActivePitch) return;

                setHasActivePitch(true);
                const inZone = cursorPos.x > 64 && cursorPos.x < 192  // Min and Max
                    && cursorPos.y > 64 && cursorPos.y < 192; // Min and Max
                
                setLastPitchMarker(null);
                setThrown({
                    power,
                    aimX: cursorPos.x,
                    aimY: cursorPos.y,
                    isStrike: inZone,
                    pitch: pitches[selected]
                });
                await throwPitch(roomCode, {
                    aim_x: cursorPos.x,
                    aim_y: cursorPos.y,
                    power: power,
                    pitch_type: selected,
                    is_strike: inZone,
                    thrown_at: new Date().toISOString()
                });
                setPower(0);
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
            <div className="absolute bottom-2 left-2 right-2 h-3 bg-gray-700 rounded">
                <div
                    className="h-full bg-red-500 rounded transition-all"
                    style={{ width: `${power}%` }}
                />
            </div>

            {/* Strike Feedback */}
            {thrown && (
                <div className={`absolute top-2 left-2 text-sm font-bold 
                ${thrown.isStrike ? 'text-green-400' : 'text-red-400'}`
                }>
                    {thrown.isStrike ? 'STRIKE ZONE' : 'BALL'} - Power: {Math.round(thrown.power)}%
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
                            x: lastPitchMarker.aimX,
                            y: lastPitchMarker.aimY
                        }
                        : null
                }
            />


        </div>
    )
}

export default PitchingField;
