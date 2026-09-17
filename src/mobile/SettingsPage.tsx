import { ChevronLeft } from "lucide-react";
import { Settings } from "../Settings";
import type { GameController } from "../game/useGame";
import type { Route } from "../useHashRoute";
export function SettingsPage({
  game,
  from,
  back,
}: {
  game: GameController;
  from: Route;
  back: () => void;
}) {
  const { t } = game;
  // Preferences open from the start page and from the board, so the back button
  // returns to whichever one opened them.
  const label = from === "play" ? t.back : t.home;
  return (
    <section className="mobile-page mobile-settings">
      <div className="mobile-topbar">
        <button className="icon-button" aria-label={label} onClick={back}>
          <ChevronLeft size={22} />
        </button>
        <h1>{t.settings}</h1>
      </div>
      <Settings game={game} />
    </section>
  );
}
