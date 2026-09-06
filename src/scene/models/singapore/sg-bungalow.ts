import type { Factory } from "../../kit";
import { loft } from "../../architecture";
export const sgBungalowFactory: Factory = (k, g) => {
  const dark = "#424e48";
  k.box(g, 1.23, 0.055, 0.98, "#c4bea7");
  k.box(g, 0.88, 0.57, 0.59, "#eeeade", 0, 0.34, -0.055);
  // Hipped overhanging roof, no decorative tile seams at tier 3.
  loft(
    k,
    g,
    "sg-bungalow:hip",
    [
      {
        y: 0.64,
        points: [
          [-0.66, -0.48],
          [0.66, -0.48],
          [0.66, 0.48],
          [-0.66, 0.48],
        ],
      },
      {
        y: 0.94,
        points: [
          [-0.35, -0.016],
          [0.35, -0.016],
          [0.35, 0.016],
          [-0.35, 0.016],
        ],
      },
    ],
    dark,
  );
  for (const x of [-0.55, 0, 0.55])
    k.box(g, 0.035, 0.59, 0.035, dark, x, 0.345, 0.4);
  k.box(g, 0.91, 0.035, 0.62, dark, 0, 0.37, -0.055);
  for (const x of [-0.26, 0.26]) {
    k.box(g, 0.15, 0.18, 0.02, dark, x, 0.48, 0.248);
    k.beam(g, [x - 0.1, 0.12, 0.249], [x + 0.1, 0.34, 0.249], 0.025, dark);
  }
  k.box(g, 0.14, 0.28, 0.02, dark, 0, 0.2, 0.25);
  for (const side of [-1, 1])
    k.box(g, 0.02, 0.18, 0.17, dark, side * 0.45, 0.48, -0.05);
};
