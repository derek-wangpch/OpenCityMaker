import * as T from "three";
import type { ModelKit } from "../../kit";
import { gable, openings } from "../../architecture";
export function terrace(k: ModelKit, g: T.Group, x = 0, s = 1) {
  const a = new T.Group();
  a.position.x = x;
  a.scale.setScalar(s);
  g.add(a);
  k.box(a, 0.48, 0.8, 0.66, "#c7ae89");
  gable(k, a, 0.54, 0.73, 0.22, "#6c7574", 0, 0.81);
  openings(k, a, 0.48, 0.8, 0.66, 2, 2, "#576963");
  for (const y of [0.11, 0.48]) {
    k.box(a, 0.53, 0.03, 0.19, "#ded0af", 0, y, 0.39);
    for (let i = -3; i <= 3; i++)
      k.box(a, 0.013, 0.12, 0.02, "#5c6962", i * 0.075, y + 0.09, 0.47);
    k.box(a, 0.53, 0.018, 0.02, "#5c6962", 0, y + 0.15, 0.47);
  }
  for (const x of [-0.25, 0.25])
    k.box(a, 0.023, 0.85, 0.025, "#5c6962", x, 0.44, 0.45);
}
export function sandstone(
  k: ModelKit,
  g: T.Group,
  w: number,
  h: number,
  d: number,
) {
  k.box(g, w, h, d, "#c8ac81");
  openings(k, g, w, h, d, 3, 7, "#646f6d");
  k.box(g, w + 0.07, 0.06, d + 0.06, "#e0c69a", 0, h);
}
