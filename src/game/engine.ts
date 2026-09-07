export type Direction = "up" | "down" | "left" | "right";
export type Board = number[];
export type Status = "playing" | "won" | "lost";
export interface Snapshot {
  board: Board;
  score: number;
}
export interface Run extends Snapshot {
  status: Status;
  /** Missing flags in legacy saves mean false. Achievements survive undo. */
  hasWon?: boolean;
  continued?: boolean;
  undo: Snapshot | null;
}
export interface Movement {
  from: number;
  to: number;
  value: number;
  merged: boolean;
}
export interface MoveResult {
  run: Run;
  events: Movement[];
  spawned: number | null;
  changed: boolean;
}
export const VALUES = Array.from({ length: 11 }, (_, i) => 2 ** (i + 1));
export function isTileValue(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 2 &&
    2 ** Math.round(Math.log2(value)) === value
  );
}
const canMerge = (a: number, b: number) => a === b && isTileValue(a * 2);
export function getStatus(
  board: Board,
  continued = false,
  hasWon = board.some((v) => v >= 2048),
): Status {
  if (hasWon && !continued) return "won";
  if (board.includes(0)) return "playing";
  for (let i = 0; i < 16; i++) {
    if (i % 4 < 3 && canMerge(board[i], board[i + 1])) return "playing";
    if (i < 12 && canMerge(board[i], board[i + 4])) return "playing";
  }
  return "lost";
}
export function spawn(
  board: Board,
  random: () => number = Math.random,
): { board: Board; index: number | null } {
  const empty = board.flatMap((v, i) => (v === 0 ? [i] : []));
  if (!empty.length) return { board: [...board], index: null };
  const index =
    empty[Math.min(empty.length - 1, Math.floor(random() * empty.length))];
  const next = [...board];
  next[index] = random() < 0.9 ? 2 : 4;
  return { board: next, index };
}
export function newRun(random: () => number = Math.random): Run {
  return {
    board: spawn(spawn(Array(16).fill(0), random).board, random).board,
    score: 0,
    status: "playing",
    undo: null,
  };
}
export function slide(
  board: Board,
  direction: Direction,
): { board: Board; points: number; events: Movement[] } {
  const next = Array(16).fill(0);
  const events: Movement[] = [];
  let points = 0;
  for (let line = 0; line < 4; line++) {
    const indices = Array.from({ length: 4 }, (_, offset) => {
      switch (direction) {
        case "left":
          return line * 4 + offset;
        case "right":
          return line * 4 + 3 - offset;
        case "up":
          return offset * 4 + line;
        case "down":
          return (3 - offset) * 4 + line;
      }
    });
    const occupied = indices.filter((i) => board[i]);
    let target = 0;
    for (let j = 0; j < occupied.length; j++) {
      const from = occupied[j],
        value = board[from],
        to = indices[target++];
      const merged =
        j + 1 < occupied.length && canMerge(value, board[occupied[j + 1]]);
      next[to] = merged ? value * 2 : value;
      events.push({ from, to, value, merged });
      if (merged) {
        events.push({ from: occupied[++j], to, value, merged });
        points += value * 2;
      }
    }
  }
  return { board: next, points, events };
}
export function move(
  run: Run,
  direction: Direction,
  random: () => number = Math.random,
): MoveResult {
  const unchanged = { run, changed: false, events: [], spawned: null };
  if (run.status !== "playing") return unchanged;
  const result = slide(run.board, direction);
  if (result.board.every((v, i) => v === run.board[i])) return unchanged;
  const added = spawn(result.board, random);
  const hasWon = run.hasWon || added.board.some((v) => v >= 2048);
  return {
    run: {
      ...(hasWon ? { hasWon: true } : {}),
      ...(run.continued ? { continued: true } : {}),
      board: added.board,
      score: run.score + result.points,
      status: getStatus(added.board, run.continued, hasWon),
      undo: { board: [...run.board], score: run.score },
    },
    events: result.events,
    spawned: added.index,
    changed: true,
  };
}
export function continueRun(run: Run): Run {
  if (run.status !== "won") return run;
  return {
    ...run,
    hasWon: true,
    continued: true,
    status: getStatus(run.board, true),
  };
}
export function undo(run: Run): Run {
  return run.undo
    ? {
        ...run,
        ...run.undo,
        board: [...run.undo.board],
        status: getStatus(run.undo.board, run.continued, run.hasWon),
        undo: null,
      }
    : run;
}
