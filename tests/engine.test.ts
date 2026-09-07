import { describe, it, expect } from "vitest";
import {
  continueRun,
  isTileValue,
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

describe("continued cities", () => {
  it("acknowledges a win without changing the board, score, or undo", () => {
    const won = move(run([1024, 1024]), "left", () => 0).run;
    const continued = continueRun(won);
    expect(continued).toEqual({
      ...won,
      hasWon: true,
      continued: true,
      status: "playing",
    });
    expect(continueRun(continued)).toBe(continued);
    expect(move(continued, "right", () => 0).run.status).toBe("playing");
  });
  it("merges extended values once, awards points, and never celebrates again", () => {
    const continued = {
      ...run([2048, 2048, 4096, 4096]),
      hasWon: true,
      continued: true,
    };
    const first = move(continued, "left", () => 0);
    expect(first.run.board.slice(0, 4)).toEqual([4096, 8192, 2, 0]);
    expect(first.run.score).toBe(12288);
    expect(first.run.status).toBe("playing");
    expect(
      move({ ...continued, board: board([8192, 8192]) }, "left", () => 0).run
        .board[0],
    ).toBe(16384);
    expect(undo(first.run)).toEqual(continued);
  });
  it("preserves achievement through undo and resets it for a new run", () => {
    const won = move(run([1024, 1024]), "left", () => 0).run;
    expect(undo(won)).toMatchObject({ hasWon: true, status: "won" });
    expect(undo(continueRun(won))).toMatchObject({
      hasWon: true,
      continued: true,
      status: "playing",
    });
    expect(newRun().hasWon).toBeFalsy();
    expect(newRun().continued).toBeFalsy();
  });
  it("detects deadlocks after winning and does not spawn on invalid moves", () => {
    const dead = [4096, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
    expect(continueRun({ ...run(dead), status: "won" }).status).toBe("lost");
    expect(getStatus([4096, 4096, ...dead.slice(2)], true)).toBe("playing");
    const random = () => {
      throw new Error("Unexpected spawn");
    };
    expect(
      move({ ...run([4096, 2]), hasWon: true, continued: true }, "left", random)
        .changed,
    ).toBe(false);
  });
  it("accepts safe powers of two without 32-bit truncation or rounded-log false positives", () => {
    for (const value of [2, 4096, 8192, 2 ** 40, 2 ** 52])
      expect(isTileValue(value)).toBe(true);
    for (const value of [
      0,
      3,
      4097,
      2 ** 50 + 1,
      2 ** 53,
      Infinity,
      NaN,
      "4096",
    ])
      expect(isTileValue(value)).toBe(false);
  });
});
