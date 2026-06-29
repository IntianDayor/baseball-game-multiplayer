export function getFrames(t, totalFrames) {
    return Math.min(Math.floor(t * totalFrames), totalFrames - 1);
}

export function getBackgroundPosition(frameIndex, frameWidth, row, frameHeight) {
    return `-${frameIndex * frameWidth}px -${row * frameHeight}px`;
}