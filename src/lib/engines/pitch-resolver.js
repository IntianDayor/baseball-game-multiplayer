/* MATH FUNCTIONS */
const MIN_POWER_FACTOR = 0.75;
const MAX_POWER_FACTOR = 1.6;
const MIN_SPREAD_FACTOR = 0.8;
const MAX_SPREAD_FACTOR = 1.8;

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

export function resolvePitchLocation(pitch, {aim_x, aim_y, power = 0}) {
  const {
    breakX = 0,
    breakY = 0,
    speed = 5,
    chaos = false,
    disguised = false,
  } = pitch;

  // BREAK RESOLUTION //
  const { bx, by } = resolveBreak(breakX, breakY);

  const breakMagnitude = Math.sqrt(bx * bx + by * by);

  const powerFactor = MIN_POWER_FACTOR + (power / 4) * (MAX_POWER_FACTOR - MIN_POWER_FACTOR);
  const powerSpreadFactor = MIN_SPREAD_FACTOR + (power / 4) * (MAX_SPREAD_FACTOR - MIN_SPREAD_FACTOR);

  // MOVEMENT MODEL (core physics) //
  const movementScale = (4 + breakMagnitude * 1.8) * powerFactor;

  const moveX = bx * movementScale;
  const moveY = -by * movementScale;

  // CONTROL / ACCURACY MODEL //
  const speedFactor = clamp(speed / 10, 0.25, 1);

  let controlSpread = clamp(16 * (1 - speedFactor), 3, 14);
  if (chaos) controlSpread = 30;
  if (disguised) controlSpread *= 1.2;

  controlSpread *= powerSpreadFactor;

  const noiseX = randomRange(-controlSpread, controlSpread);
  const noiseY = randomRange(-controlSpread, controlSpread);

  // FINAL BALL POSITION //
  const final_x = aim_x + moveX + noiseX;
  const final_y = aim_y + moveY + noiseY;

  // HINT SYSTEM //
  const hintBias = 0.25; // how close hint is to real movement

  const predictedX = aim_x + moveX * hintBias;
  const predictedY = aim_y + moveY * hintBias;

  // hint uncertainty = depends on chaos + break
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
    movementScale
  };
}