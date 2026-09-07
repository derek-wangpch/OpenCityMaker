import {
  BookOpen,
  CloudFog,
  Cloud,
  CloudLightning,
  CloudSnow,
  CloudSun,
  CloudOff,
  Eye,
  EyeOff,
  House,
  RotateCcw,
  Sparkles,
  Trophy,
  Undo2,
} from "lucide-react";
import { BoardCanvas } from "../scene/Canvas";
import { BoardTable, EndOverlay, VictoryNotice } from "../BoardExtras";
import { UNDO_ENABLED, type GameController } from "../game/useGame";
import type { Weather } from "../game/weather";
import type { Route } from "../useHashRoute";
import { BoardRotationControls } from "../BoardRotationControls";
/** Full-screen board: the canvas takes every pixel between the two bars. */
const WEATHER_ICONS: Record<Weather, typeof CloudSun> = {
  off: CloudOff,
  clear: CloudSun,
  rain: CloudLightning,
  snow: CloudSnow,
  fog: CloudFog,
  cloudy: Cloud,
};
export function GamePage({
  game,
  navigate,
}: {
  game: GameController;
  navigate: (route: Route) => void;
}) {
  const {
    city,
    current,
    locale,
    t,
    next,
    challengeValue,
    events,
    reduced,
    showLabels,
    toggleLabels,
    weather,
    cycleWeather,
    setModal,
    play,
    inspect,
    doUndo,
  } = game;
  // Weather is a six-state cycle, so the button announces the state instead
  // of a boolean aria-pressed.
  const WeatherIcon = WEATHER_ICONS[weather],
    weatherName = {
      off: t.weatherOff,
      clear: t.weatherClear,
      rain: t.weatherRain,
      snow: t.weatherSnow,
      fog: t.weatherFog,
      cloudy: t.weatherCloudy,
    }[weather];
  return (
    <section className="mobile-page mobile-game" aria-label={t.board}>
      <div className="mobile-topbar">
        <button
          className="icon-button"
          aria-label={t.home}
          onClick={() => navigate("start")}
        >
          <House size={22} />
        </button>
        <span className="mobile-city-name">{city.name[locale]}</span>
        <div className="score">
          <span>{t.score}</span>
          <strong data-testid="score">
            {current.run.score.toLocaleString(locale)}
          </strong>
        </div>
        <div className="score best">
          <span>
            <Trophy size={12} />
            {t.best}
          </span>
          <strong>{current.best.toLocaleString(locale)}</strong>
        </div>
        <button
          className="icon-button"
          title={`${city.name[locale]} · ${t.atlas}`}
          aria-label={`${city.name[locale]} · ${t.atlas}`}
          onClick={() => navigate("atlas")}
        >
          <BookOpen size={22} />
        </button>
      </div>
      <div className="mobile-board">
        <BoardCanvas
          city={city}
          board={current.run.board}
          events={events}
          reduced={reduced}
          labels={showLabels}
          weather={weather}
          rotationStep={game.boardRotationStep}
          onMove={play}
          onSelect={inspect}
          fallback={t.webgl}
          label={t.board}
        />
        <BoardRotationControls game={game} />
        <BoardTable game={game} />
        <EndOverlay game={game} />
      </div>
      <VictoryNotice game={game} />
      <div className="mobile-bottombar">
        <div className="mobile-next">
          <span className="eyebrow">
            <Sparkles size={11} />
            {challengeValue ? t.nextChallenge : next ? t.next : t.complete}
          </span>
          <span className="mobile-next-name">
            <strong>
              {
                (challengeValue
                  ? city.buildings[10]
                  : (next ?? city.buildings[10])
                ).name[locale]
              }
            </strong>
            <small>{challengeValue ?? next?.value ?? 2048}</small>
          </span>
        </div>
        <div className="board-actions">
          <button
            title={showLabels ? t.hideNumbers : t.showNumbers}
            aria-label={showLabels ? t.hideNumbers : t.showNumbers}
            aria-pressed={showLabels}
            onClick={toggleLabels}
          >
            {showLabels ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          {UNDO_ENABLED && (
            <button
              title={t.undo}
              aria-label={t.undo}
              disabled={!current.run.undo}
              onClick={doUndo}
            >
              <Undo2 size={18} />
            </button>
          )}
          <button
            title={t.restart}
            aria-label={t.restart}
            onClick={() => setModal("restart")}
          >
            <RotateCcw size={17} />
          </button>
          <button
            title={`${t.weather} · ${weatherName}`}
            aria-label={`${t.weather} · ${weatherName}`}
            onClick={cycleWeather}
          >
            <WeatherIcon size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
