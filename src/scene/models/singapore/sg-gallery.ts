import type { Factory } from "../../kit";
import { dome, gable } from "../../architecture";
export const sgGalleryFactory: Factory = (k, g) => {
  const stone = "#d8d3be",
    trim = "#eee6cf",
    dark = "#768a85";
  k.box(g, 1.5, 0.065, 0.98, stone);
  // Former Supreme Court at left, longer City Hall colonnade at right.
  for (const [x, w] of [
    [-0.43, 0.57],
    [0.35, 0.72],
  ]) {
    k.box(g, w, 0.53, 0.65, stone, x, 0.33, -0.04);
    k.box(g, w + 0.04, 0.045, 0.72, trim, x, 0.62, -0.02);
    for (let i = 0; i < 5; i++) {
      const xx = x + ((i - 2) * w) / 5;
      k.box(g, 0.054, 0.25, 0.02, dark, xx, 0.37, 0.294);
      k.cylinder(g, 0.018, 0.37, trim, xx, 0.39, 0.365, 0.018, 8);
      k.box(g, 0.055, 0.033, 0.055, trim, xx, 0.575, 0.365);
    }
    for (const side of [-1, 1])
      for (const z of [-0.24, -0.04, 0.16])
        k.box(g, 0.02, 0.18, 0.06, dark, x + side * (w / 2 + 0.005), 0.35, z);
    k.box(g, w + 0.045, 0.045, 0.17, trim, x, 0.6, 0.36);
  }
  // Distinct projecting pediment and recessed copper dome.
  k.box(g, 0.32, 0.09, 0.19, trim, -0.43, 0.665, 0.34);
  gable(k, g, 0.37, 0.19, 0.12, trim, -0.43, 0.71, 0.34);
  k.cylinder(g, 0.155, 0.19, stone, -0.43, 0.73, -0.12, 0.155, 16);
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5;
    k.box(
      g,
      0.022,
      0.12,
      0.025,
      trim,
      -0.43 + Math.cos(a) * 0.157,
      0.74,
      -0.12 + Math.sin(a) * 0.157,
    );
  }
  dome(k, g, 0.195, 0.18, "#8baba0", -0.43, 0.83, -0.12);
  k.cylinder(g, 0.025, 0.055, trim, -0.43, 1.025, -0.12, 0.018, 8);
  // Gold-toned contemporary link occupies the seam, not a single classical wing.
  k.box(g, 0.13, 0.46, 0.63, "#7e9691", -0.085, 0.29, -0.06);
  k.box(g, 0.15, 0.035, 0.73, "#c4b98c", -0.085, 0.615, -0.02);
  for (let i = 0; i < 3; i++)
    k.box(
      g,
      0.48,
      0.024,
      0.18 - i * 0.035,
      trim,
      0.35,
      0.075 + i * 0.024,
      0.405 - i * 0.017,
    );
};
