import type { Factory } from "../../kit";

// Housing type, not a claim to reproduce any one HDB block.
export const sgHdbFactory: Factory = (k, g) => {
  for (const [x, z, h, rows] of [
    [-0.36, -0.13, 1.12, 5],
    [0.35, 0.12, 0.87, 4],
  ]) {
    k.box(g, 0.47, h - 0.16, 0.65, "#dedfcb", x, (h + 0.16) / 2, z);
    for (const dx of [-0.18, 0.18])
      for (const dz of [-0.27, 0.27])
        k.box(g, 0.05, 0.17, 0.05, "#dbd9c2", x + dx, 0.085, z + dz);
    for (let j = 0; j < rows; j++) {
      const y = 0.22 + (j * (h - 0.19)) / rows;
      // Recessed corridor behind a pale parapet on the long elevation.
      k.box(g, 0.025, 0.085, 0.57, "#688782", x + 0.244, y + 0.035, z);
      k.box(g, 0.045, 0.044, 0.68, "#f0ecd9", x + 0.25, y - 0.025, z);
      for (const dx of [-0.13, 0.13])
        k.box(g, 0.085, 0.09, 0.02, "#688782", x + dx, y + 0.025, z + 0.335);
    }
    k.box(g, 0.07, h, 0.68, "#ca977b", x - 0.22, h / 2, z);
    k.box(g, 0.53, 0.035, 0.71, "#efebd8", x, h + 0.016, z);
  }
};
