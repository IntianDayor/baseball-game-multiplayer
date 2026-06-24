function RunnerDot({ active }) {
    return (
        <div className={`w-4 h-4 rounded-full border-2 border-white transition-all ${active ? 'bg-yellow-400' : 'bg-gray-600'
            }`}
        />
    );
}

function MiniMap({ runners = { first: false, second: false, third: false } }) {

    return (
        <div className="relative w-32 h-32">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rotate-45 border-2 border-gray-400" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <RunnerDot active={runners.second} />
            </div>

            <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <RunnerDot active={runners.third} />
            </div>

            <div className="absolute top-1/2 right-0 -translate-y-1/2">
                <RunnerDot active={runners.first} />
            </div>
 
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <div className="w-3 h-3 bg-white rounded-sm" />
            </div>

        </div>
    );
}

export default MiniMap;
