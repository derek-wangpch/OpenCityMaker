import * as T from "three";
import type { ModelKit } from "../../kit";

/** Beijing-only helpers: broad roof surfaces and readable arches, no tile grids. */
export function hipRoof(
  k: ModelKit,
  g: T.Group,
  w: number,
  d: number,
  y: number,
  rise: number,
  color: string,
  gabled = false,
) {
  const geo = k.geometry(`bj-hip:${w}:${d}:${rise}:${gabled}`, () => {
    const rings = [
      [w / 2, d / 2, 0.025],
      [w * 0.42, d * 0.4, 0.015],
      [w * (gabled ? 0.38 : 0.31), d * 0.2, rise * 0.42],
      [w * (gabled ? 0.38 : 0.26), 0.012, rise],
    ];
    const corners = (r: number[]) => [
      [-r[0], r[2], -r[1]],
      [r[0], r[2], -r[1]],
      [r[0], r[2], r[1]],
      [-r[0], r[2], r[1]],
    ];
    const p: number[] = [];
    for (let n = 0; n < rings.length - 1; n++) {
      const a = corners(rings[n]),
        b = corners(rings[n + 1]);
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        p.push(...a[i], ...b[i], ...b[j], ...a[i], ...b[j], ...a[j]);
      }
    }
    const a = corners(rings[0]),
      b = corners(rings.at(-1)!);
    p.push(...a[0], ...a[1], ...a[2], ...a[0], ...a[2], ...a[3]);
    p.push(...b[0], ...b[2], ...b[1], ...b[0], ...b[3], ...b[2]);
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geo.computeVertexNormals();
    return geo;
  });
  k.mesh(g, geo, color, 0, y);
  k.box(g, w, 0.025, d, color, 0, y + 0.01);
  k.box(g, w * (gabled ? 0.79 : 0.55), 0.038, 0.047, color, 0, y + rise);
  for (const side of [-1, 1])
    k.box(
      g,
      0.035,
      0.07,
      0.042,
      color,
      side * w * (gabled ? 0.38 : 0.26),
      y + rise + 0.025,
    );
}

/** Solid masonry pierced right through along z. No painted fake doorway. */
export function archWall(
  k: ModelKit,
  g: T.Group,
  w: number,
  h: number,
  d: number,
  opening: number,
  openingH: number,
  color: string,
) {
  const geo = k.geometry(
    `bj-arch:${w}:${h}:${d}:${opening}:${openingH}`,
    () => {
      // The opening touches the ground: use a single concave outline instead of
      // a hole with a coincident edge, which would leave degenerate triangles.
      const outline = new T.Shape();
      const r = opening / 2,
        spring = openingH - r;
      outline.moveTo(-w / 2, 0);
      outline.lineTo(-r, 0);
      outline.lineTo(-r, spring);
      outline.absarc(0, spring, r, Math.PI, 0, true);
      outline.lineTo(r, 0);
      outline.lineTo(w / 2, 0);
      outline.lineTo(w / 2, h);
      outline.lineTo(-w / 2, h);
      outline.closePath();
      const geo = new T.ExtrudeGeometry(outline, {
        depth: d,
        bevelEnabled: false,
        curveSegments: 10,
      });
      geo.translate(0, 0, -d / 2);
      return geo;
    },
  );
  k.mesh(g, geo, color);
}
