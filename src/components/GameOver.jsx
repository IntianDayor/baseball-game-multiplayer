function GameOver({ setScreen, roomCode }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-6xl font-bold mb-4">GAME OVER</h1>
            <button
                onClick={() => setScreen('menu')}
                className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 mt-8 -translate-y-2 active:translate-y-0 active:border-b-0"
            >
                Back to Menu
            </button>
        </div>
    )
}

export default GameOver