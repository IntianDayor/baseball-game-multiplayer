import { useState, useEffect } from "react";
import StrikeZone from "./StrikeZone";

function BattingField({ pitches, bats, selected, setSelected }) {

    return (
        <div className="relative w-96 h-96 bg-green-900 rounded cursor-crosshair">
            
            {/* Strike Zone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                < StrikeZone pitches={pitches} selected={selected} />
            </div>
        </div>
    );
}

export default BattingField;