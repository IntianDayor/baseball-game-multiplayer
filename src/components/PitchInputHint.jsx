import rightClickIcon from "../assets/Icons/UI/right-click-1.svg";
import leftClickIcon from "../assets/Icons/UI/left-click-1.svg";

function PitchInputHint({ cursorPos, crosshairSize, isCharging, hasActivePitch }) {
  if (hasActivePitch) return null;

  const active = isCharging
    ? { icon: rightClickIcon, label: "Cancel", xOffset: +18 }
    : { icon: leftClickIcon, label: "Charge Pitch", xOffset: -18 };

  const gap = 4;
  
  return (
    <div
      className="absolute pointer-events-none flex flex-col items-center gap-1"
      style={{
        left: cursorPos.x + active.xOffset,
        top: cursorPos.y + crosshairSize / 2 + gap,
        transform: "translate(-50%, 0)",
        zIndex: "100",
      }}
    >
        <div className="rounded-full p-1">
            <img src={active.icon} className="w-4 h-4" />
        </div>
        <div className="text-white text-[8px] font-bold">
          {active.label}
        </div>
    </div>
  );
}

export default PitchInputHint;
