
export function calculateHint(pitch) {

    const breakX = pitch.breakX;
    const breakY = pitch.breakY;
    const isChaos = pitch.chaos;
    const isDisguised = pitch.disguised;

    let finalBreakX = typeof breakX === 'string' ? Math.random() * 40 - 20 : breakX;
    let finalBreakY = typeof breakY === 'string' ? Math.random() * 40 - 20 : breakY;
    let offsetX, offsetY;

    if (!isChaos) { // SMALL VARIATION FOR NOT CHAOS PITCH
        offsetX = finalBreakX + Math.random() * 4 - 2;
        offsetY = finalBreakY + Math.random() * 4 - 2;
    } else { // BIG VARIATION FOR CHAOS PITCH
        offsetX = Math.random() * 40 - 20;
        offsetY = Math.random() * 40 - 20;
    }

    return {
        hint_x: pitch.aim_x + offsetX,
        hint_y: pitch.aim_y + offsetY
    }
    
}