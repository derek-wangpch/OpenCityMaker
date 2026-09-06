import { l } from "./authoring";
import { buildings } from "./shanghai/buildings";
import type { CityPack } from "./types";

export const shanghai: CityPack = {
  id: "shanghai",
  country: l("China", "中国", "中國"),
  name: l("Shanghai", "上海"),
  nativeName: "上海",
  subtitle: l(
    "Stone gates, river banks, and a twisting skyline.",
    "石库门、江畔外滩，与旋转的天际线。",
    "石庫門、江畔外灘，與旋轉的天際線。",
  ),
  palette: {
    accent: "#8a5b3d",
    ground: "#c3b9a4",
    roof: "#4a4a52",
    background: "#efe9dd",
  },
  buildings,
};
