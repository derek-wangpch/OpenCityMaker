export type Direction = "up" | "down" | "left" | "right";
export type Board = number[];
export type Status = "playing" | "won" | "lost";
export interface Snapshot {
  board: Board;
  score: number;
}
export interface Run extends Snapshot {
  status: Status;
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
export function getStatus(board: Board): Status {
  if (board.includes(2048)) return "won";
  if (board.includes(0)) return "playing";
  for (let i = 0; i < 16; i++) {
    if (i % 4 < 3 && board[i] === board[i + 1]) return "playing";
    if (i < 12 && board[i] === board[i + 4]) return "playing";
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
        j + 1 < occupied.length &&
        value === board[occupied[j + 1]] &&
        value < 2048;
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
  return {
    run: {
      board: added.board,
      score: run.score + result.points,
      status: getStatus(added.board),
      undo: { board: [...run.board], score: run.score },
    },
    events: result.events,
    spawned: added.index,
    changed: true,
  };
}
export function undo(run: Run): Run {
  return run.undo
    ? {
        ...run.undo,
        board: [...run.undo.board],
        status: getStatus(run.undo.board),
        undo: null,
      }
    : run;
}
