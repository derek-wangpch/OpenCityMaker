import type { Factory } from "../../kit";
import { openings } from "../../architecture";

// Tier 10: grouped limestone piers on BOTH elevations, broad shoulders,
// observation terrace and a distinct mooring mast below the broadcast needle.
export const nyEmpireFactory: Factory = (k, g) => {
  const stone = "#c7c4b0",
    trim = "#ded8bd",
    glass = "#627b83";
  const block = (w: number, h: number, d: number, y: number, cols: number) => {
    k.box(g, w, h, d, stone, 0, y + h / 2);
    for (const side of [-1, 1]) {
      for (let i = 0; i < cols; i++)
        k.box(
          g,
          (w / cols) * 0.42,
          h * 0.88,
          0.014,
          glass,
          ((i - (cols - 1) / 2) * w) / cols,
          y + h / 2,
          side * (d / 2 + 0.005),
        );
      for (let i = 0; i < 3; i++)
        k.box(
          g,
          0.014,
          h * 0.88,
          (d / 3) * 0.42,
          glass,
          side * (w / 2 + 0.005),
          y + h / 2,
          ((i - 1) * d) / 3,
        );
    }
    k.box(g, w + 0.025, 0.025, d + 0.025, trim, 0, y + h);
  };
  k.box(g, 0.94, 0.2, 0.76, stone);
  openings(k, g, 0.94, 0.2, 0.76, 1, 5, glass);
  block(0.83, 0.22, 0.67, 0.2, 5);
  block(0.69, 0.2, 0.56, 0.42, 5);
  block(0.5, 1.08, 0.4, 0.62, 5);
  // Slightly projecting central piers make the main shaft legible at tile size.
  for (const side of [-1, 1]) {
    k.box(g, 0.045, 1.08, 0.025, trim, 0, 1.16, side * 0.209);
    k.box(g, 0.025, 1.08, 0.037, trim, side * 0.259, 1.16);
  }
  block(0.41, 0.2, 0.34, 1.7, 4);
  k.box(g, 0.46, 0.045, 0.39, trim, 0, 1.92);
  block(0.3, 0.16, 0.26, 1.94, 3);
  k.cylinder(g, 0.105, 0.22, stone, 0, 2.22, 0, 0.072, 8);
  for (const x of [-0.075, 0.075])
    for (const z of [-0.06, 0.06])
      k.beam(g, [x, 2.11, z], [x * 0.75, 2.32, z * 0.75], 0.018, trim);
  k.cylinder(g, 0.085, 0.025, trim, 0, 2.34, 0, 0.085, 12);
  k.cylinder(g, 0.025, 0.19, "#b9c5c2", 0, 2.445, 0, 0.014, 10);
  k.cylinder(g, 0.011, 0.105, trim, 0, 2.5925, 0, 0.004, 8);
  k.box(g, 0.15, 0.16, 0.026, glass, 0, 0.08, 0.389);
  k.box(g, 0.21, 0.025, 0.065, trim, 0, 0.17, 0.4);
};
