import * as T from "three";
import type { ModelKit } from "../../kit";
import { arch, gable } from "../../architecture";
export function peranakan(
  k: ModelKit,
  g: T.Group,
  x = 0,
  z = 0,
  s = 1,
  color = "#d09c97",
) {
  const a = new T.Group();
  a.position.set(x, 0, z);
  a.scale.setScalar(s);
  g.add(a);
  // Recess the ground floor to leave a real, continuous five-foot way.
  k.box(a, 0.6, 0.37, 0.49, color, 0, 0.185, -0.055);
  k.box(a, 0.6, 0.38, 0.7, color, 0, 0.56, 0.05);
  k.box(a, 0.62, 0.035, 0.79, "#c9b99b", 0, 0.0175, 0.065);
  // Ridge runs parallel to the street; the party walls carry the gable ends.
  gable(k, a, 0.78, 0.64, 0.16, "#94765a", 0, 0.75, 0.05).rotation.y =
    Math.PI / 2;
  k.box(a, 0.64, 0.08, 0.065, "#f0dfbd", 0, 0.765, 0.405);
  for (const xx of [-0.17, 0.17]) {
    arch(k, a, 0.25, 0.3, 0.08, "#f1dfbd", xx, 0, 0.36);
    k.box(a, 0.15, 0.24, 0.025, "#658b81", xx, 0.56, 0.412);
    for (let i = 0; i < 2; i++)
      k.box(a, 0.16, 0.015, 0.035, "#bbd0b1", xx, 0.51 + i * 0.1, 0.425);
  }
  k.box(a, 0.68, 0.05, 0.08, "#f0dfbd", 0, 0.37, 0.405);
  for (const xx of [-0.3, 0, 0.3])
    k.box(a, 0.035, 0.77, 0.06, "#f0dfbd", xx, 0.38, 0.405);
}
/**
 * One ArtScience Museum "finger": a curved shell that springs from the central
 * dish, arcs outward and up, and is cut off flat at the tip under a skylight.
 * Unlike a flat extruded petal the real blade is a trough — narrow where it
 * meets the oculus ring, broad at the tip, with its concave face turned toward
 * the flower axis — so it is swept along a bezier and lofted ring by ring.
 */
export type PetalSpec = {
  /** Yaw of the petal's working plane around the dish. */
  angle: number;
  /** Where the blade leaves the dish, as [radius, height]. */
  base: [number, number];
  /** Centre of the flat-cut tip, as [radius, height]. */
  tip: [number, number];
  /** Departure angle above horizontal; every blade leaves the dish alike. */
  launch: number;
  /** Bezier handle length as a fraction of the base-to-tip distance. */
  bend: number;
  /** Half-width where it leaves the dish. */
  wBase: number;
  /** Half-width at the tip — the real blades widen as they rise. */
  wTip: number;
  /** Shell thickness. */
  thick: number;
  /** How far the blade edges curl toward the flower axis (the trough). */
  cup: number;
  /** Tilt about the sweep axis; gives the roof its pinwheel overlap. */
  roll: number;
};

/** Position and local axes of a petal at sweep parameter t (0 = dish, 1 = tip). */
export function petalFrame(p: PetalSpec, t: number) {
  const [r0, y0] = p.base,
    [r1, y1] = p.tip;
  const span = Math.hypot(r1 - r0, y1 - y0) * p.bend;
  const cr = r0 + Math.cos(p.launch) * span,
    cy = y0 + Math.sin(p.launch) * span;
  const q = 1 - t;
  const r = q * q * r0 + 2 * q * t * cr + t * t * r1,
    y = q * q * y0 + 2 * q * t * cy + t * t * y1;
  let dr = 2 * q * (cr - r0) + 2 * t * (r1 - cr),
    dy = 2 * q * (cy - y0) + 2 * t * (y1 - cy);
  const len = Math.hypot(dr, dy) || 1;
  ((dr /= len), (dy /= len));
  const sa = Math.sin(p.angle),
    ca = Math.cos(p.angle);
  // Radial unit vector, then the in-plane outward normal lifted into 3D.
  const center = new T.Vector3(sa * r, y, ca * r);
  const tangent = new T.Vector3(sa * dr, dy, ca * dr);
  let normal = new T.Vector3(sa * dy, -dr, ca * dy);
  let side = new T.Vector3(ca, 0, -sa);
  const cr2 = Math.cos(p.roll),
    sr = Math.sin(p.roll);
  const rolled = side.clone().multiplyScalar(cr2).addScaledVector(normal, sr);
  normal = normal.multiplyScalar(cr2).addScaledVector(side, -sr);
  side = rolled;
  return { center, side, normal, tangent };
}

export function petal(
  k: ModelKit,
  g: T.Group,
  p: PetalSpec,
  color: string,
  rings = 7,
  across = 6,
) {
  const points: number[] = [];
  const tri = (a: T.Vector3, b: T.Vector3, c: T.Vector3) =>
    points.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
  const loops: T.Vector3[][] = [];
  for (let i = 0; i < rings; i++) {
    const t = i / (rings - 1);
    const { center, side, normal } = petalFrame(p, t);
    // Widen quickly out of the dish, then ease toward the tip — adjacent
    // blades have to touch well before their ends or the bowl shows gaps.
    const w = p.wBase + (p.wTip - p.wBase) * Math.pow(t, 0.45);
    const inner: T.Vector3[] = [],
      outer: T.Vector3[] = [];
    for (let j = 0; j < across; j++) {
      const u = -1 + (2 * j) / (across - 1);
      const face = center
        .clone()
        .addScaledVector(side, w * u)
        .addScaledVector(normal, -p.cup * w * u * u);
      outer.push(face);
      inner.push(face.clone().addScaledVector(normal, p.thick));
    }
    loops.push([...inner, ...outer.reverse()]);
  }
  for (let i = 0; i < rings - 1; i++) {
    const a = loops[i],
      b = loops[i + 1];
    for (let j = 0; j < a.length; j++) {
      const n = (j + 1) % a.length;
      tri(a[j], b[j], a[n]);
      tri(a[n], b[j], b[n]);
    }
  }
  // Flat caps: the dish end is buried, the tip end is the real cut edge.
  for (const [loop, reverse] of [
    [loops[0], true],
    [loops[loops.length - 1], false],
  ] as const) {
    const mid = loop
      .reduce((sum, v) => sum.add(v), new T.Vector3())
      .multiplyScalar(1 / loop.length);
    for (let j = 0; j < loop.length; j++) {
      const n = (j + 1) % loop.length;
      if (reverse) tri(mid, loop[j], loop[n]);
      else tri(mid, loop[n], loop[j]);
    }
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.Float32BufferAttribute(points, 3));
  geo.computeVertexNormals();
  k.mesh(g, geo, color);
  // Hand the cut tip back so the caller can seat a skylight flush in it.
  const last = loops[loops.length - 1];
  return {
    tip: last
      .reduce((sum, v) => sum.add(v), new T.Vector3())
      .multiplyScalar(1 / last.length),
    frame: petalFrame(p, 1),
    width: p.wTip,
  };
}
