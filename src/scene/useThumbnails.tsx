import { useEffect, useState } from "react";
import { Landmark } from "lucide-react";
import { cities } from "../cities/packs";
import type { Building, CityPack } from "../cities/types";
import {
  getThumbnails,
  scheduleThumbnails,
  thumbnailKey,
  type PreviewStyle,
} from "./render";
/**
 * Preview images for building cards. The active city renders synchronously;
 * `all` schedules every other city during idle time for the atlas / gallery.
 */
export function useThumbnails(city: CityPack, all = true) {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      setThumbnails(getThumbnails([city]));
    } catch {
      /* Board displays a localized WebGL fallback. */
    }
  }, [city]);
  useEffect(
    () => (all ? scheduleThumbnails(cities, setThumbnails) : undefined),
    [all],
  );
  const thumb = (cityId: string, building: Building, className = "") =>
    thumbnails[thumbnailKey(cityId, building.model)] ? (
      <img
        className={className}
        src={thumbnails[thumbnailKey(cityId, building.model)]}
        alt=""
        draggable={false}
        decoding="async"
        width={280}
        height={260}
      />
    ) : (
      <Landmark className={className} aria-hidden="true" />
    );
  return { thumbnails, thumb };
}
export type Thumb = ReturnType<typeof useThumbnails>["thumb"];
/** A city's crowning landmark: the last building in its pack. */
export const landmark = (city: CityPack) =>
  city.buildings[city.buildings.length - 1];
/**
 * Previews for a chosen subset of buildings. The active city renders
 * synchronously; the rest of the catalog follows during idle time, `perSlice`
 * cities per WebGL context.
 */
export function usePreviews(
  city: CityPack,
  select: (city: CityPack) => Building[],
  style: PreviewStyle = "model",
  perSlice = 1,
) {
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  useEffect(() => {
    try {
      setThumbnails(getThumbnails([city], { select, style }));
    } catch {
      /* Pages simply render without art when WebGL is unavailable. */
    }
    return scheduleThumbnails(cities, setThumbnails, {
      select,
      style,
      perSlice,
    });
  }, [city, select, style, perSlice]);
  return (c: CityPack, building: Building): string | undefined =>
    thumbnails[thumbnailKey(c.id, building.model, style)];
}
