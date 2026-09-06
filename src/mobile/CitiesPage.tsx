import { ChevronLeft, Trophy } from "lucide-react";
import { cities } from "../cities/packs";
import type { CityPack } from "../cities/types";
import type { GameController } from "../game/useGame";
import { landmark, usePreviews } from "../scene/useThumbnails";
import type { Route } from "../useHashRoute";
const landmarkOnly = (city: CityPack) => [landmark(city)];
export function CitiesPage({
  game,
  navigate,
}: {
  game: GameController;
  navigate: (route: Route) => void;
}) {
  const { save, city, locale, t, changeCity } = game;
  const preview = usePreviews(city, landmarkOnly, "model", 4);
  return (
    <section className="mobile-page mobile-cities">
      <div className="mobile-topbar">
        <button
          className="icon-button"
          aria-label={t.home}
          onClick={() => navigate("start")}
        >
          <ChevronLeft size={22} />
        </button>
        <h1>{t.choose}</h1>
      </div>
      <ul className="city-list">
        {cities.map((c, i) => {
          const entry = save.cities[c.id];
          const src = preview(c, landmark(c));
          return (
            <li key={c.id}>
              <button
                className={`city-card ${c.id === city.id ? "selected" : ""}`}
                style={{ "--accent": c.palette.accent } as React.CSSProperties}
                aria-current={c.id === city.id ? "true" : undefined}
                onClick={() => {
                  changeCity(c.id);
                  navigate("start");
                }}
              >
                <span className="city-card-strip" aria-hidden="true" />
                {src && (
                  <img
                    className="city-card-art"
                    src={src}
                    alt=""
                    draggable={false}
                    decoding="async"
                    width={280}
                    height={260}
                  />
                )}
                <span className="city-card-body">
                  <span className="city-switch-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="city-card-title">
                    <span className="city-card-name">{c.name[locale]}</span>
                    <span className="native-name">{c.nativeName}</span>
                  </span>
                  <span className="city-card-subtitle">
                    {c.subtitle[locale]}
                  </span>
                  <span className="city-card-meta">
                    <span>
                      <Trophy size={11} />
                      {(entry?.best ?? 0).toLocaleString(locale)}
                    </span>
                    <span>
                      {entry?.discovered.length ?? 0}
                      <span> / 11</span>
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
