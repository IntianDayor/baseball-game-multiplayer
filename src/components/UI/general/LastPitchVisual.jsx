function LastPitchVisual({ location }) {
    if (!location) return null;

    return (
        <div
            className="absolute rounded-full border-2 pointer-events-none opacity-40 bg-yellow-400"
            style={{
                width: 20,
                height: 20,
                left: location.x - 10,
                top: location.y - 10
            }}
        />
    );
}

export default LastPitchVisual;