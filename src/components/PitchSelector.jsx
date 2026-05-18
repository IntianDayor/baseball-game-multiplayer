import { useState, useEffect } from "react";

function PitchSelector({pitches, selected, setSelected}) {

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'q' || e.key === 'Q') setSelected('Q')
            if (e.key === 'w' || e.key === 'W') setSelected('W')
            if (e.key === 'e' || e.key === 'E') setSelected('E')
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div className="flex gap-4 mt-8">
            {Object.entries(pitches).map(([key, pitch]) => (
                <div key={key}
                className={`p-4 rounded border-2 cursor-pointer text-white text-center w-32 ${
                    selected === key
                        ? 'border-yellow-400 bg-gray-700'
                        : 'border-gray-600 bg-gray-800'
                }`}
                >
                    <div className="text-yellow-400 font-bold">{key}</div>
                    <div className="text-sm">{pitch.name}</div>
                    <div className="text-xs text-gray-400">SPD: {pitch.speed}</div>
                </div>
            ))}
        </div>
    )
}

export default PitchSelector