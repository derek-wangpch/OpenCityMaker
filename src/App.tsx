import { useEffect, useState } from "react";
import { cities, validatePacks } from "./cities/packs";
import { browserStorage, freshCity, readSave, type Save } from "./game/storage";
import { modelFactories } from "./scene/models";
import {
  IndexedDbRepository,
  browserDatabase,
  type GameRepository,
} from "./game/repository";
import { useGame } from "./game/useGame";
import { sceneSkyTint } from "./game/weather";
import { MOBILE_QUERY, useMediaQuery } from "./useMediaQuery";
import { DesktopGame } from "./DesktopGame";
import { MobileApp } from "./mobile/MobileApp";
import { browserLocale } from "./game/locale";
import { useTheme } from "./theme";
validatePacks(cities, Object.keys(modelFactories));
function initialSave(): Save {
  const save = readSave(
    browserStorage(),
    cities.map((c) => c.id),
    browserLocale(),
  );
  if (!save.cities[save.city]) save.cities[save.city] = freshCity();
  return save;
}
export default function App() {
  const [repository] = useState(
    () =>
      new IndexedDbRepository(
        cities.map((c) => c.id),
        browserDatabase(),
        browserStorage(),
        undefined,
        browserLocale(),
      ),
  );
  const [boot, setBoot] = useState<Save | null>(null);
  useEffect(() => {
    let active = true;
    repository
      .load()
      .catch(() => initialSave())
      .then((save) => {
        if (!save.cities[save.city]) save.cities[save.city] = freshCity();
        if (active) setBoot(save);
      });
    return () => {
      active = false;
      repository.close();
    };
  }, [repository]);
  return boot ? (
    <GameRoot initial={boot} repository={repository} />
  ) : (
    <div className="boot-screen" role="status">
      CityMaker<span>Loading your city · 正在读取存档…</span>
    </div>
  );
}
/**
 * Owns the game state above the layout switch so crossing the phone breakpoint
 * (or rotating a tablet) never loses the run or an open dialog.
 */
function GameRoot({
  initial,
  repository,
}: {
  initial: Save;
  repository: GameRepository;
}) {
  const game = useGame(initial, repository);
  const { resolved: theme } = useTheme();
  // The model gallery is a QA sheet that always uses the wide layout.
  const mobile =
    useMediaQuery(MOBILE_QUERY) &&
    !new URLSearchParams(location.search).has("gallery");
  const { city, reduced, weather } = game;
  return (
    <div
      className={`app ${city.id} ${reduced ? "reduced-motion" : ""} ${mobile ? "mobile" : ""}`}
      style={
        {
          "--accent": city.palette.accent,
          // The CSS sky is the scene backdrop; it follows the weather mood so
          // scene fog and particles never sit behind an untouched sky.
          "--scene": sceneSkyTint(city.palette.background, weather, theme),
        } as React.CSSProperties
      }
    >
      {mobile ? (
        <MobileApp game={game} repository={repository} />
      ) : (
        <DesktopGame game={game} repository={repository} />
      )}
    </div>
  );
}
