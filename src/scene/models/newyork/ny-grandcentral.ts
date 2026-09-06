import * as T from "three";
import type { Factory } from "../../kit";
import { arch, loft } from "../../architecture";
export const nyGrandcentralFactory: Factory = (k, g) => {
  const stone = "#c8bda3",
    trim = "#e0d0ae",
    glass = "#71888a";
  k.box(g, 1.3, 0.68, 1.04, stone);
  k.box(g, 1.4, 0.065, 1.13, trim, 0, 0.695);
  for (const x of [-0.4, 0, 0.4]) {
    k.box(g, 0.23, 0.4, 0.018, glass, x, 0.35, 0.526);
    arch(k, g, 0.3, 0.51, 0.04, trim, x, 0.12, 0.54);
    k.box(g, 0.015, 0.38, 0.02, stone, x, 0.34, 0.548);
    k.box(g, 0.22, 0.017, 0.02, stone, x, 0.24, 0.548);
    k.box(g, 0.24, 0.07, 0.04, "#616968", x, 0.05, 0.54);
  }
  for (const x of [-0.59, -0.23, -0.17, 0.17, 0.23, 0.59]) {
    k.cylinder(g, 0.025, 0.49, trim, x, 0.375, 0.567, 0.025, 8);
    k.box(g, 0.067, 0.06, 0.09, trim, x, 0.105, 0.56);
  }
  // Adjacent elevation gets two broad arches, not a duplicate main facade.
  for (const side of [-1, 1]) {
    const a = new T.Group();
    a.rotation.y = (side * Math.PI) / 2;
    g.add(a);
    for (const x of [-0.25, 0.25]) {
      k.box(a, 0.22, 0.35, 0.016, glass, x, 0.35, 0.656);
      arch(k, a, 0.29, 0.46, 0.035, trim, x, 0.14, 0.67);
    }
  }
  const rect = (w: number, d: number): [number, number][] => [
    [-w / 2, -d / 2],
    [w / 2, -d / 2],
    [w / 2, d / 2],
    [-w / 2, d / 2],
  ];
  loft(
    k,
    g,
    "ny-grandcentral-mansard",
    [
      { y: 0.727, points: rect(1.32, 1.05) },
      { y: 0.93, points: rect(1.06, 0.79) },
    ],
    "#7d8982",
  );
  k.box(g, 1.08, 0.03, 0.81, trim, 0, 0.94);
  k.box(g, 0.68, 0.025, 0.47, "#697875", 0, 0.965, -0.055);
  k.box(g, 0.55, 0.06, 0.12, glass, 0, 1, -0.06);
  // Clock and the three-figure Glory of Commerce group, deliberately abstract.
  k.cylinder(g, 0.09, 0.04, trim, 0, 0.85, 0.571, 0.09, 16).rotation.x =
    Math.PI / 2;
  k.cylinder(g, 0.066, 0.045, "#d8c797", 0, 0.85, 0.58, 0.066, 16).rotation.x =
    Math.PI / 2;
  k.beam(g, [0, 0.85, 0.607], [0, 0.895, 0.607], 0.009, "#646b66");
  k.beam(g, [0, 0.85, 0.607], [0.035, 0.83, 0.607], 0.009, "#646b66");
  for (const x of [-0.16, 0, 0.16]) {
    const y = x === 0 ? 1.04 : 0.94;
    k.cylinder(g, 0.04, 0.12, stone, x, y, 0.52, 0.026, 7);
    k.sphere(g, 0.035, trim, x, y + 0.086, 0.52);
  }
};
