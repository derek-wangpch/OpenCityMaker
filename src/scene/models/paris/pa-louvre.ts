import * as T from "three";
import type { Factory } from "../../kit";
import { gable, loft } from "../../architecture";

/** Tier 6: a compressed Cour Napoleon, with readable roofs and diamond glass. */
export const paLouvreFactory: Factory = (k, g) => {
  const STONE = "#d6c5a6",
    TRIM = "#ecddbe",
    ROOF = "#687985";
  const WINDOW = "#617777",
    GLASS = "#93c5cd",
    FRAME = "#dbe7dc";

  const roof = (
    w: number,
    d: number,
    y: number,
    h: number,
    x: number,
    z: number,
  ) => {
    const rect = (w: number, d: number): [number, number][] => [
      [-w / 2, -d / 2],
      [w / 2, -d / 2],
      [w / 2, d / 2],
      [-w / 2, d / 2],
    ];
    const mesh = loft(
      k,
      g,
      `pa-louvre-roof:${w}:${d}:${y}:${h}`,
      [
        { y, points: rect(w, d) },
        { y: y + h, points: rect(w * 0.66, d * 0.6) },
      ],
      ROOF,
    );
    mesh.position.set(x, 0, z);
  };
  const block = (w: number, d: number, h: number, x: number, z: number) => {
    k.box(g, w, h, d, STONE, x, h / 2, z);
    for (const y of [0.08, 0.27, h])
      k.box(g, w + 0.018, 0.025, d + 0.018, TRIM, x, y, z);
    roof(w + 0.03, d + 0.03, h + 0.014, 0.12, x, z);
  };

  // A broad entrance foreground and low wings leave the pyramid visible.
  k.box(g, 1.49, 0.025, 1.42, "#e2d5ba", 0, 0.0125);
  for (const x of [-0.62, 0.62]) block(0.25, 1.23, 0.4, x, -0.025);
  block(1.49, 0.24, 0.4, 0, -0.59);

  // Paired projecting pavilions and the rear central pavilion, grouped detail.
  for (const x of [-0.605, 0.605]) {
    block(0.29, 0.3, 0.49, x, 0.17);
    gable(k, g, 0.22, 0.024, 0.07, TRIM, x, 0.48, 0.333);
  }
  block(0.3, 0.3, 0.53, 0, -0.565);
  roof(0.28, 0.28, 0.65, 0.07, 0, -0.565);
  gable(k, g, 0.26, 0.025, 0.085, TRIM, 0, 0.51, -0.398);
  k.box(g, 0.08, 0.17, 0.012, WINDOW, 0, 0.14, -0.407);

  // Two clean window rows on inner and outer wings, not individual stonework.
  for (const side of [-1, 1]) {
    for (const z of [-0.38, -0.18, 0.02, 0.32, 0.49])
      for (const y of [0.17, 0.335])
        for (const x of [side * 0.49, side * 0.752])
          k.box(g, 0.012, 0.09, 0.052, WINDOW, x, y, z);
    for (const y of [0.18, 0.37]) {
      k.box(g, 0.012, 0.11, 0.07, WINDOW, side * 0.454, y, 0.17);
      k.box(g, 0.07, 0.11, 0.012, WINDOW, side * 0.605, y, 0.326);
    }
  }
  for (const x of [-0.42, -0.27, 0.27, 0.42])
    for (const y of [0.17, 0.335])
      for (const z of [-0.464, -0.716])
        k.box(g, 0.058, 0.09, 0.012, WINDOW, x, y, z);
  for (const x of [-0.62, 0.62])
    for (const y of [0.17, 0.335])
      k.box(g, 0.065, 0.09, 0.012, WINDOW, x, y, 0.597);

  type Point = [number, number, number];
  const pyramid = (
    x: number,
    z: number,
    width: number,
    h: number,
    divisions: number,
  ) => {
    const baseY = 0.036,
      r = width / 2;
    const corners: Point[] = [
      [-r, baseY, r],
      [r, baseY, r],
      [r, baseY, -r],
      [-r, baseY, -r],
    ];
    const apex: Point = [0, baseY + h, 0];
    const group = new T.Group();
    group.position.set(x, 0, z);
    g.add(group);
    const geometry = k.geometry(`pa-louvre-pyramid:${width}:${h}`, () => {
      const vertices: number[] = [];
      for (let i = 0; i < 4; i++)
        vertices.push(...corners[i], ...corners[(i + 1) % 4], ...apex);
      // Closed base; each glass face remains one flat triangle.
      vertices.push(
        ...corners[0],
        ...corners[2],
        ...corners[1],
        ...corners[0],
        ...corners[3],
        ...corners[2],
      );
      const geo = new T.BufferGeometry();
      geo.setAttribute("position", new T.Float32BufferAttribute(vertices, 3));
      geo.computeVertexNormals();
      return geo;
    });
    k.mesh(group, geometry, GLASS);
    const mix = (a: Point, b: Point, t: number): Point =>
      a.map((v, i) => v + (b[i] - v) * t) as Point;
    for (let i = 0; i < 4; i++) {
      const a = corners[i],
        b = corners[(i + 1) % 4];
      k.beam(group, a, apex, 0.012, FRAME);
      k.beam(group, a, b, 0.012, FRAME);
      // Two diagonal families lie exactly on each face and make diamonds.
      for (let j = 1; j < divisions; j++) {
        const t = j / divisions;
        k.beam(group, mix(a, b, t), mix(a, apex, t), 0.007, FRAME);
        k.beam(group, mix(b, a, t), mix(b, apex, t), 0.007, FRAME);
      }
    }
  };
  pyramid(0, 0.12, 0.64, 0.57, 5);
  for (const [x, z] of [
    [-0.405, 0.12],
    [0.405, 0.12],
    [0, -0.335],
  ])
    pyramid(x, z, 0.14, 0.115, 1);
};
