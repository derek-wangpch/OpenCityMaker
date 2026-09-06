import type { Factory } from "../../kit";
import { gable } from "../../architecture";
export const syWharfFactory: Factory = (k, g) => {
  const timber = "#b4ada0",
    roof = "#7c8c8c",
    dark = "#536969";
  k.box(g, 1.48, 0.03, 1.5, "#8caaac", 0, 0.015);
  for (const x of [-0.35, 0.35]) {
    for (const dx of [-0.22, 0.22])
      for (const z of [-0.56, 0, 0.56])
        k.cylinder(g, 0.03, 0.16, "#6d695a", x + dx, 0.1, z, 0.03, 8);
    k.box(g, 0.57, 0.07, 1.38, "#9a8e76", x, 0.185);
    k.box(g, 0.46, 0.38, 1.17, timber, x, 0.41);
    gable(k, g, 0.52, 1.23, 0.15, roof, x, 0.6);
    k.box(g, 0.13, 0.065, 0.91, dark, x, 0.75);
    gable(k, g, 0.21, 0.97, 0.05, roof, x, 0.78);
    for (const z of [-0.59, 0.59]) {
      k.box(g, 0.18, 0.25, 0.018, dark, x, 0.345, z);
      k.box(g, 0.24, 0.025, 0.04, "#dfd5ba", x, 0.49, z);
    }
    for (const side of [-1, 1])
      for (const z of [-0.42, -0.14, 0.14, 0.42]) {
        k.box(g, 0.018, 0.1, 0.16, dark, x + side * 0.238, 0.5, z);
        k.box(g, 0.024, 0.36, 0.025, "#dfd5ba", x + side * 0.24, 0.41, z + 0.1);
      }
  }
};
