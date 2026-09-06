import type { Factory } from "../../kit";
import { TRIM, gable, colonnade } from "./shared";

export const shYangfangFactory: Factory = (k, g) => {
  k.box(g, 0.96, 0.72, 0.66, "#e3d8c1", 0, 0.36, -0.06);
  // Rounded bay window, the villa's signature.
  k.cylinder(g, 0.21, 0.68, "#eee4cd", 0.26, 0.34, 0.3, 0.21, 20);
  for (let i = 0; i < 3; i++)
    k.cylinder(g, 0.225, 0.02, TRIM, 0.26, 0.2 + i * 0.2, 0.3, 0.225, 20);
  // Three broad glazed facets make the rounded bay legible, even from the side.
  for (const y of [0.25, 0.54])
    for (const a of [-0.8, 0, 0.8]) {
      const pane = k.box(
        g,
        0.095,
        0.14,
        0.025,
        "#77969d",
        0.26 + Math.sin(a) * 0.213,
        y,
        0.3 + Math.cos(a) * 0.213,
      );
      pane.rotation.y = a;
    }
  for (const x of [-0.34, -0.07])
    k.box(g, 0.13, 0.15, 0.025, "#77969d", x, 0.6, 0.282);
  for (const side of [-1, 1])
    for (const z of [-0.24, 0.05])
      k.box(g, 0.025, 0.17, 0.13, "#77969d", side * 0.487, 0.52, z);
  k.box(g, 0.13, 0.29, 0.13, "#ad8064", -0.3, 0.9, -0.18);
  // Ground-floor arcade of round arches.
  for (const x of [-0.34, -0.06]) {
    k.cylinder(g, 0.095, 0.05, "#6d5c50", x, 0.36, 0.3, 0.1, 16).rotation.x =
      Math.PI / 2;
    k.box(g, 0.19, 0.36, 0.05, "#6d5c50", x, 0.18, 0.3);
  }
  colonnade(k, g, -0.2, 0.31, 0.44, 0, 0.42, 3);
  k.box(g, 1.02, 0.05, 0.72, TRIM, 0, 0.745, -0.06);
  gable(k, g, 1.0, 0.7, 0.77, 0.2, "#7c5a4c", 0, -0.06, "#e3d8c1");
  for (const [x, z] of [
    [-0.62, 0.42],
    [0.6, -0.5],
  ])
    k.box(g, 0.24, 0.13, 0.24, "#5f7a52", x, 0.065, z);
};
