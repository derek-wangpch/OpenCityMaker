import { l } from "./authoring";
import { buildings } from "./hongkong/buildings";
import type { CityPack } from "./types";

export const hongkong: CityPack = {
  id: "hongkong",
  country: l("China", "中国", "中國"),
  name: l("Hong Kong", "香港"),
  nativeName: "香港",
  subtitle: l(
    "Small village stories. Big harbor dreams.",
    "小村落的故事，大海港的梦想。",
    "小村落的故事，大海港的夢想。",
  ),
  palette: {
    accent: "#28676a",
    ground: "#98beb0",
    roof: "#b56d54",
    background: "#dcece7",
  },
  buildings,
};
