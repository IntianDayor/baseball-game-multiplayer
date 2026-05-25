import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { createRoom } from "../lib/rooms";
import { joinRoom } from "../lib/rooms";
import { checkRoomStatus } from "../lib/rooms";
import { startGame } from "../lib/rooms";

function Lobby({ setScreen }) {
    // Generates the Room Code
    function generateRandomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const [mode, setMode] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const [joinInput, setJoinInput] = useState('');
    const [error, setError] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [playerJoined, setPlayerJoined] = useState(false);

    useEffect(() =>{
        if (!roomCode) return;

        const channel = supabase
            .channel('room' + roomCode)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'rooms',
                filter: `id=eq.${roomCode}`
            }, (payload) => {
                const updatedRoom = payload.new
                if (updatedRoom.status === 'active') {
                    setPlayerJoined(true);
                }
                if (updatedRoom.status === 'playing') {
                    setScreen('game');
                }
            })
            .subscribe()

        return () => supabase.removeChannel(channel);
    }, [roomCode]);

    /* MAIN LOBBY */
    if (!mode) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-8">Lobby</h1>
            <div id="button-wrappers" className="flex gap-10">
                <button
                    onClick={async () => {
                        const code = generateRandomCode();
                        setRoomCode(code);
                        setMode('waiting');
                        setIsHost(true);
                        await createRoom(code);
                    }}
                    className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-32 -translate-y-2 active:translate-y-0 active:border-b-0"
                >
                    Create Room
                </button>
                <button
                    onClick={() => setMode('join')}
                    className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-32 -translate-y-2 active:translate-y-0 active:border-b-0"
                >
                    Join a Friend
                </button>
            </div>
            <button
                onClick={() => setScreen('menu')}
                className="absolute top-5 right-5 p-4 m-4 rounded-xl bg-red-800 text-gray-100 hover:text-white hover:cursor-pointer text-sm"
            >
                ← Back to Menu
            </button>
        </div>
    );

    /* CREATE LOBBY */
    if (mode === 'waiting') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {isHost && (
                <div className="absolute top-5 p-4 m-4 rounded bg-gray-50 min-w-fit text-gray-900 font-extrabold">
                    Room Code: {roomCode}
                </div>
            )}
            <div className="flex flex-col border-5 border-gray-200 h-100 w-150 text-center items-center rounded-2xl">
                <h3 className="text-white font-bold p-4 text-2xl">Status:</h3>
                {isHost ? (
                    <>
                        <div className="p-5 m-5">
                            {playerJoined ? ( 
                             'Player 2 Joined! Ready to Start!') : ('Waiting for a Friend...')}
                        </div>
                        <button 
                        onClick={async () => await startGame(roomCode)}
                        className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-40 -translate-y-2 active:translate-y-0 active:border-b-0">
                            Start Game!
                        </button>
                    </>
                ) : (
                    <div className="p-5 m-5">Waiting for host to start...</div>
                )}
            </div>
            <button
                onClick={() => setScreen('menu')}
                className="absolute top-5 right-5 p-4 m-4 rounded-xl bg-red-800 text-gray-100 hover:text-white hover:cursor-pointer text-sm"
            >
                ← Back to Menu
            </button>
        </div>
    );

    /* JOIN LOBBY */
    if (mode === 'join') return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h3 className="text-white font-bold p-4 text-2xl">Enter Room Code</h3>
            <div className="flex items-center gap-1 translate-x-10">
                <input
                    onChange={(e) => setJoinInput(e.target.value)}
                    value={joinInput}
                    className=" rounded-xl uppercase text-gray-900 font-bold p-4 text-2xl text-center bg-white"
                    type="text"
                    maxLength={6}
                    required />
                <button
                    onClick={async () => {
                        const result = await joinRoom(joinInput);
                        if (!result) {
                            setError('Room not found!');
                        } else {
                            setRoomCode(joinInput);
                            setMode('waiting');
                            setIsHost(false);
                        }
                    }}
                    className="bg-gray-300 border-2 border-gray-700 border-b-4 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 text-center active:translate-y-2 active:border-b-0"
                >
                    Join!
                </button>
            </div>
            <button
                onClick={() => setScreen('menu')}
                className="absolute top-5 right-5 p-4 m-4 rounded-xl bg-red-800 text-gray-100 hover:text-white hover:cursor-pointer text-sm"
            >
                ← Back to Menu
            </button>
        </div>
    );
}

export default Lobby;