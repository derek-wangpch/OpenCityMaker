import type { Factory } from "../../kit";
import { clock } from "./shared";
import * as T from "three";
export const ldBigbenFactory: Factory = (k, g) => {
  k.box(g, 0.48, 1.56, 0.48, "#c6b38a");
  k.box(g, 0.47, 0.2, 0.47, "#c6b38a", 0, 2.005);
  for (let side = 0; side < 4; side++) {
    const face = new T.Group();
    face.rotation.y = (side * Math.PI) / 2;
    g.add(face);
    for (const x of [-0.19, 0, 0.19])
      k.box(face, 0.022, 1.28, 0.024, "#e5d0a0", x, 0.72, 0.248);
    for (const y of [0.38, 0.75, 1.12])
      for (const x of [-0.09, 0.09])
        k.box(face, 0.056, 0.22, 0.016, "#738184", x, y, 0.247);
    for (const x of [-0.14, 0, 0.14])
      k.box(face, 0.066, 0.14, 0.022, "#51666d", x, 2.005, 0.243);
  }
  for (const y of [0.18, 0.58, 0.96, 1.35])
    k.box(g, 0.51, 0.037, 0.51, "#d5c198", 0, y);
  k.box(g, 0.56, 0.39, 0.56, "#dcc798", 0, 1.66);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    clock(k, g, Math.sin(a) * 0.29, 1.67, Math.cos(a) * 0.29, 0.16, a);
  }
  k.box(g, 0.64, 0.065, 0.64, "#b3a17c", 0, 1.9);
  k.box(g, 0.54, 0.045, 0.54, "#c7ac73", 0, 2.115);
  k.cylinder(g, 0.38, 0.32, "#536a6a", 0, 2.285, 0, 0.065, 4).rotation.y =
    Math.PI / 4;
  for (const x of [-0.25, 0.25])
    for (const z of [-0.25, 0.25]) {
      k.box(g, 0.047, 0.18, 0.047, "#d7c390", x, 2.02, z);
      k.cylinder(g, 0.04, 0.11, "#c3ac7a", x, 2.16, z, 0, 4);
    }
  k.cylinder(g, 0.018, 0.15, "#c3ac7a", 0, 2.51);
};
