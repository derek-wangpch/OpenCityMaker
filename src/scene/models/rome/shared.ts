import * as T from "three";
import type { ModelKit } from "../../kit";
import { gable, openings } from "../../architecture";
export function casa(k: ModelKit, g: T.Group, x = 0, z = 0, s = 1) {
  const a = new T.Group();
  a.position.set(x, 0, z);
  a.scale.setScalar(s);
  g.add(a);
  k.box(a, 0.61, 0.69, 0.61, "#c99d6c");
  gable(k, a, 0.73, 0.75, 0.2, "#a86d4c", 0, 0.71);
  openings(k, a, 0.61, 0.69, 0.61, 3, 2, "#567767");
  for (let i = 0; i < 3; i++)
    for (const xx of [-0.16, 0.16])
      k.box(a, 0.17, 0.02, 0.06, "#dfbd8c", xx, 0.12 + i * 0.23, 0.34);
}
export function columns(
  k: ModelKit,
  g: T.Group,
  n: number,
  w: number,
  h: number,
  y: number,
  z: number,
) {
  for (let i = 0; i < n; i++) {
    const x = ((i - (n - 1) / 2) * w) / (n - 1);
    k.cylinder(g, 0.027, h, "#d8c5a0", x, y + h / 2, z);
    k.box(g, 0.075, 0.04, 0.08, "#e3cfaa", x, y + h, z);
  }
}
