import { useState, useEffect } from "react";
import PitchingField from "./PitchingField";
import PitchSelector from "./PitchSelector";

function Game({ setScreen, pitches, selected, setSelected }) {

    const [role, setRole] = useState('choosing');
    const [coinRes, setCoinRes] = useState(() => coinToss());

    // Players chooses HEADS or TAILS
    
    // Coin toss Function
    function coinToss() {
        const coin = Math.floor(Math.random() * 2);
        return (coin === 1) ? 'HEADS' : 'TAILS';
    }

    if (role === 'choosing') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <div className="relative flex items-center justify-center w-32 h-32 rounded-full 
              bg-linear-to-tr from-yellow-600 via-yellow-400 to-yellow-200 
              shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.8)] 
              border-4 border-yellow-700">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-yellow-600/30"></div>
                <span className="text-4xl font-bold text-yellow-900 drop-shadow-md select-none">{coinRes}</span>
            </div>
        </div>
    );

    if (role === 'pitcher') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <PitchingField pitches={pitches} selected={selected} />
            <PitchSelector pitches={pitches} selected={selected} setSelected={setSelected} />
        </div>
    );
}

export default Game;