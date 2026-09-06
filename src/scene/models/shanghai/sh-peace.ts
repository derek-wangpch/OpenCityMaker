import type { Factory } from "../../kit";
import { STONE, TRIM } from "./shared";

export const shPeaceFactory: Factory = (k, g) => {
  const wall = "#c9b9a2",
    glass = "#637b80";
  // Long side wings behind the narrower river-facing tower (A face is +Z).
  k.box(g, 1.02, 0.89, 1.16, wall, 0, 0.445, -0.09);
  k.box(g, 1.06, 0.045, 1.2, STONE, 0, 0.91, -0.09);
  k.box(g, 0.68, 1.12, 0.58, wall, 0, 0.56, 0.29);
  k.box(g, 0.72, 0.045, 0.62, TRIM, 0, 1.13, 0.29);
  k.box(g, 0.49, 0.2, 0.45, wall, 0, 1.25, 0.29);
  k.box(g, 0.53, 0.035, 0.49, STONE, 0, 1.36, 0.29);
  // Window groups establish the facade; no fine per-floor ornament.
  for (const y of [0.34, 0.53, 0.72, 0.91]) {
    for (const x of [-0.23, -0.115, 0, 0.115, 0.23])
      k.box(g, 0.064, 0.115, 0.018, glass, x, y, 0.59);
    for (const side of [-1, 1])
      for (const z of [-0.54, -0.32, -0.1, 0.12, 0.34])
        if (y < 0.9) k.box(g, 0.018, 0.105, 0.085, glass, side * 0.518, y, z);
  }
  for (const x of [-0.3, 0.3]) k.box(g, 0.035, 0.82, 0.025, TRIM, x, 0.68, 0.6);
  for (const x of [-0.21, 0, 0.21]) {
    k.box(g, 0.115, 0.18, 0.025, glass, x, 0.11, 0.592);
    k.cylinder(g, 0.0575, 0.025, glass, x, 0.2, 0.592, 0.0575, 16).rotation.x =
      Math.PI / 2;
  }
  for (const x of [-0.14, 0, 0.14])
    k.box(g, 0.07, 0.1, 0.02, glass, x, 1.25, 0.522);
  k.cylinder(g, 0.35, 0.45, "#5d8f78", 0, 1.6, 0.29, 0, 4).rotation.y =
    Math.PI / 4;
  k.cylinder(g, 0.021, 0.075, STONE, 0, 1.86, 0.29, 0.015, 8);
  k.cylinder(g, 0.009, 0.12, TRIM, 0, 1.95, 0.29, 0.005, 8);
};
