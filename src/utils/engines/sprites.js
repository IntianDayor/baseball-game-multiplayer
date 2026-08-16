export const BALL_DISPLAY_SIZE = 24;

export const BALL_SPRITE = {
    SOURCE_FRAME_SIZE: 128,
    COLUMNS: 8,
    ROWS: 20,
    FRAMES_PER_SPIN: 32,
};

export const SPIN_ROWS = {
    BACKSPIN: 0,
    TOPSPIN: 4,
    SIDESPIN: 8,
    COMBINED: 12,
    UNSTABLE: 16,
};

export function getFrames(t, totalFrames, spinRate = 1, spinDirection = 1) {
    const rawFrame = Math.floor(
        t * totalFrames * spinRate
    );

    const frame = rawFrame * spinDirection;

    return ((frame % totalFrames) + totalFrames) % totalFrames;
}

export function getScaledSpritePosition(
    frameIndex,
    sourceFrameSize,
    displaySize,
    columns,
    spinRow
) {
    const scale = displaySize / sourceFrameSize;

    const col = frameIndex % columns;

    const row = spinRow + Math.floor(frameIndex / columns);

    return {
        width: displaySize,
        height: displaySize,

        backgroundPosition: `
            -${col * sourceFrameSize * scale}px
            -${row * sourceFrameSize * scale}px
        `,

        backgroundSize: `
            ${columns * sourceFrameSize * scale}px
            ${BALL_SPRITE.ROWS * sourceFrameSize * scale}px
        `,
    };
}

export function getSpinRow(spinType) {
    return SPIN_ROWS[spinType] ?? SPIN_ROWS.BACKSPIN;
}