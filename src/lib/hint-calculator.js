
export function calculateHint(pitch) {

    const breakX = pitch.breakX;
    const breakY = pitch.breakY;
    const isChaos = pitch.chaos;

    let finalBreakX = typeof breakX === 'string' ? Math.random() * 40 - 20 : breakX;
    let finalBreakY = typeof breakY === 'string' ? Math.random() * 40 - 20 : breakY;

    const amplifiedX = finalBreakX * 8
    const amplifiedY = finalBreakY * 8

    const jitterRange = Math.max(4, (Math.abs(finalBreakX) + Math.abs(finalBreakY)) * 3)
    
    const MAX_HINT_RADIUS = 20;
    const hintRadius = isChaos
        ? MAX_HINT_RADIUS
        : Math.min(jitterRange, MAX_HINT_RADIUS);

    let offsetX, offsetY

    if (!isChaos) {
        // Hint is offset by break direction + random variation based on break amount
        offsetX = amplifiedX + (Math.random() * jitterRange - jitterRange / 2)
        offsetY = amplifiedY + (Math.random() * jitterRange - jitterRange / 2)
    } else {

        offsetX = Math.random() * 80 - 40
        offsetY = Math.random() * 80 - 40
    }

    return {
        hint_x: pitch.aim_x + offsetX,
        hint_y: pitch.aim_y + offsetY,
        breakScale: hintRadius
    }

}