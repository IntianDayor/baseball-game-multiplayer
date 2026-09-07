import { clamp } from "../../lib/math";

const MIN_POWER_FACTOR = 0.75;
const MAX_POWER_FACTOR = 1.6;
const MIN_SPREAD_FACTOR = 0.8;
const MAX_SPREAD_FACTOR = 1.8;
const MAX_BREAK_PX = 50;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function resolveBreak(breakX, breakY) {
  const bx = breakX === "random" ? randomRange(-4, 4) : breakX;
  const by = breakY === "random" ? randomRange(-4, 4) : breakY;
  return { bx, by };
}

export function resolveMovement(pitch, power = 0) {
  const { breakX = 0, breakY = 0 } = pitch;

  const { bx, by } = resolveBreak(breakX, breakY);
  const breakMagnitude = Math.sqrt(bx * bx + by * by);

  const powerFactor =
    MIN_POWER_FACTOR + (power / 4) * (MAX_POWER_FACTOR - MIN_POWER_FACTOR);
  const movementScale = (4 + breakMagnitude * 0.5) * powerFactor;

  const moveX = bx * movementScale;
  const moveY = -by * movementScale;

  return { moveX, moveY, movementScale, breakMagnitude };
}

export function resolvePitchLocation(pitch, { aim_x, aim_y, power = 0 }) {
  const {
    speed = 5,
    chaos = false,
    disguised = false,
  } = pitch;

  // MOVEMENT MODEL
  const {
    moveX: rawMoveX,
    moveY: rawMoveY,
    movementScale,
    breakMagnitude,
  } = resolveMovement(pitch, power);

  const powerSpreadFactor = MIN_SPREAD_FACTOR + (power / 4) * (MAX_SPREAD_FACTOR - MIN_SPREAD_FACTOR);

  const moveX = clamp(rawMoveX, -MAX_BREAK_PX, MAX_BREAK_PX);
  const moveY = clamp(rawMoveY, -MAX_BREAK_PX, MAX_BREAK_PX);

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
  const hintBias = 0.25;
  const predictedX = aim_x + moveX * hintBias;
  const predictedY = aim_y + moveY * hintBias;
  
  let hintRadius = 20;

  if (chaos) hintRadius = 38;
  else if (disguised) hintRadius = 6;
  else hintRadius = clamp(10 + breakMagnitude * 2.2, 8, 26);

  return {
    hint_x: predictedX,
    hint_y: predictedY,
    final_x,
    final_y,
    breakScale: hintRadius,
    movementScale,
  };
}
