import { useState, useEffect } from "react";

function PitchingField() {
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
        <div className="relative w-96 h-96 bg-green-900 rounded cursor-crosshair"
        onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setCursorPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }}
            onMouseDown={() => setIsCharging(true)}
            onMouseUp={() => {
                setThrown({ power, aimX: cursorPos.x, aimY: cursorPos.y });
                setIsCharging(false);
                setPower(0);
            }}
        >   
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
        </div>
    )
}

export default PitchingField
