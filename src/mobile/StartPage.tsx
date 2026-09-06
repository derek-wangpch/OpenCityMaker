import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Globe2,
  History as HistoryIcon,
  House,
  MapPin,
  Plus,
  Share,
  Trophy,
} from "lucide-react";
import { cities } from "../cities/packs";
import { useState, type CSSProperties } from "react";
import type { CityPack, Locale } from "../cities/types";
import type { GameController } from "../game/useGame";
import { usePreviews } from "../scene/useThumbnails";
import type { Route } from "../useHashRoute";
import { browserHomeScreen } from "../homeScreen";
import { AddToHome } from "./AddToHome";
/** Cover skyline: the three top landmarks, tallest in the middle. */
const skyline = (city: CityPack) => {
  const b = city.buildings;
  return [b[b.length - 3], b[b.length - 1], b[b.length - 2]];
};
export function StartPage({
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
    stored,
    reduced,
    setReduced,
    setModal,
    setLocale,
  } = game;
  const preview = usePreviews(city, skyline, "portrait", 3);
  // Read once: the answer belongs to how this document was opened.
  const [homeScreen] = useState(browserHomeScreen);
  const [howToInstall, setHowToInstall] = useState(false);
  const inProgress =
    current.session.moves > 0 && current.run.status === "playing";
  return (
    <section className="mobile-page mobile-start">
      <div className="mobile-start-top">
        <span className="brand">
          <span className="brand-symbol">
            <House size={23} />
            <Plus size={11} />
          </span>
          CityMaker
        </span>
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
      </div>
      <div className="mobile-city-hero">
        <div className="mobile-cover" aria-hidden="true">
          <span className="mobile-cover-watermark">{city.nativeName}</span>
          {skyline(city).map((building, i) => {
            const src = preview(city, building);
            return (
              src && (
                <span
                  key={building.model}
                  className={`mobile-cover-building position-${i}`}
                  style={{ "--silhouette": `url("${src}")` } as CSSProperties}
                />
              )
            );
          })}
        </div>
        <div className="eyebrow">
          <MapPin size={12} />
          {t.chapter} {String(cities.indexOf(city) + 1).padStart(2, "0")}
        </div>
        <h1>
          {city.name[locale]}
          <span className="native-name">
            {locale === "en" ? city.nativeName : "CITY MAKER"}
          </span>
        </h1>
        <p>{city.subtitle[locale]}</p>
        <dl className="mobile-stats">
          <div>
            <dt>{t.best}</dt>
            <dd>
              <Trophy size={12} />
              {current.best.toLocaleString(locale)}
            </dd>
          </div>
          <div>
            <dt>{t.collectionCount}</dt>
            <dd>
              {current.discovered.length}
              <span> / 11</span>
            </dd>
          </div>
        </dl>
      </div>
      <div className="mobile-ctas">
        <button className="primary mobile-cta" onClick={() => navigate("play")}>
          {inProgress ? t.continue : t.play}
          <ArrowRight size={18} />
        </button>
        <button
          className="secondary mobile-cta"
          onClick={() => navigate("cities")}
        >
          {t.chooseCity}
        </button>
      </div>
      <div className="mobile-secondary-row">
        <button onClick={() => navigate("atlas")}>
          <BookOpen size={16} />
          {t.atlas}
        </button>
        <button onClick={() => setModal("history")}>
          <HistoryIcon size={16} />
          {t.history}
        </button>
        <button onClick={() => setModal("help")}>
          <CircleHelp size={16} />
          {t.how}
        </button>
      </div>
      {homeScreen === "available" && (
        <button
          className="mobile-install"
          onClick={() => setHowToInstall(true)}
        >
          <Share size={14} />
          {t.addToHome}
        </button>
      )}
      {howToInstall && <AddToHome t={t} close={() => setHowToInstall(false)} />}
      <footer className="mobile-footer">
        <span>
          <span className={`save-dot ${stored ? "" : "warning"}`} />
          {stored === null ? t.saving : stored ? t.saved : t.unsaved}
        </span>
        <button onClick={() => setReduced((v) => !v)} aria-pressed={reduced}>
          {reduced ? t.reduce : t.normal}
        </button>
      </footer>
    </section>
  );
}
