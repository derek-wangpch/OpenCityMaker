import type { Factory } from "../../kit";
import { openings, gable } from "../../architecture";
export const ldBuckinghamFactory: Factory = (k, g) => {
  const stone = "#d2c9b0",
    trim = "#e3d5b6";
  // Front range plus rear wings enclose a simplified quadrangle.
  k.box(g, 1.4, 0.61, 0.32, stone, 0, 0.305, 0.37);
  for (const x of [-0.56, 0.56]) {
    k.box(g, 0.28, 0.55, 0.88, stone, x, 0.275, -0.15);
    k.box(g, 0.31, 0.035, 0.9, trim, x, 0.57, -0.15);
    for (const z of [-0.44, -0.14, 0.16])
      for (const y of [0.2, 0.4])
        k.box(g, 0.015, 0.1, 0.06, "#657777", Math.sign(x) * 0.705, y, z);
  }
  k.box(g, 1.15, 0.52, 0.2, stone, 0, 0.26, -0.58);
  k.box(g, 1.43, 0.045, 0.35, trim, 0, 0.63, 0.37);
  openings(k, g, 1.4, 0.59, 0.32, 3, 9, "#657777", 0, 0, 0.37);
  for (const x of [-0.24, -0.08, 0.08, 0.24])
    k.box(g, 0.035, 0.32, 0.035, trim, x, 0.39, 0.558);
  k.box(g, 0.56, 0.04, 0.16, trim, 0, 0.31, 0.58);
  k.box(g, 0.56, 0.075, 0.023, trim, 0, 0.367, 0.655);
  k.box(g, 0.6, 0.045, 0.11, trim, 0, 0.58, 0.55);
  gable(k, g, 0.6, 0.12, 0.085, trim, 0, 0.65, 0.49);
  k.cylinder(g, 0.009, 0.22, "#8c8c7a", 0, 0.83, 0.28);
  k.box(g, 0.12, 0.065, 0.008, "#887779", 0.06, 0.9, 0.28);
};
