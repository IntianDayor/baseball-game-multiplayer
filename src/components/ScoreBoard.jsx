function ScoreBoard({ inning, strikes, balls, outs, roomCode }) {
    return (
        <div className="bg-gray-900 p-3 rounded-xl border-2 border-gray-600 text-white text-sm w-36">
            <div className="text-yellow-400 font-bold text-center mb-2">INNING {inning}</div>
            <div className="flex justify-between border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400">Strikes</span>
                <span className="font-bold">{strikes}</span>
            </div>
            <div className="flex justify-between border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400">Balls</span>
                <span className="font-bold">{balls}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-400">Outs</span>
                <span className="font-bold">{outs}</span>
            </div>

            <div className="flex justify-between">
                <span className="text-gray-400 text-xs">room: </span>
                <span className="text-xs">{roomCode}</span>
            </div>
        </div>
    )
}

export default ScoreBoard