import { buildingForValue } from "./cities/types";
import { ArrowRight, House, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { UNDO_ENABLED, type GameController } from "./game/useGame";
/**
 * Screen-reader mirror of the 4×4 board. Each building is a button opening the
 * same card a click on its model opens, which is the keyboard path to it. The
 * mirror is hidden until one of those buttons takes focus, so a sighted
 * keyboard user can see where they are (see `.board-mirror` in styles.css).
 */
export function BoardTable({ game }: { game: GameController }) {
  const { current, city, locale, t, inspect } = game;
  return (
    <div className="sr-only board-mirror" role="table" aria-label={t.board}>
      {Array.from({ length: 4 }, (_, row) => (
        <div role="row" key={row}>
          {current.run.board.slice(row * 4, row * 4 + 4).map((value, col) => {
            const building = buildingForValue(city, value);
            return (
              <span role="cell" key={col}>
                {building ? (
                  <button
                    aria-label={`${value} ${building.name[locale]} · ${t.openCard}`}
                    onClick={() => inspect(value)}
                  >
                    <b>{value}</b> {building.name[locale]}
                  </button>
                ) : (
                  t.empty
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
/** Deadlock recovery stays on the board; victory is rendered outside it. */
export function EndOverlay({ game }: { game: GameController }) {
  if (game.current.run.status !== "lost") return null;
  return (
    <EndPanel
      key={`${game.city.id}:${game.current.session.id}:${game.current.run.status}`}
      game={game}
    />
  );
}
/** Each layout gives the victory notice its own space outside the canvas. */
export function VictoryNotice({ game }: { game: GameController }) {
  if (game.current.run.status !== "won") return null;
  return (
    <div className="victory-slot">
      <EndPanel
        key={`${game.city.id}:${game.current.session.id}`}
        game={game}
      />
    </div>
  );
}
function EndPanel({ game }: { game: GameController }) {
  const { current, t, restart, doUndo, keepBuilding } = game;
  const won = current.run.status === "won";
  const [ready, setReady] = useState(won);
  const [inspecting, setInspecting] = useState(false);
  useEffect(() => {
    if (won) return;
    // Let the last slide and spawn settle before explaining the deadlock.
    const timer = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(timer);
  }, [won]);
  if (!ready) return null;
  if (inspecting)
    return (
      <div className="end-review">
        <button className="secondary" onClick={() => setInspecting(false)}>
          {t.showResult}
        </button>
      </div>
    );
  return (
    <div className={`end-overlay ${won ? "celebration" : "end-loss"}`}>
      <div>
        <div className={won ? "victory-heading" : undefined}>
          <span className="end-icon">
            {won ? <Sparkles size={20} /> : <House size={32} />}
          </span>
          <h2>{won ? t.won : t.lost}</h2>
          {won && (
            <button
              className="victory-dismiss"
              aria-label={t.inspectBoard}
              title={t.inspectBoard}
              onClick={() => setInspecting(true)}
            >
              <X size={16} />
            </button>
          )}
        </div>
        <p>
          {won ? t.wonBody : current.run.hasWon ? t.completedBody : t.lostBody}
        </p>
        <div className={won ? "victory-actions" : undefined}>
          {!won && (
            <button className="secondary" onClick={() => setInspecting(true)}>
              {t.inspectBoard}
            </button>
          )}
          {won && (
            <button className="primary" onClick={keepBuilding}>
              {t.continueBuilding}
              <ArrowRight size={16} />
            </button>
          )}
          <button className={won ? "secondary" : "primary"} onClick={restart}>
            {t.again}
            <ArrowRight size={16} />
          </button>
          {UNDO_ENABLED && current.run.undo && (
            <button className="text-button" onClick={doUndo}>
              {t.undo}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
/** Polite announcements for moves, discoveries and end states. */
export function LiveRegion({ game }: { game: GameController }) {
  const { announcement, current, t } = game;
  return (
    <div className="sr-only" role="status" aria-live="polite">
      {announcement}{" "}
      {current.run.status === "won"
        ? t.statusWon
        : current.run.status === "lost"
          ? t.statusLost
          : ""}
    </div>
  );
}
