import type { Factory } from "../../kit";
import { hipRoof } from "./heritage";

// Tier 6: one broad ceremonial hall, double eaves, three marble terraces.
export const bjPalaceFactory: Factory = (k, g) => {
  const stone = "#e4dfcc",
    red = "#ae4e3c",
    gold = "#d5a347",
    paint = "#54847b";
  for (let i = 0; i < 3; i++) {
    const w = 1.48 - i * 0.12,
      d = 1.18 - i * 0.12,
      y = 0.08 * (i + 1);
    k.box(g, w, 0.08, d, stone, 0, y - 0.04);
    for (const side of [-1, 1]) {
      for (const x of [-0.5, -0.32, 0.32, 0.5])
        k.box(
          g,
          0.025,
          0.07,
          0.025,
          stone,
          x,
          y + 0.035,
          side * (d / 2 - 0.02),
        );
      for (const x of [-0.41, 0.41])
        k.box(
          g,
          0.22,
          0.025,
          0.025,
          stone,
          x,
          y + 0.065,
          side * (d / 2 - 0.02),
        );
    }
  }
  for (let i = 0; i < 6; i++)
    k.box(
      g,
      0.24,
      0.04 * (i + 1),
      0.065,
      stone,
      0,
      0.02 * (i + 1),
      0.74 - i * 0.045,
    );
  k.box(g, 1.08, 0.4, 0.64, red, 0, 0.44);
  for (const side of [-1, 1]) {
    for (let i = -3; i <= 3; i++) {
      k.box(g, 0.09, 0.265, 0.025, "#704b37", i * 0.145, 0.43, side * 0.326);
      k.cylinder(g, 0.018, 0.38, red, i * 0.17, 0.44, side * 0.36, 0.018, 8);
    }
    k.box(g, 1.18, 0.07, 0.04, paint, 0, 0.625, side * 0.36);
  }
  hipRoof(k, g, 1.46, 1.02, 0.67, 0.14, gold);
  k.box(g, 1.07, 0.17, 0.63, paint, 0, 0.84);
  for (const side of [-1, 1])
    for (let i = -3; i <= 3; i++)
      k.box(g, 0.09, 0.04, 0.022, "#d9bd75", i * 0.145, 0.87, side * 0.32);
  hipRoof(k, g, 1.4, 0.95, 0.94, 0.28, gold);
  k.box(g, 0.09, 0.13, 0.024, "#d8b365", 0, 0.88, 0.348);
  k.box(g, 0.06, 0.1, 0.027, "#315980", 0, 0.88, 0.352);
};
