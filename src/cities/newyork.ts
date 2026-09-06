import { l } from "./authoring";
import { buildings } from "./newyork/buildings";
import type { CityPack } from "./types";
export const newyork: CityPack = {
  id: "newyork",
  name: l("New York", "纽约", "紐約"),
  country: l("United States", "美国", "美國"),
  nativeName: "New York",
  subtitle: l(
    "Brownstone stoops, copper crowns, and towers above the harbor.",
    "褐石台阶、铜色冠顶，与港湾上的高塔。",
    "褐石臺階、銅色冠頂，與港灣上的高塔。",
  ),
  palette: {
    accent: "#6b7188",
    ground: "#bec0c9",
    roof: "#7c7776",
    background: "#ececf2",
  },
  buildings,
};
