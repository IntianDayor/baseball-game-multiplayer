import { useState } from "react";

function GameOver({ setScreen, roomCode, scoreHome, scoreAway, isHost }) {

    const gameWinner = 
        scoreHome > scoreAway
        ? "home"
        : "away";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-6xl font-bold mb-4">GAME OVER</h1>

            <div className="text-2xl mb-4">
                TEAM {gameWinner.toUpperCase()} WINS!
            </div>

            <div className="flex justify-between gap-5 border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400 font-bold">Home: {scoreHome}</span>
                <span className="text-gray-400 font-bold">Away: {scoreAway}</span>
            </div>

            <button
                onClick={() => setScreen('menu')}
                className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 mt-8 -translate-y-2 active:translate-y-0 active:border-b-0"
            >
                Back to Menu
            </button>

        </div>
    );
}

export default GameOver;