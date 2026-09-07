import { RotateCcw, RotateCw } from "lucide-react";
import type { GameController } from "./game/useGame";

export function BoardRotationControls({ game }: { game: GameController }) {
  return (
    <div
      className="board-rotation"
      role="group"
      aria-label={game.t.rotateBoard}
    >
      <button
        title={game.t.rotateBoardCounterclockwise}
        aria-label={game.t.rotateBoardCounterclockwise}
        onClick={() => game.rotateBoard(-1)}
      >
        <RotateCcw size={19} />
      </button>
      <span aria-hidden="true">45°</span>
      <button
        title={game.t.rotateBoardClockwise}
        aria-label={game.t.rotateBoardClockwise}
        onClick={() => game.rotateBoard(1)}
      >
        <RotateCw size={19} />
      </button>
    </div>
  );
}
