import * as T from "three";
import type { ModelKit } from "../../kit";
import { loft, openings } from "../../architecture";
export function mansard(
  k: ModelKit,
  g: T.Group,
  key: string,
  w: number,
  d: number,
  y: number,
) {
  const p = (a: number, b: number): [number, number][] => [
    [-a, -b],
    [a, -b],
    [a, b],
    [-a, b],
  ];
  loft(
    k,
    g,
    key,
    [
      { y, points: p(w / 2, d / 2) },
      { y: y + 0.2, points: p(w * 0.36, d * 0.32) },
      { y: y + 0.23, points: p(w * 0.33, d * 0.3) },
    ],
    "#677784",
  );
  for (const x of [-w * 0.25, w * 0.25]) {
    k.box(g, 0.1, 0.12, 0.06, "#daceb4", x, y + 0.1, d * 0.43);
    k.box(g, 0.055, 0.07, 0.01, "#5d7680", x, y + 0.1, d * 0.47);
  }
}
export function haussmann(k: ModelKit, g: T.Group, x = 0, z = 0, s = 1) {
  const a = new T.Group();
  a.position.set(x, 0, z);
  a.scale.setScalar(s);
  g.add(a);
  k.box(a, 0.65, 0.88, 0.67, "#d8cbb0");
  openings(k, a, 0.65, 0.88, 0.67, 4, 3, "#65777a");
  for (const y of [0.25, 0.7]) {
    k.box(a, 0.7, 0.028, 0.73, "#ece0c3", 0, y);
    k.box(a, 0.68, 0.04, 0.02, "#4f6065", 0, y + 0.06, 0.365);
  }
  mansard(k, a, "pa-haussmann-roof", 0.73, 0.77, 0.9);
}
