import * as T from "three";
import type { Factory } from "../../kit";
import { TRIM } from "./shared";

export const szPinganFactory: Factory = (k, g) => {
  // Built tower: chamfered continuous shaft and a short faceted crown.
  // The cancelled needle of the early proposal is deliberately absent.
  const levels = [
    [0.07, 0.27],
    [0.35, 0.225],
    [1.65, 0.205],
    [2.24, 0.16],
    [2.48, 0.012],
  ];
  const plan = [
    [-0.72, 1],
    [0.72, 1],
    [1, 0.72],
    [1, -0.72],
    [0.72, -1],
    [-0.72, -1],
    [-1, -0.72],
    [-1, 0.72],
  ];
  const point = (i: number, j: number) => [
    plan[j][0] * levels[i][1],
    levels[i][0],
    plan[j][1] * levels[i][1],
  ];
  const pos: number[] = [];
  for (let i = 0; i < levels.length - 1; i++)
    for (let j = 0; j < 8; j++) {
      const q = (j + 1) % 8;
      pos.push(
        ...point(i, j),
        ...point(i, q),
        ...point(i + 1, q),
        ...point(i, j),
        ...point(i + 1, q),
        ...point(i + 1, j),
      );
    }
  for (let j = 0; j < 8; j++) {
    pos.push(0, 2.48, 0, ...point(4, j), ...point(4, (j + 1) % 8));
    pos.push(0, 0.07, 0, ...point(0, (j + 1) % 8), ...point(0, j));
  }
  k.mesh(
    g,
    k.geometry("sz-pingan:chamfered-shell", () => {
      const geo = new T.BufferGeometry();
      geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
      geo.computeVertexNormals();
      return geo;
    }),
    "#8fa6ac",
  );
  // Eight strong corner columns follow exactly the shell stations.
  for (let j = 0; j < 8; j++)
    for (let i = 0; i < 4; i++)
      k.beam(g, point(i, j), point(i + 1, j), 0.028, TRIM);
  for (const [sx, sz] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]) {
    for (const offset of [-0.38, 0, 0.38])
      for (let i = 0; i < 3; i++) {
        const p = (n: number) => [
          levels[n][1] * (sx + sz * offset),
          levels[n][0],
          levels[n][1] * (sz + sx * offset),
        ];
        k.beam(g, p(i), p(i + 1), 0.009, "#d0dad7");
      }
    // Two broad chevrons at the entrance convey the giant structural feet.
    for (const s of [-1, 1])
      k.beam(
        g,
        [sx * 0.27 + sz * s * 0.17, 0.09, sz * 0.27 + sx * s * 0.17],
        [sx * 0.232, 0.37, sz * 0.232],
        0.035,
        TRIM,
      );
  }
  k.box(g, 0.92, 0.045, 0.8, "#c2bfae", 0, 0.0225);
  k.box(g, 0.64, 0.035, 0.59, "#d4cdbc", 0, 0.062);
  k.box(g, 0.3, 0.025, 0.15, TRIM, 0, 0.18, 0.29);
};
