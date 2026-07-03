export const BALL_DISPLAY_SIZE = 24;

export function getFrames(t, totalFrames) {
    return Math.min(Math.floor(t * totalFrames), totalFrames - 1);
}

export function getScaledSpritePosition(frameIndex, sourceFrameSize, displaySize, columns, rows) {
    
    const scale = displaySize / sourceFrameSize;
    const raw = getBackgroundPosition(frameIndex, sourceFrameSize, columns, sourceFrameSize);
    
    const scaledX = raw.x * scale;
    const scaledY = raw.y * scale;

    const scaledSheetWidth = columns * sourceFrameSize * scale;
    const scaledSheetHeight = rows * sourceFrameSize * scale;

    return {
        width: displaySize,
        height: displaySize,
        backgroundPosition: `-${scaledX}px -${scaledY}px`,
        backgroundSize: `${scaledSheetWidth}px ${scaledSheetHeight}px`
    };
}

function getBackgroundPosition(frameIndex, frameWidth, columns, frameHeight) {

    const col = frameIndex % columns;
    const row = Math.floor(frameIndex / columns);

    return {
        x: col * frameWidth,
        y: row * frameHeight,
    }
}