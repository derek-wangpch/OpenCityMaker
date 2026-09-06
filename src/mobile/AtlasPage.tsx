import { ChevronLeft } from "lucide-react";
import { AtlasGrid } from "../AtlasGrid";
import { useThumbnails } from "../scene/useThumbnails";
import type { GameController } from "../game/useGame";
import type { Route } from "../useHashRoute";
export function AtlasPage({
  game,
  from,
  back,
}: {
  game: GameController;
  from: Route;
  back: () => void;
}) {
  const { city, current, locale, t } = game;
  const { thumb } = useThumbnails(city, false);
  // The atlas opens from the start page and from the board, so the back button
  // returns to whichever one opened it.
  const label = from === "play" ? t.back : t.home;
  return (
    <section className="mobile-page mobile-atlas">
      <div className="mobile-topbar">
        <button className="icon-button" aria-label={label} onClick={back}>
          <ChevronLeft size={22} />
        </button>
        <h1>{t.atlas}</h1>
        <span className="mobile-topbar-meta">
          {city.name[locale]} · {current.discovered.length} / 11
        </span>
      </div>
      <AtlasGrid packs={[city]} game={game} thumb={thumb} />
    </section>
  );
}
