import type { Factory } from "../../kit";
import { STONE, TRIM, shikumenUnit } from "./shared";

export const shLongtangFactory: Factory = (k, g) => {
  k.box(g, 0.26, 0.016, 1.4, "#cec6b2", 0, 0.008);
  for (const [i, x] of [-0.38, 0.38].entries())
    for (const [j, z] of [-0.42, 0.34].entries())
      shikumenUnit(
        k,
        g,
        x,
        z,
        0.5,
        ["#9c6350", "#8f6a5a", "#a8705a", "#94655a"][i * 2 + j],
        x < 0 ? Math.PI / 2 : -Math.PI / 2,
      );
  // Lane gateway: piers spanning the full lane, carrying the name tablet.
  for (const side of [-1, 1])
    k.box(g, 0.1, 0.36, 0.12, STONE, side * 0.23, 0.18, -0.66);
  k.box(g, 0.56, 0.1, 0.14, STONE, 0, 0.41, -0.66);
  k.box(g, 0.35, 0.075, 0.15, "#c9b48f", 0, 0.495, -0.66);
  k.box(g, 0.56, 0.035, 0.16, TRIM, 0, 0.55, -0.66);
};
