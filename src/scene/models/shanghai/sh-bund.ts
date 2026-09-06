import * as T from "three";
import type { Factory } from "../../kit";
import { STONE, TRIM, colonnade } from "./shared";

export const shBundFactory: Factory = (k, g) => {
  const window = "#708184";
  k.box(g, 1.56, 0.05, 0.24, STONE, 0, 0.025, 0.58);
  // Compressed waterfront ensemble: broad domed bank beside a clock tower.
  for (const [x, w, h] of [
    [-0.31, 0.85, 0.66],
    [0.48, 0.59, 0.74],
  ]) {
    k.box(g, w, h, 0.68, "#d9cfb8", x, h / 2, -0.04);
    for (const y of [0.2, 0.51])
      k.box(g, w + 0.018, 0.028, 0.7, TRIM, x, y, -0.04);
    k.box(g, w + 0.035, 0.045, 0.72, STONE, x, h + 0.022, -0.04);
    for (const y of [0.31, 0.44, 0.6])
      for (let i = 0; i < 5; i++)
        k.box(g, 0.042, 0.07, 0.018, window, x + ((i - 2) * w) / 6, y, 0.307);
    for (const side of [-1, 1])
      for (const z of [-0.24, 0, 0.18])
        k.box(
          g,
          0.014,
          0.14,
          0.045,
          window,
          x + side * (w / 2 + 0.003),
          0.38,
          z,
        );
    colonnade(k, g, x, 0.34, w * 0.47, 0.2, 0.29, 4);
  }
  k.cylinder(g, 0.17, 0.18, STONE, -0.31, 0.78, -0.04, 0.17, 12);
  const dome = k.mesh(
    g,
    k.geometry(
      "sh-bund-review-dome",
      () => new T.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    ),
    "#b7c4bb",
    -0.31,
    0.87,
    -0.04,
  );
  dome.scale.set(0.19, 0.19, 0.19);
  k.cylinder(g, 0.043, 0.085, TRIM, -0.31, 1.08, -0.04, 0.036, 10);
  k.box(g, 0.25, 0.39, 0.27, STONE, 0.48, 0.94, -0.04);
  k.box(g, 0.28, 0.035, 0.3, TRIM, 0.48, 1.14, -0.04);
  // Four clocks, with broad hands visible at atlas size.
  for (let i = 0; i < 4; i++) {
    const face = new T.Group();
    face.position.set(0.48, 1.015, -0.04);
    face.rotation.y = (i * Math.PI) / 2;
    g.add(face);
    k.cylinder(face, 0.074, 0.016, window, 0, 0, 0.144, 0.074, 16).rotation.x =
      Math.PI / 2;
    k.cylinder(face, 0.061, 0.019, TRIM, 0, 0, 0.148, 0.061, 16).rotation.x =
      Math.PI / 2;
    k.box(face, 0.01, 0.05, 0.012, window, 0, 0.019, 0.162);
    k.box(face, 0.044, 0.01, 0.012, window, 0.015, 0, 0.162);
  }
  k.box(g, 0.16, 0.13, 0.18, STONE, 0.48, 1.22, -0.04);
  k.cylinder(
    g,
    0.12,
    0.09,
    "#a6aa91",
    0.48,
    1.325,
    -0.04,
    0.055,
    4,
  ).rotation.y = Math.PI / 4;
};
