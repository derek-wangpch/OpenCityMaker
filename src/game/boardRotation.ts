import type { Direction } from "./engine";

/** Original viewing direction, with the distant perspective camera from option C. */
export const BOARD_CAMERA = {
  x: 9,
  y: 11,
  z: 12,
  targetY: 0.4,
  distance: 60,
} as const;
const radius = Math.hypot(BOARD_CAMERA.x, BOARD_CAMERA.z);
const rise = BOARD_CAMERA.y - BOARD_CAMERA.targetY;
export const ORIGINAL_CAMERA_DISTANCE = Math.hypot(radius, rise);
const elevation = rise / ORIGINAL_CAMERA_DISTANCE;
const horizontal = radius / ORIGINAL_CAMERA_DISTANCE;
const orbitRadius = BOARD_CAMERA.distance * horizontal;
const initialAzimuth = Math.atan2(BOARD_CAMERA.x, BOARD_CAMERA.z);
const directions: Direction[] = ["up", "right", "down", "left"];
const axes: Record<Direction, [number, number]> = {
  up: [0, -1],
  right: [1, 0],
  down: [0, 1],
  left: [-1, 0],
};

export const normalizeRotation = (step: number) => ((step % 8) + 8) % 8;
export function readRotation(value: unknown): number | undefined {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value < 8
    ? value
    : undefined;
}
export function boardCameraPosition(step: number) {
  // Orbiting the camera counterclockwise makes the board turn clockwise when seen
  // from above (+x toward +z). The board's own coordinates never change.
  const angle = initialAzimuth + (normalizeRotation(step) * Math.PI) / 4;
  return {
    x: orbitRadius * Math.sin(angle),
    y: BOARD_CAMERA.targetY + BOARD_CAMERA.distance * elevation,
    z: orbitRadius * Math.cos(angle),
  };
}

/** Preserve the original framing at the camera's target plane. */
export const boardFieldOfView = (height: number) =>
  (2 * Math.atan(height / (2 * BOARD_CAMERA.distance)) * 180) / Math.PI;

export type BoardPoint = { x: number; z: number };

/** Project a ground-grid axis at the gesture origin (CSS y points down). */
export function projectDirection(
  direction: Direction,
  step: number,
  origin: BoardPoint = { x: 0, z: 0 },
) {
  const camera = boardCameraPosition(step);
  const sin = camera.x / orbitRadius,
    cos = camera.z / orbitRadius;
  const [x, z] = axes[direction];
  const along = sin * origin.x + cos * origin.z;
  const screenX = cos * origin.x - sin * origin.z;
  const screenY = elevation * along + horizontal * BOARD_CAMERA.targetY;
  const depth =
    BOARD_CAMERA.distance -
    horizontal * along +
    elevation * BOARD_CAMERA.targetY;
  // Perspective makes parallel grid lines converge. The common positive scale
  // factor of the projected vector does not affect the nearest-axis decision.
  const depthChange = horizontal * (sin * x + cos * z);
  return {
    x: cos * x - sin * z + (screenX * depthChange) / depth,
    y: elevation * (sin * x + cos * z) + (screenY * depthChange) / depth,
  };
}

/** Four distinct key slots, with the original arrow/WASD mapping at step zero. */
export function keyboardDirection(key: Direction, step: number): Direction {
  const turns = Math.floor((normalizeRotation(step) + 1) / 2);
  return directions[(directions.indexOf(key) - turns + 4) % 4];
}

export function swipeDirection(
  dx: number,
  dy: number,
  step: number,
  origin?: BoardPoint,
): Direction | null {
  if (Math.hypot(dx, dy) < 25) return null;
  // Nearest visible grid axis. Cardinal ties prefer the corresponding key;
  // iteration order makes any remaining exact tie deterministic.
  const dominant: Direction =
    Math.abs(dx) > Math.abs(dy)
      ? dx < 0
        ? "left"
        : "right"
      : dy < 0
        ? "up"
        : "down";
  let best = keyboardDirection(dominant, step),
    score = -Infinity;
  for (const direction of [best, ...directions]) {
    const axis = projectDirection(direction, step, origin);
    const dot = (dx * axis.x + dy * axis.y) / Math.hypot(axis.x, axis.y);
    if (dot > score + 1e-9) {
      best = direction;
      score = dot;
    }
  }
  return best;
}

export function directionGlyph(direction: Direction, step: number): string {
  const axis = projectDirection(direction, step);
  const eighth = Math.round(Math.atan2(axis.y, axis.x) / (Math.PI / 4));
  return ["→", "↘", "↓", "↙", "←", "↖", "↑", "↗"][normalizeRotation(eighth)];
}
