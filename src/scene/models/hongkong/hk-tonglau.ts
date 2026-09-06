import type { Factory } from "../../kit";

// Tier 7: three party-wall shophouses; grouped windows, deep verandas and shops.
export const hkTonglauFactory: Factory = (k, g) => {
  const ink = "#49665f",
    trim = "#ece2ca";
  for (const [x, h, color] of [
    [-0.46, 1.18, "#a7b89d"],
    [0, 1.4, "#d5ac75"],
    [0.46, 1.04, "#c38874"],
  ] as const) {
    k.box(g, 0.44, h, 0.7, color, x, h / 2, -0.07);
    k.box(g, 0.47, 0.055, 0.75, trim, x, h, -0.07);
    // Dark shop glazing below the first residential balcony, with a sign above.
    k.box(g, 0.32, 0.25, 0.025, ink, x, 0.145, 0.294);
    k.box(g, 0.36, 0.075, 0.05, "#be6c50", x, 0.31, 0.32);
    k.box(g, 0.4, 0.035, 0.24, trim, x, 0.355, 0.39);
    const floors = x === 0 ? 4 : 3;
    for (let i = 0; i < floors; i++) {
      const y = 0.39 + (i * (h - 0.4)) / floors;
      k.box(g, 0.45, 0.035, 0.23, trim, x, y, 0.375);
      k.box(g, 0.42, 0.024, 0.024, ink, x, y + 0.1, 0.483);
      for (const dx of [-0.18, 0, 0.18])
        k.box(g, 0.018, 0.09, 0.02, ink, x + dx, y + 0.05, 0.483);
      for (const dx of [-0.105, 0.105]) {
        k.box(g, 0.115, 0.15, 0.025, ink, x + dx, y + 0.13, 0.291);
        k.box(g, 0.115, 0.13, 0.025, ink, x + dx, y + 0.13, -0.431);
      }
      // Only exposed end walls carry side windows; none spill across party walls.
      if (x !== 0)
        for (const z of [-0.25, 0.08])
          k.box(g, 0.02, 0.14, 0.13, ink, x + Math.sign(x) * 0.23, y + 0.13, z);
    }
  }
};
