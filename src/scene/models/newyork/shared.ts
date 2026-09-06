import * as T from "three";
import type { ModelKit } from "../../kit";
import { openings } from "../../architecture";
// Tiers 1–2: one stoop, two grouped upper window rows and a heavy cornice.
export function brownstone(
  k: ModelKit,
  g: T.Group,
  x = 0,
  s = 1,
  color = "#95694e",
) {
  const a = new T.Group();
  a.position.x = x;
  a.scale.setScalar(s);
  g.add(a);
  k.box(a, 0.5, 0.84, 0.66, color);
  for (const z of [-0.339, 0.339])
    for (const y of [0.53, 0.73])
      for (const xx of [-0.12, 0.12])
        k.box(a, 0.095, 0.13, 0.018, "#46565a", xx, y, z);
  k.box(a, 0.1, 0.16, 0.018, "#46565a", -0.12, 0.3, 0.339);
  k.box(a, 0.57, 0.065, 0.7, "#bb9770", 0, 0.86);
  k.box(a, 0.45, 0.015, 0.58, "#786e5f", 0, 0.897);
  k.box(a, 0.14, 0.24, 0.025, "#4e4840", 0.11, 0.3, 0.35);
  for (let i = 0; i < 3; i++) {
    const height = 0.06 * (i + 1);
    k.box(a, 0.22, height, 0.1, "#b39576", 0.11, height / 2, 0.58 - i * 0.1);
  }
}
export function setback(
  k: ModelKit,
  g: T.Group,
  w: number,
  h: number,
  d: number,
  color: string,
  steps: number,
) {
  for (let i = 0; i < steps; i++) {
    const scale = 1 - i / (steps + 2);
    k.box(
      g,
      w * scale,
      h / steps,
      d * scale,
      color,
      0,
      ((i + 0.5) * h) / steps,
    );
    openings(
      k,
      g,
      w * scale,
      h / steps,
      d * scale,
      2,
      4,
      "#556d76",
      0,
      (i * h) / steps,
    );
    k.box(
      g,
      w * scale + 0.03,
      0.025,
      d * scale + 0.03,
      "#c5c6b9",
      0,
      ((i + 1) * h) / steps,
    );
  }
}
