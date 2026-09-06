import { l } from "./authoring";
import { buildings } from "./dubai/buildings";
import type { CityPack } from "./types";
export const dubai: CityPack = {
  id: "dubai",
  name: l("Dubai", "迪拜", "迪拜"),
  country: l("United Arab Emirates", "阿联酋", "阿聯酋"),
  nativeName: "دبي",
  subtitle: l(
    "Wind towers, golden frames, and a needle above the desert.",
    "风塔、金色画框，与沙漠上的尖针。",
    "風塔、金色畫框，與沙漠上的尖針。",
  ),
  palette: {
    accent: "#a37d44",
    ground: "#d4bf92",
    roof: "#9f8868",
    background: "#f4edda",
  },
  buildings,
};
