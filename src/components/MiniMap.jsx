function MiniMap({ runners = {first: false, second: false, third: false} } ) {
    /* Runnder Circle - Map Visual */
    function RunnderDot( {active} ) {
        return(
            <div className={`w-4 h-4 rounded-full border-2 border-white transition-all ${
                active ? 'bg-yellow-400' : 'bg-gray-600'
            }`}
            />
        );
    }

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">

            {/* Diamond Shape */}
            <div className="relative w-20 h-20 rotate-45 border-2 border-gray-400">

                {/* Home Plate */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2 -rotate-45">
                    <div className="w-3 h-3 bg-white rounded-sm" />
                </div>

                {/* First Base */}
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 -rotate-45">
                    <RunnderDot active={runners.first} />
                </div>

                {/* Second Base */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-45">
                    <RunnderDot active={runners.second} />
                </div>

                {/* Third Base */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 -rotate-45" >
                    <RunnderDot active={runners.third} />
                </div>

            </div>

        </div>
    );
}

export default MiniMap;