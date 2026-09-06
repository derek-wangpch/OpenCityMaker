import type { Factory } from "../../kit";
import { TRIM } from "./shared";

export const szItcFactory: Factory = (k, g) => {
  k.box(g, 1.08, 0.12, 0.76, "#bbb6a7", 0, 0.06);
  k.box(g, 0.98, 0.095, 0.68, "#72949b", 0, 0.15);
  k.box(g, 0.66, 1.53, 0.5, "#d7d5c5", 0, 0.955);
  // Group the vertical glazed bays on all four faces, with a solid roof collar.
  for (const side of [-1, 1]) {
    for (let c = -2; c <= 2; c++)
      k.box(g, 0.074, 1.31, 0.014, "#739ba9", c * 0.109, 0.91, side * 0.256);
    for (let c = -1; c <= 1; c++)
      k.box(g, 0.014, 1.31, 0.087, "#739ba9", side * 0.336, 0.91, c * 0.14);
    for (const y of [0.53, 0.86, 1.19]) {
      k.box(g, 0.57, 0.014, 0.014, "#b6c6c5", 0, y, side * 0.266);
      k.box(g, 0.014, 0.014, 0.4, "#b6c6c5", side * 0.344, y);
    }
  }
  // Revolving restaurant: a dark glazed drum between two pale disks.
  k.cylinder(g, 0.27, 0.08, TRIM, 0, 1.75, 0, 0.27, 24);
  k.cylinder(g, 0.32, 0.125, "#547582", 0, 1.84, 0, 0.32, 24);
  k.cylinder(g, 0.34, 0.025, TRIM, 0, 1.785, 0, 0.34, 24);
  k.cylinder(g, 0.335, 0.03, TRIM, 0, 1.915, 0, 0.335, 24);
};
