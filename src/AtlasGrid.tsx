import { Check, LockKeyhole } from "lucide-react";
import type { CityPack } from "./cities/types";
import type { GameController } from "./game/useGame";
import type { Thumb } from "./scene/useThumbnails";
export const isLocalTest =
  typeof window !== "undefined" &&
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
/** Landmark cards for one city (atlas) or every city (gallery). */
export function AtlasGrid({
  packs,
  gallery = false,
  game,
  thumb,
}: {
  packs: CityPack[];
  gallery?: boolean;
  game: GameController;
  thumb: Thumb;
}) {
  const { save, city, locale, t, changeCity, setModal } = game;
  return (
    <section className="atlas-grid">
      {packs.flatMap((pack) => [
        gallery ? (
          <h2 className="gallery-city" key={pack.id} id={`gallery-${pack.id}`}>
            {pack.name[locale]}
          </h2>
        ) : null,
        ...pack.buildings.map((b, i) => (
          <button
            className={`atlas-card ${save.cities[pack.id]?.discovered.includes(b.value) ? "found" : ""} ${isLocalTest ? "dev-clear" : ""}`}
            key={pack.id + ":" + b.model}
            onClick={() => {
              if (pack.id !== city.id) changeCity(pack.id);
              setModal(b);
            }}
          >
            <div className="atlas-card-top">
              <span>
                {t.tier} {String(i + 1).padStart(2, "0")}
              </span>
              <span>{b.value}</span>
            </div>
            {thumb(pack.id, b)}
            <div className="atlas-card-bottom">
              <h2>{b.name[locale]}</h2>
              <span>
                {save.cities[pack.id]?.discovered.includes(b.value) ? (
                  <Check size={13} />
                ) : (
                  <LockKeyhole size={12} />
                )}{" "}
                {save.cities[pack.id]?.discovered.includes(b.value)
                  ? t.unlocked
                  : t.locked}
              </span>
            </div>
          </button>
        )),
      ])}
    </section>
  );
}
