import type { Group } from "three";
import type { ModelKit } from "../../kit";
import { gable } from "../../architecture";

/** Tier 1–4 tiled gable: broad planes and one ridge, no individual tile seams. */
export function villageRoof(
  k: ModelKit,
  g: Group,
  w: number,
  d: number,
  h: number,
  x: number,
  y: number,
  z: number,
  color = "#728a7c",
) {
  const roof = gable(k, g, d, w, h, color, x, y, z);
  roof.rotation.y = Math.PI / 2;
  k.box(g, w, 0.025, 0.035, color, x, y + h, z);
}
export function villageHouse(
  k: ModelKit,
  g: Group,
  x: number,
  z: number,
  s: number,
  wall = "#e6dac3",
) {
  k.box(g, 0.66 * s, 0.42 * s, 0.52 * s, wall, x, 0.21 * s, z);
  villageRoof(k, g, 0.76 * s, 0.62 * s, 0.18 * s, x, 0.42 * s, z);
  k.box(g, 0.13 * s, 0.27 * s, 0.02, "#615d51", x, 0.135 * s, z + 0.267 * s);
  for (const dx of [-0.22, 0.22])
    k.box(
      g,
      0.105 * s,
      0.12 * s,
      0.02,
      "#72958f",
      x + dx * s,
      0.24 * s,
      z + 0.267 * s,
    );
}
