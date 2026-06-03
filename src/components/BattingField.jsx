import { useState, useEffect } from "react";
import StrikeZone from "./StrikeZone";
import { supabase } from "../lib/supabase";
import { calculateHint } from "../lib/hint-calculator";
import { recordSwing } from "../lib/rooms";

function BattingField({ pitches, bats, selected, setSelected, roomCode }) {
    
    const [incomingPitch, setIncomingPitch] = useState(null);
    const [hint, setHint] = useState(null);
    const [swingResult, setSwingResult] = useState(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

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
                const pitch = payload.new
                const pitchData = pitches[pitch.pitch_type]
                const hintResult = calculateHint({ ...pitchData, aim_x: pitch.aim_x, aim_y: pitch.aim_y }) 
                setIncomingPitch(pitch)
                setHint(hintResult)
                console.log('incoming pitch:', pitch)
                console.log('hint result:', hintResult)
            })
            .subscribe()

        return () => supabase.removeChannel(channel);
    },[roomCode]);

    return (
        <div className="relative w-96 h-96 bg-green-900 rounded cursor-crosshair"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setCursorPos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }}
                onClick={ async () => {
                    if (!hint) return;
                    const hitZones = {
                        Q: 30,
                        W: 60,
                        E: 90
                    }
                    const distance = Math.sqrt(
                        Math.pow(cursorPos.x - hint.hint_x, 2) +
                        Math.pow(cursorPos.y - hint.hint_y, 2)
                    );
                    const zone = hitZones[selected];
                    const isHit = distance <= zone;
                    const result = isHit ? 'hit' : 'miss';
                    setSwingResult(result);
                    await recordSwing(incomingPitch.id, { result });
                }}
        >
            
            {/* Temp Hint Visual */}
            {hint && (
                <div
                    className="absolute w-4 h-4 bg-yellow-400 rounded-full pointer-events-none opacity-50"
                    style={{
                        left: hint.hint_x - 8,
                        top: hint.hint_y - 8,
                    }}
                />
            )}

            {/* Temp Bat Visual */}
            {swingResult && (
                <div className={`absolute top-2 left-2 text-sm font-bold ${
                    swingResult === 'hit' ? 'text-green-400' : 'text-red-400'
                }`}>
                    {swingResult === 'hit' ? 'HIT!' : 'MISS!'}
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