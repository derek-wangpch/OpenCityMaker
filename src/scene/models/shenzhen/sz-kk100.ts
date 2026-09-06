import * as T from "three";
import type { Factory } from "../../kit";

export const szKk100Factory: Factory = (k, g) => {
  const base = 0.06;
  const height = 2.28;
  const glass = "#78a9b3";
  const mullion = "#c9ddd7";
  const band = "#557b87";
  // Slightly wider, shorter masses and grouped window bays give a toy-like
  // read at board size while preserving the front/side crown distinction.
  // The broad elevation ends in a level roof. In the narrow elevation,
  // both faces sweep inward into a thin, rounded crown rather than a wedge.
  const profile = (t: number) => {
    const shoulder = Math.pow(Math.max(0, (t - 0.88) / 0.12), 2);
    const crown = Math.max(0, (t - 0.62) / 0.38);
    return {
      left: -0.265 + 0.008 * t + 0.012 * shoulder,
      right: 0.265 - 0.008 * t - 0.012 * shoulder,
      depth:
        (0.185 - 0.009 * t) *
        (0.13 + 0.87 * Math.sqrt(Math.max(0, 1 - crown * crown))),
    };
  };
  const point = (u: number, v: number, t: number, outset = 0) => {
    const p = profile(t);
    return [
      p.left + ((u + 1) / 2) * (p.right - p.left) + u * outset,
      base + height * t,
      v * (p.depth + outset),
    ];
  };
  // Bevelled corners preserve the broad flat curtain walls while softening
  // the silhouette. All wall strips and detailing share the same surface.
  const plan = [
    [-0.88, 1],
    [0.88, 1],
    [1, 0.84],
    [1, -0.84],
    [0.88, -1],
    [-0.88, -1],
    [-1, -0.84],
    [-1, 0.84],
  ];
  const wall: number[] = [];
  const quad = (a: number[], b: number[], c: number[], d: number[]) =>
    wall.push(...a, ...b, ...c, ...a, ...c, ...d);
  const segments = 64;
  for (let level = 0; level < segments; level++) {
    for (let edge = 0; edge < plan.length; edge++) {
      const [u, v] = plan[edge];
      const [un, vn] = plan[(edge + 1) % plan.length];
      quad(
        point(u, v, level / segments),
        point(un, vn, level / segments),
        point(un, vn, (level + 1) / segments),
        point(u, v, (level + 1) / segments),
      );
    }
  }
  for (let i = 0; i < plan.length; i++) {
    const a = plan[i],
      b = plan[(i + 1) % plan.length];
    wall.push(
      ...point(0, 0, 1),
      ...point(a[0], a[1], 1),
      ...point(b[0], b[1], 1),
    );
    wall.push(
      ...point(0, 0, 0),
      ...point(b[0], b[1], 0),
      ...point(a[0], a[1], 0),
    );
  }
  const geometry = k.geometry("sz-kk100:continuous-shell", () => {
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(wall, 3));
    geo.computeVertexNormals();
    return geo;
  });
  k.mesh(g, geometry, glass);

  // Three recessed equipment belts visible in the reference, with fine
  // horizontal floor lines subordinate to the vertical silver mullions.
  const belt = (t: number, width: number, color: string) => {
    const positions: number[] = [];
    const half = width / height / 2;
    for (let i = 0; i < plan.length; i++) {
      const a = plan[i],
        b = plan[(i + 1) % plan.length];
      const bottom = Math.max(0, t - half),
        top = Math.min(1, t + half);
      const p0 = point(a[0], a[1], bottom, 0.0015);
      const p1 = point(b[0], b[1], bottom, 0.0015);
      const p2 = point(b[0], b[1], top, 0.0015);
      const p3 = point(a[0], a[1], top, 0.0015);
      positions.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3);
    }
    const geo = k.geometry(`sz-kk100:belt:${t}:${width}`, () => {
      const result = new T.BufferGeometry();
      result.setAttribute(
        "position",
        new T.Float32BufferAttribute(positions, 3),
      );
      result.computeVertexNormals();
      return result;
    });
    k.mesh(g, geo, color);
  };
  for (let floor = 1; floor < 24; floor++) belt(floor / 24, 0.005, "#91b8bf");
  for (const t of [0.54, 0.715, 0.885]) belt(t, 0.032, band);
  const fin = (u: number, v: number, width = 0.007) => {
    // Match the shell vertices so the curved fins stay on the glass.
    const levels = [
      0,
      ...Array.from({ length: 26 }, (_, i) => (39 + i) / segments),
    ];
    for (let i = 0; i < levels.length - 1; i++)
      k.beam(
        g,
        point(u, v, levels[i], 0.003),
        point(u, v, levels[i + 1], 0.003),
        width,
        mullion,
      );
  };
  for (const side of [-1, 1]) {
    for (let i = -3; i <= 3; i++) fin(i * 0.23, side);
    for (let i = -2; i <= 2; i++) fin(side, i * 0.3);
  }
  for (const [u, v] of plan) fin(u, v, 0.009);
  belt(1, 0.006, mullion);

  k.box(g, 0.76, base, 0.6, "#c8c6b1", 0, base / 2);
  k.box(g, 0.21, 0.012, 0.13, "#9fb9c2", 0.12, 0.075, 0.22).rotation.x = 0.25;
};
