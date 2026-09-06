import type { Factory } from "../../kit";
import { loft } from "../../architecture";
export const nyLibertyFactory: Factory = (k, g) => {
  // Fort Wood's eleven-point outline is enlarged for the game tile.
  const star: [number, number][] = Array.from({ length: 22 }, (_, i) => {
    const a = (i * Math.PI) / 11;
    const r = i % 2 ? 0.43 : 0.62;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
  loft(
    k,
    g,
    "ny-liberty-fort",
    [
      { y: 0, points: star },
      { y: 0.1, points: star },
    ],
    "#b5a98b",
  );
  k.box(g, 0.67, 0.07, 0.63, "#d0bea0", 0, 0.135);
  k.box(g, 0.49, 0.44, 0.46, "#c8b895", 0, 0.35);
  k.box(g, 0.57, 0.075, 0.54, "#dccaa2", 0, 0.6);
  for (const side of [-1, 1])
    for (const u of [-0.14, 0, 0.14]) {
      k.box(g, 0.066, 0.16, 0.018, "#8e8872", u, 0.43, side * 0.236);
      k.box(g, 0.018, 0.16, 0.066, "#8e8872", side * 0.251, 0.43, u);
    }
  k.box(g, 0.53, 0.035, 0.5, "#dccaa2", 0, 0.3);
  const pts = (w: number, d: number): [number, number][] => [
    [-w * 0.65, -d],
    [w * 0.65, -d],
    [w, -d * 0.55],
    [w, d * 0.55],
    [w * 0.65, d],
    [-w * 0.65, d],
    [-w, d * 0.55],
    [-w, -d * 0.55],
  ];
  loft(
    k,
    g,
    "ny-liberty-robe",
    [
      { y: 0.64, points: pts(0.24, 0.19) },
      { y: 1.12, points: pts(0.16, 0.12) },
      { y: 1.52, points: pts(0.2, 0.12) },
      { y: 1.65, points: pts(0.1, 0.08) },
    ],
    "#7ba795",
  );
  for (let i = -2; i <= 2; i++)
    k.beam(
      g,
      [i * 0.075, 0.66, 0.2],
      [i * 0.042, 1.46, 0.135],
      0.024,
      "#609482",
    );
  for (const side of [-1, 1])
    for (const z of [-0.09, 0.07])
      k.beam(
        g,
        [side * 0.235, 0.67, z],
        [side * 0.17, 1.08, z * 0.7],
        0.022,
        "#609482",
      );
  for (const x of [-0.11, 0.02, 0.12])
    k.beam(g, [x, 0.67, -0.19], [x * 0.7, 1.45, -0.125], 0.021, "#609482");
  k.beam(g, [-0.16, 1.49, 0.13], [0.12, 1.15, 0.13], 0.06, "#8bb29e");
  k.cylinder(g, 0.05, 0.1, "#91b49f", 0, 1.67);
  k.sphere(g, 0.11, "#94b5a0", 0, 1.81, 0.025);
  k.sphere(g, 0.074, "#6e9f8b", 0, 1.81, -0.055);
  k.box(g, 0.028, 0.042, 0.04, "#94b5a0", 0, 1.805, 0.125);
  for (let i = 0; i < 7; i++) {
    const a = 0.12 + (i * (Math.PI - 0.24)) / 6;
    k.beam(
      g,
      [Math.cos(a) * 0.09, 1.82 + Math.sin(a) * 0.06, 0.015],
      [Math.cos(a) * 0.22, 1.83 + Math.sin(a) * 0.22, 0.015],
      0.025,
      "#6e9f8b",
    );
  }
  k.beam(g, [-0.15, 1.51, 0], [-0.3, 1.76, 0.065], 0.11, "#80ab97");
  k.beam(g, [-0.3, 1.76, 0.065], [-0.34, 2.1, 0.09], 0.07, "#87af9a");
  k.cylinder(g, 0.085, 0.11, "#759887", -0.34, 2.13, 0.09, 0.1);
  k.cylinder(g, 0.075, 0.18, "#c3a05b", -0.34, 2.28, 0.09, 0, 7);
  k.beam(g, [0.16, 1.51, 0.04], [0.22, 1.25, 0.2], 0.085, "#80ab97");
  const tablet = k.box(g, 0.18, 0.29, 0.07, "#8caf98", 0.2, 1.35, 0.19);
  tablet.rotation.z = -0.16;
};
