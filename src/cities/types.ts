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
