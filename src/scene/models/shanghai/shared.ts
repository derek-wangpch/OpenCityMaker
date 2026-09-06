import * as T from "three";
import type { ModelKit } from "../../kit";
/**
 * Shanghai reads as masonry: arched openings, horizontal cornice banding, stone
 * door surrounds and pilaster colonnades, resolving into setback and rotational
 * silhouettes. It deliberately avoids the pitched-tile village house and the
 * balconied shop column that Hong Kong owns, and the stepped-terrace timber
 * hall that Beijing owns.
 */
export const TILE = "#4a4a52",
  BRICK = "#9c6350",
  STONE = "#ded4c0",
  TRIM = "#efe7d6";
/** Two sloped planes meeting at a ridge — the plain gable of a lane house. */
export function gable(
  k: ModelKit,
  g: T.Group,
  w: number,
  d: number,
  y: number,
  h: number,
  color: string,
  x = 0,
  z = 0,
  endColor = color,
) {
  const slope = Math.hypot(d / 2, h),
    angle = Math.atan2(h, d / 2);
  for (const side of [-1, 1]) {
    const m = k.box(
      g,
      w,
      0.032,
      slope,
      color,
      x,
      y + h / 2,
      z + (side * d) / 4,
    );
    m.rotation.x = side * angle;
  }
  k.box(g, w + 0.03, 0.028, 0.045, color, x, y + h, z);
  const ends = k.geometry(`sh-gable-ends:${w}:${d}:${h}`, () => {
    const geo = new T.BufferGeometry();
    geo.setAttribute(
      "position",
      new T.Float32BufferAttribute(
        [
          w / 2,
          0,
          -d / 2,
          w / 2,
          h,
          0,
          w / 2,
          0,
          d / 2,
          -w / 2,
          0,
          d / 2,
          -w / 2,
          h,
          0,
          -w / 2,
          0,
          -d / 2,
        ],
        3,
      ),
    );
    geo.computeVertexNormals();
    return geo;
  });
  k.mesh(g, ends, endColor, x, y, z);
}
/** The stone gate that names the shikumen, with its low walled forecourt. */
export function shikumenUnit(
  k: ModelKit,
  g: T.Group,
  x: number,
  z: number,
  scale: number,
  wall = BRICK,
  rotation = 0,
) {
  const u = new T.Group();
  u.position.set(x, 0, z);
  u.rotation.y = rotation;
  u.scale.setScalar(scale);
  g.add(u);
  k.box(u, 0.8, 0.66, 0.5, wall, 0, 0.33, -0.12);
  gable(k, u, 0.86, 0.58, 0.66, 0.17, TILE, 0, -0.12, wall);
  for (const side of [-1, 1]) {
    k.box(u, 0.13, 0.17, 0.02, "#54687a", side * 0.2, 0.45, 0.14);
    k.box(u, 0.15, 0.025, 0.03, TRIM, side * 0.2, 0.545, 0.145);
  }
  // Enclose the little forecourt; keep the side walls below the front windows.
  for (const side of [-1, 1])
    k.box(u, 0.04, 0.32, 0.2, wall, side * 0.38, 0.16, 0.22);
  // Forecourt wall, then the stone surround: jambs, lintel, pediment.
  for (const side of [-1, 1])
    k.box(u, 0.15, 0.34, 0.04, wall, side * 0.32, 0.17, 0.28);
  k.box(u, 0.29, 0.34, 0.035, "#463c36", 0, 0.17, 0.28);
  for (const side of [-1, 1])
    k.box(u, 0.07, 0.4, 0.08, STONE, side * 0.16, 0.2, 0.29);
  k.box(u, 0.44, 0.08, 0.09, STONE, 0, 0.44, 0.29);
}
export function colonnade(
  k: ModelKit,
  g: T.Group,
  x: number,
  z: number,
  w: number,
  y: number,
  h: number,
  count: number,
) {
  for (let i = 0; i < count; i++)
    k.cylinder(
      g,
      0.026,
      h,
      TRIM,
      x + w * (i / (count - 1) - 0.5),
      y + h / 2,
      z,
    );
  k.box(g, w + 0.07, 0.04, 0.07, STONE, x, y + h + 0.02, z);
}
