import * as T from "three";
import type { ModelKit } from "./kit";

/** Western ridged roof, deliberately without the upturned eaves of kit.roof. */
export function gable(
  k: ModelKit,
  g: T.Group,
  w: number,
  d: number,
  h: number,
  color: string,
  x = 0,
  y = 0,
  z = 0,
) {
  const geo = k.geometry(`gable:${w}:${d}:${h}`, () => {
    const s = new T.Shape();
    s.moveTo(-w / 2, 0);
    s.lineTo(w / 2, 0);
    s.lineTo(0, h);
    s.closePath();
    const a = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    a.translate(0, 0, -d / 2);
    return a;
  });
  return k.mesh(g, geo, color, x, y, z);
}
/** A real open arch: jambs plus an extruded curved lintel, never a painted doorway. */
export function arch(
  k: ModelKit,
  g: T.Group,
  w: number,
  h: number,
  d: number,
  color: string,
  x = 0,
  y = 0,
  z = 0,
) {
  const t = w * 0.14,
    r = w / 2,
    spring = h - r;
  for (const side of [-1, 1])
    k.box(g, t, spring, d, color, x + side * (r - t / 2), y + spring / 2, z);
  const geo = k.geometry(`arch:${w}:${d}`, () => {
    const s = new T.Shape();
    s.absarc(0, 0, r, 0, Math.PI, false);
    s.lineTo(-r + t, 0);
    s.absarc(0, 0, r - t, Math.PI, 0, true);
    s.closePath();
    const a = new T.ExtrudeGeometry(s, {
      depth: d,
      bevelEnabled: false,
      curveSegments: 8,
    });
    a.translate(0, 0, -d / 2);
    return a;
  });
  k.mesh(g, geo, color, x, y + spring, z);
}
export function dome(
  k: ModelKit,
  g: T.Group,
  r: number,
  h: number,
  color: string,
  x = 0,
  y = 0,
  z = 0,
  oculus = 0,
) {
  const geo = k.geometry(
    `dome:${r}:${h}:${oculus}`,
    () =>
      new T.SphereGeometry(
        r,
        20,
        10,
        0,
        Math.PI * 2,
        oculus,
        Math.PI / 2 - oculus,
      ),
  );
  const m = k.mesh(g, geo, color, x, y, z);
  m.scale.y = h / r;
  return m;
}
export function openings(
  k: ModelKit,
  g: T.Group,
  w: number,
  h: number,
  d: number,
  rows: number,
  cols: number,
  color: string,
  x = 0,
  y = 0,
  z = 0,
) {
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const xx = x + ((i - (cols - 1) / 2) * w) / cols,
        yy = y + ((j + 0.6) * h) / rows;
      for (const side of [-1, 1])
        k.box(
          g,
          (w / cols) * 0.36,
          (h / rows) * 0.5,
          0.018,
          color,
          xx,
          yy,
          z + side * (d / 2 + 0.009),
        );
    }
}
export function ring(
  k: ModelKit,
  g: T.Group,
  r: number,
  tube: number,
  color: string,
  x = 0,
  y = 0,
  z = 0,
) {
  return k.mesh(
    g,
    k.geometry(`torus:${r}:${tube}`, () => new T.TorusGeometry(r, tube, 6, 48)),
    color,
    x,
    y,
    z,
  );
}
/** Closed faceted cross sections for spires and sloped glass crowns. */
export function loft(
  k: ModelKit,
  g: T.Group,
  key: string,
  levels: { y: number; points: [number, number][] }[],
  color: string,
) {
  const geo = k.geometry(key, () => {
    const p: number[] = [];
    const tri = (a: number[], b: number[], c: number[]) =>
      p.push(...a, ...b, ...c);
    for (let j = 0; j < levels.length - 1; j++)
      for (let i = 0; i < levels[j].points.length; i++) {
        const n = (i + 1) % levels[j].points.length,
          a = levels[j],
          b = levels[j + 1];
        const v = (l: typeof a, q: number) => [
          l.points[q][0],
          l.y,
          l.points[q][1],
        ];
        tri(v(a, i), v(b, i), v(a, n));
        tri(v(a, n), v(b, i), v(b, n));
      }
    for (const [l, reverse] of [
      [levels[0], true],
      [levels[levels.length - 1], false],
    ] as const)
      for (let i = 0; i < l.points.length; i++) {
        const a = [l.points[i][0], l.y, l.points[i][1]],
          b = [
            l.points[(i + 1) % l.points.length][0],
            l.y,
            l.points[(i + 1) % l.points.length][1],
          ];
        if (reverse) tri([0, l.y, 0], a, b);
        else tri([0, l.y, 0], b, a);
      }
    const a = new T.BufferGeometry();
    a.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    a.computeVertexNormals();
    return a;
  });
  return k.mesh(g, geo, color);
}
