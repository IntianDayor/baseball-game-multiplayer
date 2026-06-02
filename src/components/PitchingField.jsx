import { useState, useEffect } from "react";
import StrikeZone from "./StrikeZone";
import { throwPitch } from "../lib/rooms";

function PitchingField({ pitches, selected, roomCode }) {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0});
    const [isCharging, setIsCharging] = useState(false);
    const [power, setPower] = useState(0);
    const [thrown, setThrown] = useState(false);

    useEffect(() => {
        if (!isCharging) return;

        const interval = setInterval(() => {
            setPower(p => Math.min(p + 2, 100));
        }, 16);

        return () => clearInterval(interval);
    }, [isCharging]);

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
                const inZone = cursorPos.x > 64 && cursorPos.x < 192  // Min and Max
                            && cursorPos.y > 64 && cursorPos.y < 192; // Min and Max
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
                    is_strike: inZone
                });
                setIsCharging(false);
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
                    style={{ width: `${power}%`}}
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
        </div>
    )
}

export default PitchingField;
