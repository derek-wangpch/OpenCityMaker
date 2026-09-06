import type { Factory } from "../../kit";

// Tier 10: four open feet, a broad main deck and a smaller octagonal top deck.
export const tkTowerFactory: Factory = (k, g) => {
  const red = "#c45439",
    white = "#eee6d7",
    glass = "#627c89";
  const levels = [0.08, 0.36, 0.64, 0.91, 1.1, 1.32, 1.51, 1.72, 1.93];
  const widths = [0.49, 0.35, 0.245, 0.17, 0.135, 0.105, 0.085, 0.065, 0.048];
  k.box(g, 0.78, 0.17, 0.58, "#c6aa94", 0, 0.085);
  k.box(g, 0.82, 0.035, 0.62, white, 0, 0.185);
  for (const x of [-0.49, 0.49])
    for (const z of [-0.49, 0.49])
      k.box(g, 0.14, 0.08, 0.14, "#b9b3a4", x, 0.04, z);
  for (let i = 0; i < levels.length - 1; i++) {
    const color = i === 5 || i === 7 ? white : red;
    const corners = (r: number, y: number) => [
      [-r, y, -r],
      [r, y, -r],
      [r, y, r],
      [-r, y, r],
    ];
    const a = corners(widths[i], levels[i]),
      b = corners(widths[i + 1], levels[i + 1]);
    for (let j = 0; j < 4; j++) {
      const n = (j + 1) % 4;
      k.beam(g, a[j], b[j], i < 3 ? 0.042 : 0.027, color);
      // Leave the lowest foot bays open; above them crossed panels carry identity.
      if (i > 0) {
        k.beam(g, a[j], b[n], 0.018, color);
        k.beam(g, a[n], b[j], 0.018, color);
        k.beam(g, a[j], a[n], 0.022, color);
      }
    }
  }
  k.box(g, 0.49, 0.17, 0.49, white, 0, 1.1);
  k.box(g, 0.502, 0.095, 0.502, glass, 0, 1.11);
  for (const x of [-0.19, -0.095, 0, 0.095, 0.19]) {
    k.box(g, 0.014, 0.1, 0.514, white, x, 1.11);
    k.box(g, 0.514, 0.1, 0.014, white, 0, 1.11, x);
  }
  k.cylinder(g, 0.137, 0.12, white, 0, 1.86, 0, 0.12, 8);
  k.cylinder(g, 0.139, 0.065, glass, 0, 1.86, 0, 0.132, 8);
  for (let i = 0; i < 5; i++)
    k.cylinder(
      g,
      0.04 - i * 0.005,
      0.105,
      i % 2 ? white : red,
      0,
      1.99 + i * 0.105,
      0,
      0.035 - i * 0.005,
      8,
    );
  k.cylinder(g, 0.009, 0.1, red, 0, 2.51, 0, 0.003, 6);
};
