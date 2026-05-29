function StrikeZone () {
    return (
        <div className="grid grid-cols-3 w-32 h-32 ">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                <div
                key = {cell}
                className="bg-gray-700 border border-gray-500 opacity-40"
                >
                </div> 
            ))}
        </div>
    )
}

export default StrikeZone;