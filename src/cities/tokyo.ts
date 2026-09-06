import { l } from "./authoring";
import { buildings } from "./tokyo/buildings";
import type { CityPack } from "./types";
export const tokyo: CityPack = {
  id: "tokyo",
  name: l("Tokyo", "东京", "東京"),
  country: l("Japan", "日本", "日本"),
  nativeName: "東京",
  subtitle: l(
    "Timber lanes, vermilion gates, and a woven skyline.",
    "木巷、朱门，与交织的天际线。",
    "木巷、朱門，與交織的天際線。",
  ),
  palette: {
    accent: "#8a514e",
    ground: "#c7b9b0",
    roof: "#5c6169",
    background: "#f0e8e3",
  },
  buildings,
};
