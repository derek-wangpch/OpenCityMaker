import * as T from "three";
import type { Factory } from "../../kit";
import { dome, arch, gable } from "../../architecture";
export const syQvbFactory: Factory = (k, g) => {
  const stone = "#c8a37c",
    trim = "#e0c69a",
    copper = "#729488",
    glass = "#586e6b";
  // Long elevations run along X; short end pavilions must also read from the side.
  k.box(g, 1.46, 0.06, 0.72, trim);
  k.box(g, 1.4, 0.59, 0.64, stone, 0, 0.355);
  for (const y of [0.29, 0.64]) k.box(g, 1.46, 0.035, 0.7, trim, 0, y);
  const ridge = gable(k, g, 0.5, 1.34, 0.15, copper, 0, 0.66);
  ridge.rotation.y = Math.PI / 2;
  for (const sign of [-1, 1]) {
    const face = new T.Group();
    face.rotation.y = sign === 1 ? 0 : Math.PI;
    g.add(face);
    for (const x of [-0.56, -0.37, -0.18, 0.18, 0.37, 0.56]) {
      k.box(face, 0.1, 0.23, 0.015, glass, x, 0.435, 0.329);
      arch(k, face, 0.14, 0.27, 0.025, trim, x, 0.32, 0.343);
      k.box(face, 0.095, 0.15, 0.017, glass, x, 0.155, 0.33);
    }
    k.box(face, 0.18, 0.22, 0.024, glass, 0, 0.17, 0.34);
    arch(k, face, 0.24, 0.31, 0.04, trim, 0, 0.06, 0.36);
  }
  k.cylinder(g, 0.22, 0.18, stone, 0, 0.81, 0, 0.22, 16);
  dome(k, g, 0.26, 0.29, copper, 0, 0.9);
  k.cylinder(g, 0.057, 0.085, trim, 0, 1.225);
  dome(k, g, 0.075, 0.07, copper, 0, 1.2675);
  for (const x of [-0.61, 0.61]) {
    for (const z of [-0.24, 0.24]) {
      k.cylinder(g, 0.095, 0.11, stone, x, 0.725, z, 0.095, 12);
      dome(k, g, 0.115, 0.13, copper, x, 0.78, z);
    }
    const end = new T.Group();
    end.position.x = x < 0 ? -0.712 : 0.712;
    end.rotation.y = (Math.sign(x) * Math.PI) / 2;
    g.add(end);
    for (const xx of [-0.17, 0.17]) {
      k.box(end, 0.11, 0.25, 0.018, glass, xx, 0.44, 0);
      arch(k, end, 0.15, 0.28, 0.025, trim, xx, 0.32, 0.015);
    }
    k.box(end, 0.14, 0.21, 0.018, glass, 0, 0.17, 0);
    arch(k, end, 0.2, 0.25, 0.025, trim, 0, 0.06, 0.02);
  }
};
