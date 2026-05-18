function StrikeZone ({pitches, selected}) {
    return (
        <div className="grid grid-cols-3 gap-1 w-48 h-48 border-4" style={{ borderColor: pitches[selected].color }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                <div
                key = {cell}
                className="bg-gray-700 hover:bg-yellow-400 cursor-pointer border border-gray-500"
                >
                </div>
            ))}
        </div>
    )
}

export default StrikeZone