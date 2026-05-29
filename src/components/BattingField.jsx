import { useState, useEffect } from "react";
import StrikeZone from "./StrikeZone";
import Loading from "./Loading";

function BattingField({ bats, selected, setSelected }) {
    
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'q' || e.key === 'Q') setSelected('Q')
            if (e.key === 'w' || e.key === 'W') setSelected('W')
            if (e.key === 'e' || e.key === 'E') setSelected('E')
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [setSelected])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-900">
            
            <StrikeZone />

            <div className="flex gap-4 mt-8">
                {Object.entries(bats).map(([key, bat]) => (
                    <div key={key}
                    className={`p-4 rounded border-2 cursor-pointer text-white text-center w-50 ${
                        selected === key
                            ? 'border-yellow-400 bg-gray-700'
                            : 'border-gray-600 bg-gray-800'
                    }`}
                    onClick={() => setSelected(key)}
                    >
                        <div className="text-yellow-400 font-bold">{key}</div>
                        <div className="text-sm">{bat.name}</div>
                        <div className="text-xs text-gray-400">FEAT: {bat.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BattingField;