import { l } from "./authoring";
import { buildings } from "./singapore/buildings";
import type { CityPack } from "./types";
export const singapore: CityPack = {
  id: "singapore",
  name: l("Singapore", "新加坡", "新加坡"),
  country: l("Singapore", "新加坡", "新加坡"),
  nativeName: "Singapore",
  subtitle: l(
    "Pastel arcades, garden crowns, and a boat above the bay.",
    "粉彩骑楼、树冠花园，与湾上的天空之舟。",
    "粉彩騎樓、樹冠花園，與灣上的天空之舟。",
  ),
  palette: {
    accent: "#467e70",
    ground: "#b1c6a3",
    roof: "#896f5d",
    background: "#edf2e4",
  },
  buildings,
};
