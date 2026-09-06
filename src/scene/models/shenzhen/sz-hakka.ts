import type { Factory } from "../../kit";
import { EARTH, GREY, wokEar, simpleRoof } from "./shared";

export const szHakkaFactory: Factory = (k, g) => {
  k.box(g, 0.92, 0.5, 0.62, EARTH, 0, 0.25, -0.04);
  simpleRoof(k, g, 0.96, 0.66, 0.51, 0.18, GREY, 0, -0.04);
  wokEar(k, g, 0, -0.04, 0.96, 0.66, 0.54, GREY);
  k.box(g, 0.2, 0.3, 0.02, "#5c4a3c", 0, 0.15, 0.28);
  k.box(g, 0.28, 0.05, 0.05, GREY, 0, 0.32, 0.29);
  for (const side of [-1, 1])
    k.box(g, 0.12, 0.11, 0.02, "#6f8390", side * 0.29, 0.34, 0.28);
  k.box(g, 0.5, 0.03, 0.16, "#cfc4a8", 0, 0.015, 0.42);
};
