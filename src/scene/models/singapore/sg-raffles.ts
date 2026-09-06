import type { Factory } from "../../kit";
import { arch, gable } from "../../architecture";
export const sgRafflesFactory: Factory = (k, g) => {
  const wall = "#eee9d9",
    trim = "#faf1dd",
    shade = "#71877e";
  k.box(g, 1.3, 0.035, 1.0, "#c9c3ac");
  k.box(g, 1.17, 0.77, 0.55, wall, 0, 0.42, -0.13);
  gable(k, g, 1.19, 0.57, 0.13, "#ab6c52", 0, 0.81, -0.13);
  for (const x of [-0.51, 0.51])
    k.box(g, 0.2, 0.8, 0.76, wall, x, 0.43, -0.035);
  for (let row = 0; row < 3; row++) {
    const y = 0.07 + row * 0.25;
    for (const x of [-0.48, -0.29, 0.29, 0.48]) {
      k.box(g, 0.105, 0.17, 0.016, shade, x, y + 0.1, 0.355);
      arch(k, g, 0.14, 0.205, 0.035, trim, x, y, 0.37);
    }
    k.box(g, 1.24, 0.04, 0.1, trim, 0, y + 0.225, 0.34);
    for (const x of [-0.1, 0.1])
      k.box(g, 0.105, 0.17, 0.022, shade, x, y + 0.1, 0.205);
  }
  // Central white pediment, with a low red-tiled porte-cochere below.
  k.box(g, 0.4, 0.065, 0.18, trim, 0, 0.82, 0.28);
  gable(k, g, 0.47, 0.13, 0.15, trim, 0, 0.85, 0.28);
  for (const x of [-0.19, 0.19])
    k.box(g, 0.03, 0.48, 0.045, trim, x, 0.56, 0.315);
  gable(k, g, 0.64, 0.27, 0.075, "#b27a59", 0, 0.3, 0.38);
  for (const x of [-0.27, 0, 0.27])
    k.box(g, 0.03, 0.27, 0.03, trim, x, 0.165, 0.495);
  for (const side of [-1, 1])
    for (const z of [-0.25, 0, 0.2]) {
      k.box(g, 0.018, 0.15, 0.09, shade, side * 0.616, 0.65, z);
      k.box(g, 0.018, 0.15, 0.09, shade, side * 0.616, 0.4, z);
    }
};
