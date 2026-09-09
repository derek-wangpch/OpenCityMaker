import * as T from "three";
import type { ModelKit } from "../../kit";

/** Grouped barjeel slots; tier 1 omits poles and the extra mullions. */
export function barjeel(
  k: ModelKit,
  g: T.Group,
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  color = "#e2cba2",
  simple = false,
) {
  const solid = h * 0.36,
    open = h - solid,
    post = w * 0.14;
  k.box(g, w, solid, w, color, x, y + solid / 2, z);
  k.box(g, w * 0.8, open, w * 0.8, "#72604a", x, y + solid + open / 2, z);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1])
      k.box(
        g,
        post,
        open,
        post,
        color,
        x + (sx * (w - post)) / 2,
        y + solid + open / 2,
        z + (sz * (w - post)) / 2,
      );
  for (const face of [-1, 1]) {
    k.box(
      g,
      w * 0.1,
      open,
      w * 0.1,
      color,
      x,
      y + solid + open / 2,
      z + face * w * 0.45,
    );
    k.box(
      g,
      w * 0.1,
      open,
      w * 0.1,
      color,
      x + face * w * 0.45,
      y + solid + open / 2,
      z,
    );
  }
  k.box(g, w + 0.04, 0.035, w + 0.04, color, x, y + h + 0.0175, z);
  if (!simple) {
    k.box(g, w + 0.02, 0.025, w + 0.02, color, x, y + solid, z);
    for (const f of [0.55, 0.8]) {
      k.beam(
        g,
        [x - w * 0.75, y + h * f, z],
        [x + w * 0.75, y + h * f, z],
        0.018,
        "#6b543c",
      );
      k.beam(
        g,
        [x, y + h * f, z - w * 0.75],
        [x, y + h * f, z + w * 0.75],
        0.018,
        "#6b543c",
      );
    }
  }
}

/** Square-tooth parapet crenellation along one roof edge. */
export function teeth(
  k: ModelKit,
  g: T.Group,
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  y: number,
  color = "#e6cfaa",
  step = 0.085,
) {
  const dx = x1 - x0,
    dz = z1 - z0,
    length = Math.hypot(dx, dz),
    n = Math.max(2, Math.round(length / step));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    k.box(g, 0.03, 0.05, 0.03, color, x0 + dx * t, y + 0.025, z0 + dz * t);
  }
}

export function windhouse(k: ModelKit, g: T.Group, x = 0, z = 0, s = 1) {
  const a = new T.Group();
  a.position.set(x, 0, z);
  a.scale.setScalar(s);
  g.add(a);
  // Coral-stone mass with its slightly overhanging roof slab.
  k.box(a, 0.72, 0.36, 0.64, "#c4a37c");
  k.box(a, 0.79, 0.055, 0.71, "#ddc29a", 0, 0.38);
  // Tier 1: a modest roof tower, one door and two broad windows.
  barjeel(k, a, -0.08, 0.408, -0.06, 0.28, 0.4, "#ddc29a", true);
  k.box(a, 0.13, 0.25, 0.018, "#725e49", 0, 0.125, 0.326);
  for (const x of [-0.25, 0.25])
    k.box(a, 0.09, 0.12, 0.018, "#725e49", x, 0.24, 0.326);
}
export function courtyard(
  k: ModelKit,
  g: T.Group,
  w: number,
  d: number,
  h: number,
  color: string,
) {
  for (const z of [-d / 2, d / 2]) k.box(g, w, h, 0.16, color, 0, h / 2, z);
  for (const x of [-w / 2, w / 2]) k.box(g, 0.16, h, d, color, x, h / 2);
}
