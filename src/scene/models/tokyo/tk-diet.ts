import type { Factory } from "../../kit";
import { openings, loft } from "../../architecture";
export const tkDietFactory: Factory = (k, g) => {
  const stone = "#cbc5b1",
    roof = "#a8aaa0",
    glass = "#5e7071";
  // Low wings wrap two open courts behind the monumental central entrance.
  for (const z of [-0.39, 0.32]) {
    k.box(g, 1.46, 0.42, 0.25, stone, 0, 0.25, z);
    openings(k, g, 1.46, 0.34, 0.25, 2, 10, glass, 0, 0.09, z);
    k.box(g, 1.48, 0.035, 0.27, roof, 0, 0.475, z);
  }
  for (const x of [-0.62, 0.62]) {
    k.box(g, 0.22, 0.42, 0.65, stone, x, 0.25, -0.035);
    k.box(g, 0.25, 0.035, 0.67, roof, x, 0.475, -0.035);
    for (const z of [-0.23, -0.04, 0.15])
      k.box(g, 0.235, 0.19, 0.055, glass, x, 0.28, z);
  }
  k.box(g, 0.4, 0.76, 0.62, stone, 0, 0.42);
  k.box(g, 0.47, 0.035, 0.66, roof, 0, 0.81);
  k.box(g, 0.32, 0.23, 0.36, stone, 0, 0.945);
  for (const x of [-0.12, -0.06, 0, 0.06, 0.12])
    for (const z of [-0.187, 0.187])
      k.box(g, 0.027, 0.15, 0.018, glass, x, 0.95, z);
  const square = (r: number): [number, number][] => [
    [-r, -r],
    [r, -r],
    [r, r],
    [-r, r],
  ];
  loft(
    k,
    g,
    "tk-diet-pyramid",
    [
      { y: 1.07, points: square(0.215) },
      { y: 1.3, points: square(0.065) },
    ],
    roof,
  );
  k.box(g, 0.105, 0.055, 0.105, stone, 0, 1.32);
  for (let i = 0; i < 3; i++)
    k.box(
      g,
      0.52 - i * 0.025,
      0.04,
      0.22 - i * 0.03,
      stone,
      0,
      0.02 + i * 0.04,
      0.53 - i * 0.02,
    );
  k.box(g, 0.43, 0.34, 0.12, glass, 0, 0.32, 0.355);
  for (const x of [-0.2, -0.12, -0.04, 0.04, 0.12, 0.2])
    k.box(g, 0.035, 0.35, 0.11, stone, x, 0.32, 0.43);
  k.box(g, 0.51, 0.075, 0.21, stone, 0, 0.53, 0.4);
};
