import { isTileValue } from "../game/engine";
export type Locale = "en" | "zh-CN" | "zh-HK";
export type Localized = Record<Locale, string>;
export interface Building {
  value: number;
  model: string;
  name: Localized;
  description: Localized;
  sources: string[];
}
export interface CityPack {
  id: string;
  country: Localized;
  name: Localized;
  nativeName: string;
  subtitle: Localized;
  palette: { accent: string; ground: string; roof: string; background: string };
  buildings: Building[];
}
export const localized = (
  en: string,
  simplified: string,
  traditional = simplified,
): Localized => ({ en, "zh-CN": simplified, "zh-HK": traditional });

/** Resolve extended tiles to the city's final landmark, keeping the actual score value. */
export function buildingForValue(
  city: CityPack,
  value: number,
): Building | undefined {
  if (!isTileValue(value)) return undefined;
  const building = city.buildings.find(
    (b) => b.value === Math.min(value, 2048),
  );
  return (
    building && (value === building.value ? building : { ...building, value })
  );
}
