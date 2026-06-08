/* Counter UI */
function CountIndicator({ count, max, activeColor }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: max }).map((_, index) => (
                <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                        index < count ? activeColor : "bg-gray-700"
                    }`}
                />
            ))}
        </div>
    );
}

function ScoreBoard({ inning, strikes, balls, outs, scoreAway, scoreHome, roomCode }) {
    return (
        <div className="bg-gray-900 p-3 rounded-xl border-2 border-gray-600 text-white text-sm w-36">
            <div className="text-yellow-400 font-bold text-center mb-2">
                INNING {inning}
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400">Strikes</span>
                <CountIndicator
                    count={strikes}
                    max={3}
                    activeColor="bg-red-500"
                />
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400">Balls</span>
                <CountIndicator
                    count={balls}
                    max={4}
                    activeColor="bg-green-500"
                />
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400">Outs</span>
                <CountIndicator
                    count={outs}
                    max={3}
                    activeColor="bg-yellow-500"
                />
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400">Home:</span>
                <span className="font-bold">{scoreHome}</span>
            </div>

            <div className="flex justify-between border-b border-gray-600 pb-1 mb-1">
                <span className="text-gray-400">Away:</span>
                <span className="font-bold">{scoreAway}</span>
            </div>

            <div className="flex justify-between">
                <span className="text-gray-400 text-xs">room:</span>
                <span className="text-xs">{roomCode}</span>
            </div>
        </div>
    )
}

export default ScoreBoard;