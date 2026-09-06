import { useEffect } from "react";
import { useArrowKeys, type GameController } from "../game/useGame";
import type { GameRepository } from "../game/repository";
import { useHashRoute } from "../useHashRoute";
import { GameModal } from "../GameModal";
import { LiveRegion } from "../BoardExtras";
import { StartPage } from "./StartPage";
import { CitiesPage } from "./CitiesPage";
import { GamePage } from "./GamePage";
import { AtlasPage } from "./AtlasPage";
/** Phone layout: Start → city list → full-screen board, each in the URL hash. */
export function MobileApp({
  game,
  repository,
}: {
  game: GameController;
  repository: GameRepository;
}) {
  const { route, from, navigate, back } = useHashRoute();
  useArrowKeys(route === "play" && !game.modal, game.play);
  // Lock document scrolling only while the phone shell is mounted.
  useEffect(() => {
    document.documentElement.classList.add("mobile-app");
    return () => document.documentElement.classList.remove("mobile-app");
  }, []);
  return (
    <div className="mobile-shell">
      {route === "play" ? (
        <GamePage game={game} navigate={navigate} />
      ) : route === "cities" ? (
        <CitiesPage game={game} navigate={navigate} />
      ) : route === "atlas" ? (
        <AtlasPage game={game} from={from} back={back} />
      ) : (
        <StartPage game={game} navigate={navigate} />
      )}
      <LiveRegion game={game} />
      <GameModal game={game} repository={repository} />
    </div>
  );
}
