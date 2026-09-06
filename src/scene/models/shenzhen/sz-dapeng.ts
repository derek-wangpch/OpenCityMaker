import * as T from "three";
import type { Factory } from "../../kit";
import { TRIM, simpleRoof } from "./shared";

export const szDapengFactory: Factory = (k, g) => {
  // One continuous masonry arch, open through the whole wall depth.
  const wall = k.geometry("sz-dapeng:arched-rampart", () => {
    const shape = new T.Shape();
    shape.moveTo(-0.72, 0);
    shape.lineTo(-0.2, 0);
    shape.lineTo(-0.2, 0.13);
    shape.absarc(0, 0.13, 0.2, Math.PI, 0, true);
    shape.lineTo(0.2, 0);
    shape.lineTo(0.72, 0);
    shape.lineTo(0.72, 0.42);
    shape.lineTo(-0.72, 0.42);
    shape.closePath();
    return new T.ExtrudeGeometry(shape, {
      depth: 0.4,
      bevelEnabled: false,
      curveSegments: 8,
    });
  });
  k.mesh(g, wall, "#9e9e91", 0, 0, -0.26);
  // Crenellated parapet, then the watch pavilion.
  for (let n = -4; n <= 4; n++)
    k.box(g, 0.09, 0.08, 0.42, TRIM, n * 0.16, 0.46, -0.06);
  k.box(g, 0.72, 0.34, 0.36, "#a45a44", 0, 0.67, -0.06);
  for (const side of [-1, 1])
    for (const x of [-0.23, 0, 0.23])
      k.box(g, 0.12, 0.19, 0.014, "#4c4238", x, 0.68, -0.06 + side * 0.187);
  simpleRoof(k, g, 0.88, 0.54, 0.85, 0.18, "#608177", 0, -0.06, 0.13);
  k.box(g, 0.63, 0.025, 0.035, TRIM, 0, 1.037, -0.06);
};
