import * as T from "three";
import type { Factory } from "../../kit";
import { gable } from "../../architecture";
export const tkSentoFactory: Factory = (k, g) => {
  k.box(g, 1.05, 0.54, 0.87, "#d6ccb7");
  gable(k, g, 1.23, 1, 0.38, "#616972", 0, 0.54);
  k.box(g, 0.4, 0.34, 0.18, "#bbaa8c", 0, 0.17, 0.49);
  k.box(g, 0.27, 0.27, 0.022, "#505c5c", 0, 0.15, 0.592);
  for (const x of [-0.075, 0.075])
    k.box(g, 0.14, 0.12, 0.028, "#537a93", x, 0.3, 0.61);
  // Karahafu entrance canopy, a single curved extrusion rather than a triangle.
  const shape = new T.Shape();
  const rise = (x: number) => 0.075 + 0.14 * Math.exp(-((x / 0.17) ** 2));
  shape.moveTo(-0.3, rise(-0.3));
  for (let i = 1; i <= 20; i++) {
    const x = -0.3 + i * 0.03;
    shape.lineTo(x, rise(x));
  }
  for (let i = 20; i >= 0; i--) {
    const x = -0.3 + i * 0.03;
    shape.lineTo(x, rise(x) - 0.045);
  }
  shape.closePath();
  const canopy = k.geometry(
    "tk-sento-karahafu",
    () =>
      new T.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: false,
        curveSegments: 10,
      }),
  );
  k.mesh(g, canopy, "#616972", 0, 0.36, 0.43);
  k.cylinder(g, 0.055, 1.22, "#b5b1a7", 0.44, 0.61, -0.43);
  k.cylinder(g, 0.063, 0.055, "#737b7c", 0.44, 1.2, -0.43);
};
