import * as T from "three";
import type { Factory } from "../../kit";
import { arch, dome, gable } from "../../architecture";

export const syTownhallFactory: Factory = (k, g) => {
  const stone = "#c8ac81",
    trim = "#e0c69a",
    roof = "#707b79",
    glass = "#536766";
  // +Z entrance: broad civic front, with the Centennial Hall extending behind.
  k.box(g, 1.28, 0.06, 1.38, trim, 0, 0.03, -0.02);
  k.box(g, 1.16, 0.62, 0.51, stone, 0, 0.37, 0.22);
  k.box(g, 0.96, 0.66, 0.76, stone, 0, 0.39, -0.38).name = "rear-hall";
  gable(k, g, 1.02, 0.8, 0.22, roof, 0, 0.72, -0.38);
  for (const y of [0.12, 0.39, 0.68])
    k.box(g, 1.22, 0.035, 0.56, trim, 0, y, 0.22);
  // Real space between the columns and recessed front wall.
  for (let i = 0; i < 4; i++)
    k.box(
      g,
      0.76 - i * 0.035,
      0.04,
      0.32 - i * 0.05,
      trim,
      0,
      0.02 + i * 0.04,
      0.63 - i * 0.025,
    );
  for (const y of [0.16, 0.43]) {
    for (const x of [-0.25, -0.09, 0.09, 0.25]) {
      k.cylinder(g, 0.024, 0.23, trim, x, y + 0.115, 0.59);
      k.box(g, 0.067, 0.024, 0.067, trim, x, y + 0.225, 0.59);
    }
    k.box(g, 0.64, 0.045, 0.22, trim, 0, y + 0.255, 0.54);
  }
  k.box(g, 0.19, 0.26, 0.02, glass, 0, 0.25, 0.486);
  gable(k, g, 0.69, 0.22, 0.15, trim, 0, 0.73, 0.54);
  // Square clock stages, open octagonal lantern and warm stone cap.
  k.box(g, 0.3, 0.58, 0.29, stone, 0, 1.01, 0.24).name = "clock-tower";
  for (const y of [0.84, 1.06, 1.31])
    k.box(g, 0.36, 0.045, 0.35, trim, 0, y, 0.24);
  for (let side = 0; side < 4; side++) {
    const face = new T.Group();
    face.position.set(0, 0, 0.24);
    face.rotation.y = (side * Math.PI) / 2;
    g.add(face);
    const clock = k.cylinder(
      face,
      0.08,
      0.016,
      "#f3e8cb",
      0,
      1.19,
      0.157,
      0.08,
      20,
    );
    clock.rotation.x = Math.PI / 2;
    clock.name = "clock-face";
    k.beam(face, [0, 1.19, 0.17], [0, 1.244, 0.17], 0.013, glass);
    k.beam(face, [0, 1.19, 0.17], [0.046, 1.166, 0.17], 0.013, glass);
    for (const x of [-0.065, 0.065])
      k.box(face, 0.05, 0.13, 0.018, glass, x, 0.965, 0.154);
  }
  k.cylinder(g, 0.11, 0.045, trim, 0, 1.355, 0.24, 0.11, 8);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    k.cylinder(
      g,
      0.014,
      0.145,
      stone,
      Math.cos(a) * 0.085,
      1.45,
      0.24 + Math.sin(a) * 0.085,
      0.014,
      6,
    );
  }
  dome(k, g, 0.115, 0.13, stone, 0, 1.525, 0.24);
  k.cylinder(g, 0.012, 0.08, trim, 0, 1.675, 0.24);
  for (const x of [-0.46, 0.46]) {
    // Truncated four-sided roof: no pointed pyramid or green dome substitution.
    const cap = k.cylinder(g, 0.22, 0.23, roof, x, 0.825, 0.22, 0.11, 4);
    cap.rotation.y = Math.PI / 4;
    k.box(g, 0.19, 0.028, 0.19, trim, x, 0.955, 0.22);
    for (const y of [0.22, 0.49]) {
      k.box(g, 0.115, 0.18, 0.016, glass, x, y, 0.483);
      arch(k, g, 0.15, 0.22, 0.027, trim, x, y - 0.1, 0.493);
    }
  }
  for (const side of [-1, 1])
    for (const z of [-0.61, -0.34, -0.07]) {
      k.box(g, 0.018, 0.34, 0.13, glass, side * 0.489, 0.39, z);
      k.box(g, 0.04, 0.6, 0.035, trim, side * 0.49, 0.37, z + 0.1);
    }
};
