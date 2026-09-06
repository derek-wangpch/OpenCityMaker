import type { Factory } from "../../kit";
import { arch } from "../../architecture";
export const rmCastelFactory: Factory = (k, g) => {
  const stone = "#bda584",
    trim = "#d6c09a",
    dark = "#665d4d",
    bronze = "#729586";
  // Square enclosure with four squat corner bastions, below the ancient drum.
  k.box(g, 1.13, 0.16, 1.08, stone, 0, 0.08);
  for (const x of [-0.51, 0.51])
    for (const z of [-0.49, 0.49]) {
      const tower = k.cylinder(g, 0.19, 0.23, stone, x, 0.115, z, 0.16, 5);
      tower.rotation.y = Math.PI / 5;
      k.cylinder(g, 0.17, 0.03, trim, x, 0.245, z, 0.17, 5).rotation.y =
        Math.PI / 5;
    }
  k.cylinder(g, 0.49, 0.55, stone, 0, 0.43, 0, 0.49, 32);
  k.cylinder(g, 0.505, 0.038, trim, 0, 0.36, 0, 0.505, 32);
  k.cylinder(g, 0.535, 0.07, trim, 0, 0.725, 0, 0.535, 32);
  k.cylinder(g, 0.49, 0.1, stone, 0, 0.8, 0, 0.49, 32);
  for (let i = 0; i < 20; i++) {
    const a = (i * Math.PI) / 10;
    const corbel = k.box(
      g,
      0.032,
      0.07,
      0.065,
      trim,
      Math.sin(a) * 0.49,
      0.66,
      Math.cos(a) * 0.49,
    );
    corbel.rotation.y = a;
    if (i % 2 === 0) {
      const slit = k.box(
        g,
        0.035,
        0.036,
        0.012,
        dark,
        Math.sin(a) * 0.494,
        0.807,
        Math.cos(a) * 0.494,
      );
      slit.rotation.y = a;
    }
  }
  k.box(g, 0.54, 0.25, 0.49, "#c9ad83", 0, 0.97, -0.04);
  k.box(g, 0.59, 0.045, 0.54, trim, 0, 1.115, -0.04);
  for (const z of [-0.29, 0.21]) k.box(g, 0.59, 0.055, 0.028, trim, 0, 1.16, z);
  for (const x of [-0.28, 0.28])
    k.box(g, 0.03, 0.055, 0.52, trim, x, 1.16, -0.04);
  for (const x of [-0.16, 0, 0.16])
    k.box(g, 0.055, 0.09, 0.015, dark, x, 0.975, 0.214);
  for (const z of [-0.15, 0.08])
    k.box(g, 0.015, 0.085, 0.055, dark, 0.278, 0.975, z);
  k.box(g, 0.16, 0.22, 0.02, dark, 0, 0.22, 0.495);
  arch(k, g, 0.2, 0.26, 0.04, trim, 0, 0.1, 0.52);
  for (let i = 0; i < 3; i++)
    k.box(g, 0.24, 0.035, 0.075, trim, 0, 0.025 + i * 0.032, 0.7 - i * 0.052);
  k.box(g, 0.1, 0.055, 0.1, stone, 0, 1.165, -0.03);
  k.cylinder(g, 0.025, 0.13, bronze, 0, 1.255, -0.03, 0.016, 8);
  k.sphere(g, 0.025, bronze, 0, 1.345, -0.03);
  for (const side of [-1, 1])
    k.beam(g, [0, 1.29, -0.045], [side * 0.105, 1.38, -0.09], 0.035, bronze);
  k.beam(g, [0.02, 1.29, -0.01], [0.1, 1.21, 0.03], 0.015, bronze);
};
