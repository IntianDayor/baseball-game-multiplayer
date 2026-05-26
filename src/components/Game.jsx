import { useState, useEffect } from "react";
import PitchingField from "./PitchingField";
import PitchSelector from "./PitchSelector";
import { coinChoice, updateCoinTossRes } from "../lib/rooms";
import { supabase } from "../lib/supabase";

function Game({ setScreen, pitches, selected, setSelected, isHost, roomCode }) {
    // Coin toss Function
    function coinToss() {
        const coin = Math.floor(Math.random() * 2);
        return (coin === 1) ? 'HEADS' : 'TAILS';
    }

    const [role, setRole] = useState('choosing');
    const [coinRes, setCoinRes] = useState(() => coinToss());
    const [chosenCoin, setChosenCoin] = useState('');
    const [mySide, setMySide] = useState('');

    useEffect(() =>{
        if (!roomCode) return;

        const channel = supabase
            .channel('game' + roomCode)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'rooms',
                filter: `id=eq.${roomCode}`
            }, (payload) => {
                const room = payload.new
                // Coin Toss Result
                if (room.coin_result) {
                    setCoinRes(room.coin_result);
                }
                // Coin Choice of Players
                if (room.coin_choice) {
                    if (isHost) {
                        setChosenCoin(room.coin_choice);
                        setMySide(room.coin_choice === 'heads' ? 'TAILS': 'HEADS');
                    }
                }
            })
            .subscribe()
        
        return () => supabase.removeChannel(channel);
    }, [roomCode]);

    /* COIN TOSS SCREEN BEFORE GAME */
    if (role === 'choosing') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            {/* COIN SPRITE  - SUBJECT TO CHANGE */}
            <div className="relative flex items-center justify-center w-45 h-45 rounded-full 
              bg-linear-to-tr from-yellow-600 via-yellow-400 to-yellow-200 
              shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_-4px_8px_rgba(0,0,0,0.5),inset_0_4px_8px_rgba(255,255,255,0.8)] 
              border-4 border-yellow-700">
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-yellow-600/30"></div>
                <span className="text-4xl font-bold text-yellow-900 drop-shadow-md select-none">{coinRes}</span>
            </div>

            {/* If not host Choose if Tails or Heads */}
            {!isHost ? (
                chosenCoin ? (
                    <div className="text-white p-4">You chose: {mySide}</div>
                ) : (
                    <div className="flex gap-4 p-4 m-4">
                        <button 
                            onClick={async () => {
                                setChosenCoin('heads');
                                setMySide('HEADS')
                                await coinChoice(roomCode, 'heads');
                                await updateCoinTossRes(roomCode, coinRes);
                            }}
                            className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded-4xl px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-50 -translate-y-1 active:translate-y-0 active:border-b-0"
                        >
                            Choose Heads ?
                        </button>
                        <button
                            onClick={async () => {
                                setChosenCoin('tails');
                                setMySide('TAILS')
                                await coinChoice(roomCode, 'tails');
                                await updateCoinTossRes(roomCode, coinRes);
                            }}
                            className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded-4xl px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-50 -translate-y-1 active:translate-y-0 active:border-b-0"
                        >
                            Choose Tails ?
                        </button>
                    </div>
                )
            ) : ( chosenCoin ? (
                    <div className="text-white p-4">You Got: {mySide}</div>
                ) : (
                    <div className="text-white p-4">Waiting for opponent to choose...</div>)
                )}
        </div>
    );

    /* GAME SCREEN - PITCHER */
    if (role === 'pitcher') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <PitchingField pitches={pitches} selected={selected} />
            <PitchSelector pitches={pitches} selected={selected} setSelected={setSelected} />
        </div>
    );

    /*
     if (role === 'batter') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">

        </div>
     );
     */
}

export default Game;