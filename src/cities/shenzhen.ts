import { l } from "./authoring";
import { buildings } from "./shenzhen/buildings";
import type { CityPack } from "./types";

export const shenzhen: CityPack = {
  id: "shenzhen",
  country: l("China", "中国", "中國"),
  name: l("Shenzhen", "深圳"),
  nativeName: "深圳",
  subtitle: l(
    "From walled clan villages to a coastline of blades.",
    "从客家围屋，到海岸线上的刀锋天际。",
    "從客家圍屋，到海岸線上的刀鋒天際。",
  ),
  palette: {
    accent: "#3c5f86",
    ground: "#a9c4c9",
    roof: "#6f6152",
    background: "#e3ecef",
  },
  buildings,
};
