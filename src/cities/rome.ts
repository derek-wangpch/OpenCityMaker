import { l } from "./authoring";
import { buildings } from "./rome/buildings";
import type { CityPack } from "./types";
export const rome: CityPack = {
  id: "rome",
  name: l("Rome", "罗马", "羅馬"),
  country: l("Italy", "意大利", "意大利"),
  nativeName: "Roma",
  subtitle: l(
    "Terracotta lanes, open arches, and domes above ancient stone.",
    "陶瓦巷、贯通拱，与古石上的穹顶。",
    "陶瓦巷、貫通拱，與古石上的穹頂。",
  ),
  palette: {
    accent: "#9b6c4b",
    ground: "#d0b69e",
    roof: "#a77354",
    background: "#f3e8dc",
  },
  buildings,
};
