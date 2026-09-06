import { l } from "./authoring";
import { buildings } from "./beijing/buildings";
import type { CityPack } from "./types";

export const beijing: CityPack = {
  id: "beijing",
  country: l("China", "中国", "中國"),
  name: l("Beijing", "北京"),
  nativeName: "北京",
  subtitle: l(
    "From quiet courtyards to a soaring skyline.",
    "从静谧庭院，到云端天际。",
    "從靜謐庭院，到雲端天際。",
  ),
  palette: {
    accent: "#345d49",
    ground: "#a6ba87",
    roof: "#586e70",
    background: "#e6ecdf",
  },
  buildings,
};
