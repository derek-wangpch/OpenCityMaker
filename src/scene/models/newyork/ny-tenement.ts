import type { Factory } from "../../kit";
import { openings } from "../../architecture";
export const nyTenementFactory: Factory = (k, g) => {
  k.box(g, 0.84, 1.07, 0.64, "#ac7659");
  openings(k, g, 0.84, 1.07, 0.64, 3, 3, "#46585c");
  k.box(g, 0.16, 0.2, 0.022, "#46585c", -0.24, 0.1, 0.333);
  k.box(g, 0.91, 0.06, 0.7, "#c5a582", 0, 1.1);
  for (let i = 0; i < 3; i++) {
    const y = 0.29 + i * 0.25;
    k.box(g, 0.45, 0.02, 0.13, "#546064", 0, y, 0.4);
    if (i < 2)
      k.beam(
        g,
        [i % 2 ? 0.2 : -0.2, y, 0.43],
        [i % 2 ? -0.2 : 0.2, y + 0.25, 0.43],
        0.024,
        "#536166",
      );
    for (const x of [-0.21, 0.21])
      k.box(g, 0.014, 0.085, 0.014, "#536166", x, y + 0.0425, 0.46);
    k.box(g, 0.45, 0.015, 0.015, "#536166", 0, y + 0.085, 0.46);
  }
};
