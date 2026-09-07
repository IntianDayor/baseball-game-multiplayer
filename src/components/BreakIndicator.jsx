import chaosIndicator from "../assets/Icons/UI/circle-wavy-thin-svgrepo-com.svg";

function BreakIndicator({ dx = 0, dy = 0, chaos = false }) {
  if (chaos) {
    return (
      <div className="absolute -inset-3 pointer-events-none">
        <img
          src={chaosIndicator}
          className="absolute inset-0 w-full h-full opacity-80"
        />
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      {/* Center reference mark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/50" />

      {/* Break offset dot */}
      <div
        className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full bg-yellow-400"
        style={{
          transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
          transition: "transform 150ms ease-out",
        }}
      />
    </div>
  );
}

export default BreakIndicator;
