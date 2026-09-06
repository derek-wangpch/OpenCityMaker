import { describe, it, expect } from "vitest";
import {
  getStatus,
  move,
  newRun,
  slide,
  spawn,
  undo,
  type Run,
} from "../src/game/engine";
const board = (row: number[]) => [...row, ...Array(16 - row.length).fill(0)];
const run = (values: number[]): Run => ({
  board: board(values),
  score: 0,
  status: "playing",
  undo: null,
});
describe("2048 rules", () => {
  it("starts with exactly two homes and consumes injected randomness", () => {
    expect(newRun(() => 0).board).toEqual(board([2, 2]));
  });
  it("merges each tile only once in traversal order", () => {
    expect(slide(board([2, 2, 2, 2]), "left").board.slice(0, 4)).toEqual([
      4, 4, 0, 0,
    ]);
    expect(slide(board([2, 2, 4, 0]), "left").board.slice(0, 4)).toEqual([
      4, 4, 0, 0,
    ]);
    expect(slide(board([4, 2, 2, 0]), "right").board.slice(0, 4)).toEqual([
      0, 0, 4, 4,
    ]);
    expect(slide(board([2, 0, 2, 2]), "right").board.slice(0, 4)).toEqual([
      0, 0, 2, 4,
    ]);
  });
  it("handles all axes and movement provenance", () => {
    const input = board([2, 0, 0, 0, 2]);
    const up = slide(input, "up");
    expect(up.board[0]).toBe(4);
    expect(up.points).toBe(4);
    expect(up.events).toEqual([
      { from: 0, to: 0, value: 2, merged: true },
      { from: 4, to: 0, value: 2, merged: true },
    ]);
    const down = slide(input, "down");
    expect(down.board[12]).toBe(4);
    expect(slide(board([2, 0, 2, 0]), "right").board[3]).toBe(4);
  });
  it("never spawns or consumes random numbers on invalid or finished moves", () => {
    const random = () => {
      throw new Error("Unexpected RNG");
    };
    expect(move(run([2]), "left", random).changed).toBe(false);
    expect(
      move({ ...run([2048]), status: "won" }, "right", random).changed,
    ).toBe(false);
  });
  it("selects empty cells uniformly and uses the exact 90% boundary", () => {
    for (const [chance, value] of [
      [0, 2],
      [0.899999, 2],
      [0.9, 4],
      [0.999, 4],
    ]) {
      let calls = 0;
      const result = spawn(board([2]), () => (calls++ === 0 ? 0.5 : chance));
      expect(result.index).toBe(8);
      expect(result.board[8]).toBe(value);
    }
    expect(
      spawn(Array(16).fill(2), () => {
        throw new Error();
      }).index,
    ).toBe(null);
  });
  it("adds merge score, spawns once and restores exactly one move", () => {
    const initial = { ...run([2, 2, 4, 4]), score: 16 };
    const result = move(initial, "left", () => 0);
    expect(result.run.score).toBe(28);
    expect(result.run.board.slice(0, 4)).toEqual([4, 8, 2, 0]);
    expect(undo(result.run)).toEqual(initial);
    expect(undo(undo(result.run))).toEqual(initial);
    expect(initial.board).toEqual(board([2, 2, 4, 4]));
  });
  it("detects a win and stops subsequent moves", () => {
    const result = move(run([1024, 1024]), "left", () => 0);
    expect(result.run.status).toBe("won");
    expect(result.run.score).toBe(2048);
    expect(move(result.run, "right").changed).toBe(false);
  });
  it("distinguishes a dead board from available horizontal/vertical merges", () => {
    const dead = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
    expect(getStatus(dead)).toBe("lost");
    expect(getStatus([...dead.slice(0, 15), 0])).toBe("playing");
    const horizontal = [...dead];
    horizontal[0] = 4;
    expect(getStatus(horizontal)).toBe("playing");
    const vertical = [...dead];
    vertical[4] = 2;
    expect(getStatus(vertical)).toBe("playing");
  });
  it("conserves tile mass before spawning across random boards and directions", () => {
    let seed = 17;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
    for (let n = 0; n < 100; n++) {
      const input = Array.from({ length: 16 }, () =>
        random() < 0.3 ? 0 : 2 ** (1 + Math.floor(random() * 8)),
      );
      for (const direction of ["up", "down", "left", "right"] as const) {
        const result = slide(input, direction);
        expect(result.board.reduce((a, b) => a + b, 0)).toBe(
          input.reduce((a, b) => a + b, 0),
        );
        expect(result.events.length).toBe(input.filter(Boolean).length);
      }
    }
  });
});
