import type { Factory } from "../../kit";
import { TRIM } from "./shared";

export const szDiwangFactory: Factory = (k, g) => {
  const glass = "#68a69a",
    seam = "#b6cdc0";
  k.box(g, 1.05, 0.1, 0.74, "#c4bda9", 0, 0.05);
  k.box(g, 0.52, 1.91, 0.34, glass, 0, 1.055);
  // Rounded glazed end towers, not exposed lattice supports.
  for (const side of [-1, 1]) {
    const x = side * 0.27;
    k.cylinder(g, 0.125, 2.02, glass, x, 1.11, 0, 0.125, 20);
    for (let row = 0; row < 19; row++)
      k.cylinder(g, 0.127, 0.012, seam, x, 0.19 + row * 0.101, 0, 0.127, 20);
    k.cylinder(g, 0.13, 0.045, TRIM, x, 2.105, 0, 0.13, 20);
    k.cylinder(g, 0.069, 0.105, glass, x, 2.18, 0, 0.069, 16);
    k.cylinder(g, 0.009, 0.36, TRIM, x, 2.41, 0, 0.005, 8);
  }
  for (const side of [-1, 1]) {
    for (let row = 0; row < 18; row++)
      k.box(g, 0.48, 0.012, 0.012, seam, 0, 0.2 + row * 0.102, side * 0.176);
    for (const x of [-0.17, 0, 0.17])
      k.box(g, 0.016, 1.88, 0.016, TRIM, x, 1.055, side * 0.176);
    k.box(g, 0.48, 0.055, 0.015, "#4e817c", 0, 1.95, side * 0.176);
  }
  // Small rear podium wing; adjacent separate towers are outside this model.
  k.box(g, 0.76, 0.18, 0.22, "#d4cdbb", 0, 0.18, -0.25);
  k.box(g, 0.38, 0.07, 0.08, "#668f88", 0, 0.135, 0.27);
};
