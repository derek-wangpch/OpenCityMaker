import { l } from "./authoring";
import { buildings } from "./london/buildings";
import type { CityPack } from "./types";
export const london: CityPack = {
  id: "london",
  name: l("London", "伦敦", "倫敦"),
  country: l("United Kingdom", "英国", "英國"),
  nativeName: "London",
  subtitle: l(
    "Brick terraces, river crossings, and a clock above the city.",
    "砖排屋、跨河桥，与城上的大钟。",
    "磚排屋、跨河橋，與城上的大鐘。",
  ),
  palette: {
    accent: "#8e5e56",
    ground: "#bdc6b6",
    roof: "#61767c",
    background: "#ecefe6",
  },
  buildings,
};
