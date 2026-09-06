import type { Factory } from "../../kit";
import { prism } from "./shared";

export const hkBocFactory: Factory = (k, g) => {
  const a = 0.33,
    glass = "#5d8794",
    frame = "#e7ece2";
  const shafts: {
    c1: [number, number];
    c2: [number, number];
    outer: number;
    apex: number;
  }[] = [
    { c1: [a, a], c2: [-a, a], outer: 0.9, apex: 1.26 },
    { c1: [-a, -a], c2: [a, -a], outer: 1.26, apex: 1.62 },
    { c1: [-a, a], c2: [-a, -a], outer: 1.62, apex: 1.98 },
    { c1: [a, -a], c2: [a, a], outer: 1.98, apex: 2.34 },
  ];
  k.box(g, 0.8, 0.11, 0.8, "#8d9a94");
  type Shaft = (typeof shafts)[number];
  const meeting = new Map<string, Shaft[]>();
  for (const s of shafts) {
    prism(k, g, [[0, 0], s.c1, s.c2], [s.apex, s.outer, s.outer], glass);
    for (const c of [s.c1, s.c2]) {
      meeting.set(String(c), [...(meeting.get(String(c)) ?? []), s]);
      k.beam(g, [c[0], s.outer, c[1]], [0, s.apex, 0], 0.024, frame);
    }
    // Giant X-braces stack up the one face this shaft shows to the street.
    const nx = (s.c1[0] + s.c2[0]) / (2 * a),
      nz = (s.c1[1] + s.c2[1]) / (2 * a);
    const at = (t: number, y: number): [number, number, number] => [
      s.c1[0] + (s.c2[0] - s.c1[0]) * t + nx * 0.017,
      y,
      s.c1[1] + (s.c2[1] - s.c1[1]) * t + nz * 0.017,
    ];
    const rows = Math.max(2, Math.round(s.outer / 0.45)),
      step = s.outer / rows;
    for (let i = 0; i < rows; i++) {
      k.beam(g, at(0.03, i * step), at(0.97, (i + 1) * step), 0.027, frame);
      k.beam(g, at(0.97, i * step), at(0.03, (i + 1) * step), 0.027, frame);
      k.beam(g, at(0, (i + 1) * step), at(1, (i + 1) * step), 0.023, frame);
    }
  }
  for (const [key, pair] of meeting) {
    const [x, z] = key.split(",").map(Number);
    const [low, high] =
      pair[0].outer < pair[1].outer ? pair : [...pair].reverse();
    k.box(g, 0.052, high.outer, 0.052, frame, x, high.outer / 2, z);
    // Where a neighbour has ended, the shared diagonal wall is exposed too.
    const other = String(high.c1) === key ? high.c2 : high.c1;
    const side = -z * other[0] + x * other[1] > 0 ? -1 : 1;
    const ox = (-z / a) * 0.016 * side,
      oz = (x / a) * 0.016 * side;
    const edge = (t: number, y: number): [number, number, number] => [
      x * t + ox,
      y,
      z * t + oz,
    ];
    k.beam(g, edge(0.96, low.outer), edge(0.04, high.apex), 0.026, frame);
    k.beam(g, edge(0.96, high.outer), edge(0.04, low.apex), 0.026, frame);
  }
  for (const z of [-0.055, 0.055])
    k.cylinder(g, 0.009, 0.39, "#dbe3da", 0.055, 2.385, z);
};
