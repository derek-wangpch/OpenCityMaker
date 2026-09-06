import { l } from "./authoring";
import { buildings } from "./paris/buildings";
import type { CityPack } from "./types";
export const paris: CityPack = {
  id: "paris",
  name: l("Paris", "巴黎", "巴黎"),
  country: l("France", "法国", "法國"),
  nativeName: "Paris",
  subtitle: l(
    "Limestone corners, blue roofs, and iron above the Seine.",
    "石灰岩街角、蓝屋顶，与塞纳河上的铁塔。",
    "石灰岩街角、藍屋頂，與塞納河上的鐵塔。",
  ),
  palette: {
    accent: "#79758d",
    ground: "#c9c1b6",
    roof: "#6c7889",
    background: "#f0ece7",
  },
  buildings,
};
