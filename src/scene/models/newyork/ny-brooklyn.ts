import * as T from "three";
import type { Factory } from "../../kit";

export const nyBrooklynFactory: Factory = (k, g) => {
  k.box(g, 1.5, 0.03, 0.97, "#9cb7b4", 0, 0.015);
  k.box(g, 1.5, 0.065, 0.54, "#8e8876", 0, 0.34);
  k.box(g, 1.5, 0.025, 0.105, "#c2b397", 0, 0.39);
  const tower = k.geometry("ny-brooklyn-pointed-portals", () => {
    const s = new T.Shape();
    s.moveTo(-0.34, 0);
    s.lineTo(0.34, 0);
    s.lineTo(0.34, 1.12);
    s.lineTo(-0.34, 1.12);
    s.closePath();
    for (const x of [-0.155, 0.155]) {
      const h = new T.Path();
      h.moveTo(x - 0.105, 0.31);
      h.lineTo(x - 0.105, 0.77);
      h.quadraticCurveTo(x - 0.105, 0.91, x, 1.01);
      h.quadraticCurveTo(x + 0.105, 0.91, x + 0.105, 0.77);
      h.lineTo(x + 0.105, 0.31);
      h.closePath();
      s.holes.push(h);
    }
    const geo = new T.ExtrudeGeometry(s, {
      depth: 0.19,
      bevelEnabled: false,
      curveSegments: 8,
    });
    geo.translate(0, 0, -0.095);
    return geo;
  });
  for (const x of [-0.43, 0.43]) {
    const a = new T.Group();
    a.position.set(x, 0.03, 0);
    a.rotation.y = Math.PI / 2;
    g.add(a);
    k.mesh(a, tower, "#bcac90");
    k.box(a, 0.71, 0.06, 0.24, "#d0bea0", 0, 1.13);
    for (const xx of [-0.31, 0, 0.31])
      k.box(a, 0.045, 0.82, 0.21, "#cbbb9e", xx, 0.7);
  }
  for (const z of [-0.255, 0.255]) {
    k.box(g, 1.5, 0.024, 0.02, "#6b7b7b", 0, 0.435, z);
    const y = (x: number) =>
      Math.abs(x) <= 0.43
        ? 0.57 + 0.59 * (x / 0.43) ** 2
        : 1.16 - (Math.abs(x) - 0.43) * 2;
    // Include both tower saddles exactly, so the cable cannot miss the tower.
    const xs = [
      -0.75,
      -0.67,
      -0.59,
      -0.51,
      ...Array.from({ length: 13 }, (_, i) => -0.43 + (i * 0.86) / 12),
      0.51,
      0.59,
      0.67,
      0.75,
    ];
    for (let i = 0; i < xs.length - 1; i++)
      k.beam(
        g,
        [xs[i], y(xs[i]), z],
        [xs[i + 1], y(xs[i + 1]), z],
        0.02,
        "#6b7b7b",
      );
    for (let i = 1; i < xs.length - 1; i += 2)
      k.beam(g, [xs[i], 0.4, z], [xs[i], y(xs[i]), z], 0.013, "#7c8781");
    for (const x of [-0.43, 0.43])
      for (const dx of [-0.27, -0.15, 0.15, 0.27])
        k.beam(g, [x, 1.15, z], [x + dx, 0.41, z], 0.013, "#7c8781");
  }
};
