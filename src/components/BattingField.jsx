import { useState, useEffect } from "react"
import StrikeZone from "./StrikeZone"

function BattingField() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <StrikeZone />
        </div>
    );
}

export default BattingField;