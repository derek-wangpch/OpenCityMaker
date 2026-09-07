import { describe, expect, it } from "vitest";
import { PerspectiveCamera, Vector3 } from "three";
import {
  BOARD_CAMERA,
  boardCameraPosition,
  boardFieldOfView,
  directionGlyph,
  keyboardDirection,
  normalizeRotation,
  projectDirection,
  swipeDirection,
} from "../src/game/boardRotation";
import { slide, type Direction } from "../src/game/engine";

const axes: Record<Direction, [number, number, number]> = {
  left: [-1, 0, 0],
  right: [1, 0, 0],
  up: [0, 0, -1],
  down: [0, 0, 1],
};
const directions = Object.keys(axes) as Direction[];

it("preserves the original viewing direction at distance 60 and takes eight equal steps", () => {
  const initial = boardCameraPosition(0);
  const radius = Math.hypot(initial.x, initial.z);
  expect(initial.x / initial.z).toBeCloseTo(9 / 12);
  expect((initial.y - 0.4) / radius).toBeCloseTo(10.6 / 15);
  expect(Math.hypot(radius, initial.y - 0.4)).toBeCloseTo(60);
  expect(BOARD_CAMERA.targetY).toBe(0.4);
  expect(boardCameraPosition(8)).toEqual(boardCameraPosition(0));
  expect(normalizeRotation(-1)).toBe(7);
  expect(normalizeRotation(8)).toBe(0);
  for (let step = 0; step < 8; step++) {
    const a = boardCameraPosition(step),
      b = boardCameraPosition(step + 1);
    expect(Math.hypot(a.x, a.z)).toBeCloseTo(radius);
    expect((a.x * b.x + a.z * b.z) / radius ** 2).toBeCloseTo(Math.SQRT1_2);
    expect(a.z * b.x - a.x * b.z).toBeGreaterThan(0);
    expect(boardCameraPosition(normalizeRotation(step + 1 - 1))).toEqual(a);
  }
});

describe.each(Array.from({ length: 8 }, (_, i) => i))(
  "rotation step %i",
  (step) => {
    it("matches perspective grid directions on every tile, including near and far corners", () => {
      const camera = new PerspectiveCamera(boardFieldOfView(12), 1, 0.1, 200);
      const position = boardCameraPosition(step);
      camera.position.set(position.x, position.y, position.z);
      camera.lookAt(0, 0.4, 0);
      camera.updateMatrixWorld();
      const board = [2, 2, 4, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let index = 0; index < 16; index++) {
        const point = new Vector3(
          ((index % 4) - 1.5) * 1.88,
          0,
          (Math.floor(index / 4) - 1.5) * 1.88,
        );
        const origin = point.clone().project(camera);
        for (const direction of directions) {
          const projected = new Vector3(...axes[direction])
            .add(point)
            .project(camera)
            .sub(origin);
          const dx = projected.x * 1200,
            dy = -projected.y * 1200;
          const computed = projectDirection(direction, step, point);
          const length = Math.hypot(computed.x, computed.y);
          expect(computed.x / length).toBeCloseTo(dx / Math.hypot(dx, dy));
          expect(computed.y / length).toBeCloseTo(dy / Math.hypot(dx, dy));
          for (const [jitterX, jitterY] of [
            [0, 0],
            [2, -2],
            [-2, 2],
          ]) {
            const actual = swipeDirection(
              dx + jitterX,
              dy + jitterY,
              step,
              point,
            );
            expect(actual).toBe(direction);
            expect(slide(board, actual!)).toEqual(slide(board, direction));
          }
        }
      }
    });
    it("gives keys four distinct moves that agree with cardinal swipes", () => {
      const mapped = directions.map((key) => keyboardDirection(key, step));
      expect(new Set(mapped).size).toBe(4);
      for (const [key, dx, dy] of [
        ["up", 0, -150],
        ["right", 150, 0],
        ["down", 0, 150],
        ["left", -150, 0],
      ] as const) {
        expect(swipeDirection(dx, dy, step)).toBe(keyboardDirection(key, step));
      }
      expect(swipeDirection(12, 12, step)).toBeNull();
      expect(swipeDirection(0, 0, step)).toBeNull();
    });
  },
);

it("matches target-plane framing while making distant tiles smaller", () => {
  const camera = new PerspectiveCamera(boardFieldOfView(12), 1, 0.1, 200);
  const position = boardCameraPosition(0);
  camera.position.set(position.x, position.y, position.z);
  camera.lookAt(0, 0.4, 0);
  camera.updateMatrixWorld();
  const forward = camera.getWorldDirection(new Vector3());
  const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  const target = new Vector3(0, 0.4, 0);
  const projectedWidth = (depth: number) => {
    const center = target.clone().addScaledVector(forward, depth);
    const a = center.clone().addScaledVector(right, -0.88).project(camera);
    const b = center.clone().addScaledVector(right, 0.88).project(camera);
    return b.x - a.x;
  };
  expect(projectedWidth(0)).toBeCloseTo((2 * 1.76) / 12);
  expect(projectedWidth(4)).toBeLessThan(projectedWidth(-4));
});

it("keeps default keyboard cues and reverses logical axes after a half turn", () => {
  expect(directions.map((d) => keyboardDirection(d, 0))).toEqual(directions);
  expect(directions.map((d) => directionGlyph(d, 0))).toEqual([
    "↖",
    "↘",
    "↗",
    "↙",
  ]);
  expect(keyboardDirection("left", 4)).toBe("right");
  expect(keyboardDirection("up", 4)).toBe("down");
});
