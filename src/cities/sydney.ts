import { l } from "./authoring";
import { buildings } from "./sydney/buildings";
import type { CityPack } from "./types";
export const sydney: CityPack = {
  id: "sydney",
  name: l("Sydney", "悉尼", "悉尼"),
  country: l("Australia", "澳大利亚", "澳大利亞"),
  nativeName: "Sydney",
  subtitle: l(
    "Sandstone lanes, steel arches, and white sails on the harbor.",
    "砂岩街巷、钢拱，与港湾上的白帆。",
    "砂岩街巷、鋼拱，與港灣上的白帆。",
  ),
  palette: {
    accent: "#527988",
    ground: "#b8c9c7",
    roof: "#708183",
    background: "#e7eff0",
  },
  buildings,
};
