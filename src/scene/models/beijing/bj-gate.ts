import type { Factory } from "../../kit";
import { archWall, hipRoof } from "./heritage";

export const bjGateFactory: Factory = (k, g) => {
  archWall(k, g, 1.35, 0.46, 0.63, 0.3, 0.34, "#a99480");
  k.box(g, 0.29, 0.012, 1.35, "#d7c4a4", 0, 0.006);
  k.box(g, 1.47, 0.065, 0.76, "#d7c4a4", 0, 0.49);
  k.box(g, 0.85, 0.31, 0.5, "#a84e3a", 0, 0.675);
  for (const side of [-1, 1])
    for (const x of [-0.25, 0, 0.25])
      k.box(g, 0.12, 0.2, 0.02, "#654e40", x, 0.67, side * 0.257);
  k.box(g, 0.92, 0.055, 0.56, "#719080", 0, 0.825);
  hipRoof(k, g, 1.25, 0.85, 0.86, 0.27, "#6b7c6c");
};
