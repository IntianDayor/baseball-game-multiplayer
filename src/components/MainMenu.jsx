function MainMenu({ setScreen }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h1 className="font-bold text-2xl text-white p-4">BASE BALL GAME!</h1>
            <div id="button-wrappers" className="flex gap-10">
                <button 
                id="pwf"
                onClick={() => setScreen('lobby')} 
                className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-32 -translate-y-2 active:translate-y-0 active:border-b-0"
                >
                    Play with a Friend
                </button>
                <button id="pwr" 
                className="bg-gray-300 border-2 border-gray-700 border-b-12 rounded px-6 py-4 cursor-pointer font-bold text-gray-900 text-center w-32 -translate-y-2 active:translate-y-0 active:border-b-0"
                >
                    Play with a Random
                </button>
            </div>
        </div>
    );
}

export default MainMenu;
