function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function resolveBreak(breakX, breakY) {
  const bx = breakX === "random" ? randomRange(-4, 4) : breakX;
  const by = breakY === "random" ? randomRange(-4, 4) : breakY;
  return { bx, by };
}

export function resolvePitchLocation(pitch) {
  const {
    aim_x,
    aim_y,
    breakX = 0,
    breakY = 0,
    speed = 5,
    chaos = false,
    disguised = false,
  } = pitch;

  const { bx, by } = resolveBreak(breakX, breakY);

  const breakMagnitude = Math.sqrt(bx * bx + by * by);

  const movementScale = 4 + breakMagnitude * 1.8;

  const moveX = bx * movementScale;
  const moveY = by * movementScale;

  const speedFactor = clamp(speed / 10, 0.25, 1);

  let controlSpread = clamp(16 * (1 - speedFactor), 3, 14);

  if (chaos) controlSpread = 30;

  if (disguised) controlSpread *= 1.2;

  const noiseX = randomRange(-controlSpread, controlSpread);
  const noiseY = randomRange(-controlSpread, controlSpread);

  const final_x = aim_x + moveX + noiseX;
  const final_y = aim_y + moveY + noiseY;

  const hintBias = 0.25;

  const predictedX = aim_x + moveX * hintBias;
  const predictedY = aim_y + moveY * hintBias;

  let hintRadius;

  if (chaos) {
    hintRadius = 38;
  } else if (disguised) {
    hintRadius = 6;
  } else {
    hintRadius = clamp(10 + breakMagnitude * 2.2, 8, 26);
  }

  return {
    hint_x: predictedX,
    hint_y: predictedY,
    final_x,
    final_y,
    breakScale: hintRadius,
  };
}