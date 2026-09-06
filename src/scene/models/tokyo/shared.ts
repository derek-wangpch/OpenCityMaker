import * as T from "three";
import type { ModelKit } from "../../kit";
import { gable } from "../../architecture";

/** Eaves face +Z; the townhouse ridge runs along the street, along X. */
export function timber(k: ModelKit, g: T.Group, x = 0, z = 0, s = 1) {
  const a = new T.Group();
  a.position.set(x, 0, z);
  a.scale.setScalar(s);
  g.add(a);
  k.box(a, 0.65, 0.58, 0.75, "#c7b394");
  const roof = gable(k, a, 0.86, 0.77, 0.23, "#575d62", 0, 0.58);
  roof.rotation.y = Math.PI / 2;
  k.box(a, 0.71, 0.035, 0.23, "#575d62", 0, 0.32, 0.41).rotation.x = 0.12;
  k.box(a, 0.48, 0.15, 0.02, "#695848", 0, 0.46, 0.383);
  k.box(a, 0.45, 0.22, 0.025, "#75604a", -0.06, 0.13, 0.385);
  for (const x of [-0.22, 0, 0.2])
    k.box(a, 0.025, 0.24, 0.035, "#d4c19f", x, 0.13, 0.397);
}

/** Sparse temple roof: kit shape, without its fourteen miniature tile seams. */
export function templeRoof(
  k: ModelKit,
  g: T.Group,
  w: number,
  d: number,
  y: number,
  h: number,
  x = 0,
  z = 0,
) {
  const shell = new T.Group();
  k.roof(shell, w, d, y, h, "#656b70", x, z);
  // First three meshes are the continuous roof, soffit and ridge.
  for (const part of [...shell.children].slice(0, 3)) g.add(part);
}
export function temple(k: ModelKit, g: T.Group, x = 0, z = 0, s = 1) {
  const a = new T.Group();
  a.position.set(x, 0, z);
  a.scale.setScalar(s);
  g.add(a);
  k.box(a, 1.12, 0.1, 0.9, "#bdb6a6");
  k.box(a, 0.93, 0.43, 0.63, "#b44837", 0, 0.33, -0.06);
  k.box(a, 0.82, 0.23, 0.02, "#5b554a", 0, 0.3, 0.266);
  for (const x of [-0.4, -0.2, 0, 0.2, 0.4])
    k.box(a, 0.04, 0.46, 0.05, "#b44837", x, 0.34, 0.35);
  k.box(a, 0.94, 0.065, 0.045, "#eee0c3", 0, 0.52, 0.355);
  templeRoof(k, a, 1.31, 1, 0.6, 0.4);
  for (let i = 0; i < 3; i++)
    k.box(
      a,
      0.65,
      0.035,
      0.2 - i * 0.035,
      "#bdb6a6",
      0,
      0.018 + i * 0.035,
      0.48 - i * 0.018,
    );
}
