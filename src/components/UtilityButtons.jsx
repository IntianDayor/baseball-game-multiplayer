import { useEffect } from "react";
import Loading from "./Loading";
import { useHoldTrigger } from "../hooks/hold-trigger";

const UTILITY_HOLD_MS = 2000;

function UtilityButtons({ onSuper, onUtilityButton, role }) {
  const superHold = useHoldTrigger(onSuper, UTILITY_HOLD_MS);
  const utilityHold = useHoldTrigger(() => onUtilityButton(role), UTILITY_HOLD_MS);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key.toLowerCase() === "r") {
        superHold.startHold();
      }
      if (e.key.toLowerCase() === "t") {
        utilityHold.startHold();
      }
    }

    function handleKeyUp(e) {
      if (e.key.toLowerCase() === "r") {
        superHold.cancelHold();
      }
      if (e.key.toLowerCase() === "t") {
        utilityHold.cancelHold();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    superHold.startHold,
    superHold.cancelHold,
    utilityHold.startHold,
    utilityHold.cancelHold,
  ]);

  if (!role) return <Loading />;

  return (
    <div className="flex gap-3 mt-4">
      <div className="relative">
        <div 
          className="absolute -inset-1 rounded pointer-events-none" 
          style={{
            background: `conic-gradient(
              from 0deg,
              white 0%,
              white ${superHold.progress * 100}%,
              transparent ${superHold.progress * 100}%,
              transparent 100%
            )`,
          }}
        />
        <button
          type="button"
          className="relative z-10 p-2 rounded border-2 cursor-pointer text-white text-center w-24 border-gray-600 bg-gray-800"
          onMouseDown={superHold.startHold}
          onMouseUp={superHold.cancelHold}
          onMouseLeave={superHold.cancelHold}
        >
          <div className="text-yellow-400 font-bold text-sm">R</div>
          <div className="text-xs">Super</div>
          <div className="text-[10px] text-gray-400">(Coming soon)</div>
        </button>
      </div>

      <div className="relative">
        <div 
          className="absolute -inset-1 rounded pointer-events-none"
          style={{
            background: `conic-gradient(
              from 0deg,
              white 0%,
              white ${utilityHold.progress * 100}%,
              transparent ${utilityHold.progress * 100}%,
              transparent 100%
            )`,
          }}
        />
        <button
          type="button"
          className="relative z-10 p-2 rounded border-2 cursor-pointer text-white text-center w-24 border-gray-600 bg-gray-800"
          onMouseDown={utilityHold.startHold}
          onMouseUp={utilityHold.cancelHold}
          onMouseLeave={utilityHold.cancelHold}
        >
          <div className="text-yellow-400 font-bold text-sm">T</div>
          {role === "pitcher" ? (
            <div className="text-xs">Walk</div>
          ) : (
            <div className="text-xs">Coming Soon</div>
          )}
          {role === "pitcher" ? (
            <div className="text-[10px] text-gray-400">Walk the batter</div>
          ) : (
            <div className="text-[10px] text-gray-400">Coming Soon</div>
          )}
        </button>
      </div>
    </div>
  );
}

export default UtilityButtons;
