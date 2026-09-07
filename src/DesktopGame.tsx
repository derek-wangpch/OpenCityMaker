import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowDownLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CloudFog,
  Cloud,
  CloudLightning,
  CloudSnow,
  CloudSun,
  CloudOff,
  Eye,
  EyeOff,
  Globe2,
  History as HistoryIcon,
  LockKeyhole,
  MapPin,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  Undo2,
} from "lucide-react";
import { cities } from "./cities/packs";
import type { Locale } from "./cities/types";
import type { Weather } from "./game/weather";
import { BoardCanvas } from "./scene/Canvas";
import { useThumbnails } from "./scene/useThumbnails";
import {
  useArrowKeys,
  UNDO_ENABLED,
  type GameController,
} from "./game/useGame";
import type { GameRepository } from "./game/repository";
import { AtlasGrid, isLocalTest } from "./AtlasGrid";
import {
  BoardTable,
  EndOverlay,
  LiveRegion,
  VictoryNotice,
} from "./BoardExtras";
import { GameModal } from "./GameModal";
import { ThemeButton } from "./ThemeButton";
/** Wide-screen layout: one scrolling page with the board, sidebar and atlas. */
const WEATHER_ICONS: Record<Weather, typeof CloudSun> = {
  off: CloudOff,
  clear: CloudSun,
  rain: CloudLightning,
  snow: CloudSnow,
  fog: CloudFog,
  cloudy: Cloud,
};
export function DesktopGame({
  game,
  repository,
}: {
  game: GameController;
  repository: GameRepository;
}) {
  const {
    city,
    current,
    locale,
    t,
    highestIndex,
    challengeValue,
    next,
    modal,
    setModal,
    events,
    stored,
    reduced,
    setReduced,
    showLabels,
    toggleLabels,
    weather,
    cycleWeather,
    changeCity,
    setLocale,
    play,
    inspect,
    doUndo,
  } = game;
  const [page, setPage] = useState<"play" | "atlas" | "gallery">(
    new URLSearchParams(location.search).has("gallery") ? "gallery" : "play",
  );
  const rail = useRef<HTMLDivElement>(null);
  const { thumb } = useThumbnails(city);
  useArrowKeys(page === "play" && !modal, play);
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
  // Coordinates are relative to the rail, even when the intro wraps onto another row.
  useEffect(() => {
    const track = rail.current;
    const selected = track?.querySelector<HTMLElement>("button.selected");
    if (track && selected) centerCityButton(track, selected, reduced);
  }, [city, reduced]);
  // On the gallery page every city is on screen at once, so switching cities
  // must also scroll the grid to that city's heading.
  function goToCity(id: string) {
    changeCity(id);
    if (page === "gallery")
      document
        .getElementById(`gallery-${id}`)
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }
  function moveRailFocus(e: React.KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const buttons = [
      ...e.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
    ];
    const from = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (from < 0) return;
    e.preventDefault();
    const to =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? buttons.length - 1
          : (from + (e.key === "ArrowRight" ? 1 : buttons.length - 1)) %
            buttons.length;
    buttons[to].focus({ preventScroll: true });
    centerCityButton(e.currentTarget, buttons[to], reduced);
  }
  return (
    <>
      <header className="header">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setPage("play");
          }}
          aria-label="CityMaker"
        >
          <img
            className="brand-symbol"
            src="/favicon.svg"
            width="39"
            height="39"
            alt=""
          />
          CityMaker
        </a>
        <nav aria-label={t.play}>
          <button
            className={page === "play" ? "active" : ""}
            onClick={() => setPage("play")}
          >
            {t.play}
          </button>
          <button
            className={page !== "play" ? "active" : ""}
            onClick={() => setPage("atlas")}
          >
            {t.atlas}
          </button>
        </nav>
        <div className="header-actions">
          <label className="language">
            <Globe2 size={16} />
            <select
              aria-label={t.language}
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
            >
              <option value="en">English</option>
              <option value="zh-CN">简体中文</option>
              <option value="zh-HK">繁體中文</option>
            </select>
            <ChevronDown size={13} />
          </label>
          <ThemeButton t={t} />
          <button
            className="icon-button help-button"
            onClick={() => setModal("help")}
            aria-label={t.how}
          >
            <CircleHelp size={20} />
          </button>
        </div>
      </header>
      <main>
        <section className="intro">
          <div>
            <div className="eyebrow">
              <span className="tiny-star">✳</span> {t.tagline}
            </div>
            <h1>
              {page === "play" ? (
                <>
                  {city.name[locale]}
                  <span className="native-name">
                    {locale === "en" ? city.nativeName : "CITY MAKER"}
                  </span>
                </>
              ) : page === "gallery" ? (
                t.gallery
              ) : (
                t.atlas
              )}
            </h1>
            <p>
              {page === "play"
                ? city.subtitle[locale]
                : page === "gallery"
                  ? t.gallerySub
                  : t.atlasSub}
            </p>
          </div>
          <div className="city-carousel">
            <button
              className="city-carousel-arrow"
              aria-label="Previous city"
              onClick={() =>
                goToCity(
                  cities[
                    (cities.indexOf(city) + cities.length - 1) % cities.length
                  ].id,
                )
              }
            >
              <ChevronLeft size={16} />
            </button>
            <div
              className="city-switch"
              role="group"
              aria-label={t.choose}
              ref={rail}
              onKeyDown={moveRailFocus}
            >
              {cities.map((c, i) => (
                <button
                  key={c.id}
                  className={city.id === c.id ? "selected" : ""}
                  aria-current={city.id === c.id ? "true" : undefined}
                  onClick={() => goToCity(c.id)}
                >
                  <span className="city-switch-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {c.name[locale]}
                  {c.id === city.id ? (
                    <span className="selected-dot" />
                  ) : (
                    <ArrowUpRight size={14} />
                  )}
                </button>
              ))}
            </div>
            <button
              className="city-carousel-arrow"
              aria-label="Next city"
              onClick={() =>
                goToCity(cities[(cities.indexOf(city) + 1) % cities.length].id)
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
        {page === "play" ? (
          <div className="game-layout">
            <section className="game-panel" aria-label={t.board}>
              <div className="panel-top">
                <div className="board-location">
                  <MapPin size={14} />
                  {city.country[locale]}
                  <span>/</span>
                  {city.name[locale]}
                </div>
                <div className="board-edition">
                  {t.chapter}{" "}
                  {String(cities.indexOf(city) + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="scorebar">
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
              <BoardCanvas
                city={city}
                board={current.run.board}
                events={events}
                reduced={reduced}
                labels={showLabels}
                weather={weather}
                onMove={play}
                onSelect={inspect}
                fallback={t.webgl}
                label={t.board}
              />
              <BoardTable game={game} />
              <EndOverlay game={game} />
              <VictoryNotice game={game} />
              <div className="board-bottom">
                <div className="board-instruction">
                  <span>{current.run.score === 0 ? t.start : t.startSub}</span>
                  <small>{t.controls}</small>
                </div>
                <div className="direction-pad">
                  {(
                    [
                      ["left", ArrowUpLeft],
                      ["up", ArrowUpRight],
                      ["down", ArrowDownLeft],
                      ["right", ArrowDownRight],
                    ] as const
                  ).map(([direction, Icon]) => (
                    <button
                      key={direction}
                      aria-label={t[direction]}
                      title={t[direction]}
                      disabled={current.run.status !== "playing"}
                      onClick={() => play(direction)}
                    >
                      <Icon size={19} />
                    </button>
                  ))}
                </div>
              </div>
            </section>
            <aside className="sidebar">
              <section className="discovery-card">
                <div className="eyebrow">
                  <Sparkles size={14} />
                  {challengeValue
                    ? t.nextChallenge
                    : next
                      ? t.next
                      : t.complete}
                </div>
                <button
                  className="discovery-image"
                  aria-label={`${t.preview}: ${(challengeValue ? city.buildings[10] : (next ?? city.buildings[10])).name[locale]}`}
                  onClick={() =>
                    challengeValue
                      ? inspect(challengeValue)
                      : setModal(next ?? city.buildings[10])
                  }
                >
                  {thumb(
                    city.id,
                    challengeValue
                      ? city.buildings[10]
                      : (next ?? city.buildings[10]),
                  )}
                  <span className="value-tag">
                    {challengeValue ?? next?.value ?? 2048}
                  </span>
                </button>
                <span className="landmark-step">
                  {t.tier}{" "}
                  {String(
                    challengeValue
                      ? Math.log2(challengeValue)
                      : next
                        ? city.buildings.indexOf(next) + 1
                        : 11,
                  ).padStart(2, "0")}
                </span>
                <h2>
                  {
                    (challengeValue
                      ? city.buildings[10]
                      : (next ?? city.buildings[10])
                    ).name[locale]
                  }
                </h2>
                <p>{challengeValue ? t.challengeHint : t.mergeHint}</p>
                <div
                  className={`merge-equation${challengeValue ? " extended" : ""}`}
                >
                  {challengeValue ? (
                    <span>{challengeValue / 2}</span>
                  ) : (
                    thumb(
                      city.id,
                      city.buildings[
                        Math.max(
                          0,
                          (next ? city.buildings.indexOf(next) : 10) - 1,
                        )
                      ],
                    )
                  )}
                  <Plus size={14} />
                  {challengeValue ? (
                    <span>{challengeValue / 2}</span>
                  ) : (
                    thumb(
                      city.id,
                      city.buildings[
                        Math.max(
                          0,
                          (next ? city.buildings.indexOf(next) : 10) - 1,
                        )
                      ],
                    )
                  )}
                  <ArrowRight size={16} />
                  <span>{challengeValue ?? next?.value ?? 2048}</span>
                </div>
              </section>
              <section className="collection-card">
                <div className="collection-heading">
                  <h2>{t.collection}</h2>
                  <span>
                    {current.discovered.length}
                    <span> / 11</span>
                  </span>
                </div>
                <div className="collection-mini">
                  {city.buildings.slice(0, 4).map((b) => (
                    <button
                      key={b.value}
                      onClick={() => setModal(b)}
                      aria-label={`${b.name[locale]} · ${current.discovered.includes(b.value) ? t.unlocked : t.locked}`}
                      className={`${!current.discovered.includes(b.value) ? "locked" : ""} ${isLocalTest ? "dev-clear" : ""}`}
                    >
                      {thumb(city.id, b)}
                      {!current.discovered.includes(b.value) && (
                        <LockKeyhole size={12} />
                      )}
                    </button>
                  ))}
                </div>
                <div className="progress-track">
                  <span
                    style={{
                      width: `${(current.discovered.length / 11) * 100}%`,
                    }}
                  />
                </div>
                <button
                  className="collection-link"
                  onClick={() => setPage("atlas")}
                >
                  {t.viewAll}
                  <ArrowUpRight size={16} />
                </button>
              </section>
            </aside>
            <section className="journey">
              <div className="journey-heading">
                <span className="eyebrow">{t.journey}</span>
                <span>
                  {String(highestIndex + 1).padStart(2, "0")} <span>/ 11</span>
                </span>
              </div>
              <div className="journey-steps">
                {city.buildings.map((b, i) => (
                  <button
                    className={
                      current.discovered.includes(b.value) ? "achieved" : ""
                    }
                    key={b.value}
                    onClick={() => setModal(b)}
                    aria-label={`${b.name[locale]} ${b.value}`}
                  >
                    <span>
                      {i === 10 ? (
                        <Sparkles size={14} />
                      ) : current.discovered.includes(b.value) ? (
                        <Check size={12} />
                      ) : (
                        <span />
                      )}
                    </span>
                    <small>{b.value}</small>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <AtlasGrid
            packs={page === "gallery" ? cities : [city]}
            gallery={page === "gallery"}
            game={game}
            thumb={thumb}
          />
        )}
        <footer>
          <button
            className="history-trigger"
            onClick={() => setModal("history")}
          >
            <HistoryIcon size={13} />
            {t.history}
          </button>
          <span>
            <span className={`save-dot ${stored ? "" : "warning"}`} />
            {stored === null ? t.saving : stored ? t.saved : t.unsaved}
          </span>
          <span>{t.interpretation}</span>
          <button onClick={() => setModal("help")}>{t.how}</button>
          <button onClick={() => setReduced((v) => !v)} aria-pressed={reduced}>
            {reduced ? t.reduce : t.normal}
          </button>
        </footer>
      </main>
      <LiveRegion game={game} />
      <GameModal game={game} repository={repository} />
    </>
  );
}

/** Keep keyboard focus and restored selections visible without scrolling the document. */
function centerCityButton(
  track: HTMLElement,
  button: HTMLElement,
  reduced: boolean,
) {
  track.scrollTo({
    left:
      track.scrollLeft +
      button.getBoundingClientRect().left -
      track.getBoundingClientRect().left -
      track.clientLeft -
      (track.clientWidth - button.offsetWidth) / 2,
    behavior: reduced ? "auto" : "smooth",
  });
}
