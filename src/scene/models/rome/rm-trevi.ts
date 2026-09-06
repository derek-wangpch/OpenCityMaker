import * as T from "three";
import type { Factory } from "../../kit";
import { arch, gable } from "../../architecture";
export const rmTreviFactory: Factory = (k, g) => {
  const stone = "#ded1b6",
    light = "#efe3c9",
    shadow = "#8c897a",
    rock = "#c6b89b",
    water = "#7bb9b0";
  // +z = fountain front. The palace is a shallow backdrop, not a free-standing temple.
  k.box(g, 1.42, 0.96, 0.24, stone, 0, 0.48, -0.4);
  for (const side of [-1, 1]) {
    k.box(g, 0.34, 0.93, 0.16, stone, side * 0.54, 0.465, -0.23);
    for (const y of [0.32, 0.63, 0.83])
      for (const dx of [-0.075, 0.075]) {
        const x = side * 0.54 + dx;
        k.box(g, 0.066, 0.11, 0.014, shadow, x, y, -0.141);
        k.box(g, 0.09, 0.022, 0.03, light, x, y - 0.066, -0.13);
        if (y < 0.8) gable(k, g, 0.1, 0.028, 0.032, light, x, y + 0.066, -0.13);
      }
  }
  // Tall central arch and two smaller sculpture niches.
  for (const x of [-0.285, 0, 0.285]) {
    const w = x === 0 ? 0.25 : 0.17,
      h = x === 0 ? 0.51 : 0.37;
    k.box(g, w * 0.85, h, 0.025, shadow, x, 0.2 + h / 2, -0.263);
    arch(k, g, w, h, 0.072, light, x, 0.2, -0.19);
    k.cylinder(
      g,
      x === 0 ? 0.035 : 0.024,
      x === 0 ? 0.2 : 0.12,
      light,
      x,
      x === 0 ? 0.37 : 0.34,
      -0.145,
      0.024,
      8,
    );
    k.sphere(
      g,
      x === 0 ? 0.038 : 0.027,
      light,
      x,
      x === 0 ? 0.505 : 0.43,
      -0.145,
    );
    if (x === 0)
      k.beam(g, [-0.07, 0.41, -0.14], [0.08, 0.44, -0.14], 0.026, light);
  }
  for (const x of [-0.4, -0.16, 0.16, 0.4]) {
    k.cylinder(g, 0.027, 0.56, light, x, 0.49, -0.105, 0.024, 12);
    k.box(g, 0.073, 0.035, 0.07, light, x, 0.787, -0.105);
  }
  k.box(g, 1.46, 0.06, 0.41, light, 0, 0.98, -0.33);
  k.box(g, 0.66, 0.18, 0.28, stone, 0, 1.075, -0.31);
  k.box(g, 0.73, 0.035, 0.32, light, 0, 1.18, -0.31);
  k.box(g, 0.36, 0.09, 0.012, rock, 0, 1.075, -0.162);
  // Four attic statues and a deliberately simple central papal crest.
  for (const x of [-0.44, -0.22, 0.22, 0.44]) {
    k.cylinder(g, 0.018, 0.095, light, x, 1.06, -0.15, 0.013, 8);
    k.sphere(g, 0.022, light, x, 1.127, -0.15);
  }
  k.sphere(g, 0.064, light, 0, 1.25, -0.29);
  for (const side of [-1, 1])
    k.beam(g, [0, 1.23, -0.28], [side * 0.105, 1.28, -0.28], 0.029, light);
  // Elliptical pool with a real raised rim; large rocks interrupt the back edge.
  const basin = k.cylinder(g, 0.66, 0.03, water, 0, 0.045, 0.24, 0.66, 40);
  basin.scale.z = 0.59;
  const rimGeo = k.geometry("trevi-pool-rim", () => {
    const s = new T.Shape();
    s.absellipse(0, 0, 0.71, 0.43, 0, Math.PI * 2, false, 0);
    const hole = new T.Path();
    hole.absellipse(0, 0, 0.66, 0.39, 0, Math.PI * 2, true, 0);
    s.holes.push(hole);
    const a = new T.ExtrudeGeometry(s, {
      depth: 0.065,
      bevelEnabled: false,
      curveSegments: 24,
    });
    a.rotateX(-Math.PI / 2);
    return a;
  });
  k.mesh(g, rimGeo, light, 0, 0, 0.24);
  for (const [x, z, s] of [
    [-0.5, 0.02, 0.16],
    [-0.3, 0.08, 0.16],
    [0, 0, 0.19],
    [0.3, 0.06, 0.18],
    [0.51, 0.04, 0.14],
    [-0.43, 0.21, 0.09],
    [0.4, 0.22, 0.105],
  ]) {
    const m = k.sphere(g, s, rock, x, 0.12, z);
    m.scale.y *= 0.7;
  }
  const shell = k.cylinder(g, 0.16, 0.04, light, 0, 0.2, 0.09, 0.2, 12);
  shell.scale.z = 0.62;
  k.box(g, 0.15, 0.11, 0.025, water, 0, 0.12, 0.22);
  // Two sea-horse silhouettes, kept broad enough to read on the board.
  for (const side of [-1, 1]) {
    k.box(g, 0.12, 0.06, 0.065, light, side * 0.24, 0.25, 0.08);
    k.beam(g, [side * 0.28, 0.25, 0.08], [side * 0.3, 0.34, 0.09], 0.04, light);
    k.sphere(g, 0.036, light, side * 0.3, 0.345, 0.1);
  }
};
