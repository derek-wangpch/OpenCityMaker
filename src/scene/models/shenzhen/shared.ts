import * as T from "three";
import type { ModelKit } from "../../kit";
/** Shenzhen progresses from quiet earth-and-tile homes to glass landmarks.
 * Low tiers use roof silhouettes and sparse openings; middle tiers group
 * windows and entrances; high tiers emphasize structural columns and crowns.
 */
export const EARTH = "#c2a173",
  GREY = "#8d8b80",
  TRIM = "#e6e0d0",
  GLASS = "#8fb0bd";
/** Punched openings: small separate boxes, never a continuous band. */
export function punched(
  k: ModelKit,
  g: T.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  z: number,
  cols: number,
  rows: number,
  color = "#5e7480",
) {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      k.box(
        g,
        (w / cols) * 0.44,
        (h / rows) * 0.4,
        0.014,
        color,
        x + w * ((c + 0.5) / cols - 0.5),
        (h * (r + 0.55)) / rows,
        z + d / 2,
      );
}
/** The wok-ear gable: stepped shoulders rising above the ridge. */
export function wokEar(
  k: ModelKit,
  g: T.Group,
  x: number,
  z: number,
  w: number,
  d: number,
  y: number,
  color: string,
) {
  for (const side of [-1, 1]) {
    const ex = x + (side * w) / 2;
    k.box(g, 0.07, 0.09, d * 0.9, color, ex, y + 0.045, z);
    k.box(g, 0.07, 0.08, d * 0.62, color, ex, y + 0.125, z);
    k.box(g, 0.07, 0.07, d * 0.34, color, ex, y + 0.2, z);
  }
}
export function pyramid(
  k: ModelKit,
  g: T.Group,
  r: number,
  h: number,
  color: string,
  x: number,
  y: number,
  z: number,
) {
  const m = k.cylinder(g, r, h, color, x, y + h / 2, z, 0.004, 4);
  m.rotation.y = Math.PI / 4;
  return m;
}

/** A quiet closed pitched roof for low tiers; no individual tile seams. */
export function simpleRoof(
  k: ModelKit,
  g: T.Group,
  w: number,
  d: number,
  y: number,
  h: number,
  color: string,
  x = 0,
  z = 0,
  hip = 0,
) {
  const geo = k.geometry(`sz:roof:${w}:${d}:${h}:${hip}`, () => {
    const a = [-w / 2, 0, d / 2],
      b = [w / 2, 0, d / 2],
      c = [w / 2, 0, -d / 2],
      e = [-w / 2, 0, -d / 2];
    const l = [-w / 2 + hip, h, 0],
      r = [w / 2 - hip, h, 0];
    const p = [
      ...a,
      ...b,
      ...r,
      ...a,
      ...r,
      ...l,
      ...b,
      ...c,
      ...r,
      ...c,
      ...e,
      ...l,
      ...c,
      ...l,
      ...r,
      ...e,
      ...a,
      ...l,
      ...a,
      ...e,
      ...c,
      ...a,
      ...c,
      ...b,
    ];
    const result = new T.BufferGeometry();
    result.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    result.computeVertexNormals();
    return result;
  });
  k.mesh(g, geo, color, x, y, z);
  k.box(g, w, 0.025, d, color, x, y, z);
}
