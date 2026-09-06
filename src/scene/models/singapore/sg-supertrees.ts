import type { Factory } from "../../kit";
import { ring } from "../../architecture";

// A compact grove composition, not the full eighteen-tree site plan.
export const sgSupertreesFactory: Factory = (k, g) => {
  const trees = [
    [-0.29, -0.16, 1.63, 0.4],
    [0.4, 0.18, 1.3, 0.31],
    [-0.46, 0.43, 0.78, 0.22],
  ];
  for (const [x, z, h, r] of trees) {
    k.cylinder(g, 0.105, h * 0.77, "#617951", x, h * 0.385, z, 0.075, 12);
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      const point = (radius: number, y: number, angle = a) => [
        x + Math.cos(angle) * radius,
        y,
        z + Math.sin(angle) * radius,
      ];
      const foot = point(0.11, 0.06),
        neck = point(0.09, h * 0.57),
        fork = point(r * 0.54, h * 0.88);
      k.beam(g, foot, neck, 0.023, "#806577");
      k.beam(g, neck, fork, 0.022, "#9a6580");
      for (const d of [-0.12, 0.12])
        k.beam(g, fork, point(r, h, a + d), 0.017, "#9a6580");
      if (i % 2 === 0) {
        const leaf = k.sphere(
          g,
          0.06,
          "#80985e",
          x + Math.cos(a) * 0.075,
          h * (0.24 + i * 0.045),
          z + Math.sin(a) * 0.075,
        );
        leaf.scale.y *= 1.8;
      }
    }
    for (const [radius, y] of [
      [r, h],
      [r * 0.55, h * 0.88],
    ]) {
      ring(k, g, radius, 0.012, "#947489", x, y, z).rotation.x = Math.PI / 2;
    }
    // Small service/solar cap; keep the surrounding crown open.
    k.cylinder(g, r * 0.31, 0.035, "#6e8084", x, h - 0.055, z, r * 0.31, 12);
  }
  // Level walkway bows out in plan; both ends meet the two taller trunks.
  const path = (t: number) => [
    -0.29 + 0.69 * t,
    0.91,
    -0.16 + 0.34 * t + Math.sin(t * Math.PI) * 0.3,
  ];
  for (let i = 0; i < 16; i++) {
    const a = path(i / 16),
      b = path((i + 1) / 16);
    k.beam(g, a, b, 0.065, "#b7a16c");
    for (const side of [-1, 1]) {
      k.beam(
        g,
        [a[0], 0.985, a[2] + side * 0.034],
        [b[0], 0.985, b[2] + side * 0.034],
        0.009,
        "#d2b46d",
      );
      if (i % 2 === 0)
        k.beam(
          g,
          [a[0], 0.93, a[2] + side * 0.034],
          [a[0], 0.985, a[2] + side * 0.034],
          0.009,
          "#d2b46d",
        );
    }
    if (i % 4 === 2) {
      const anchor = i < 8 ? trees[0] : trees[1];
      k.beam(g, [anchor[0], anchor[2] * 0.89, anchor[1]], a, 0.007, "#a7a99b");
    }
  }
};
