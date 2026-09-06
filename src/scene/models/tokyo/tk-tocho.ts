import type { Factory } from "../../kit";
import { loft } from "../../architecture";
export const tkTochoFactory: Factory = (k, g) => {
  const stone = "#aeb9b9",
    trim = "#d2d3c9",
    glass = "#607b89";
  k.box(g, 1.34, 0.15, 0.9, stone);
  // The first building is joined through roughly two thirds of its height.
  k.box(g, 1.08, 1.45, 0.5, stone, 0, 0.875);
  for (const x of [-0.34, 0.34]) {
    const points: [number, number][] = [
      [-0.15, -0.27],
      [0.15, -0.27],
      [0.23, -0.19],
      [0.23, 0.19],
      [0.15, 0.27],
      [-0.15, 0.27],
      [-0.23, 0.19],
      [-0.23, -0.19],
    ];
    const tower = loft(
      k,
      g,
      `tk-tocho-shaft-${x}`,
      [
        { y: 0.15, points },
        { y: 2.08, points },
      ],
      glass,
    );
    tower.position.x = x;
    for (const dx of [-0.14, 0, 0.14])
      for (const z of [-0.282, 0.282])
        k.box(g, 0.027, 1.9, 0.028, trim, x + dx, 1.1, z);
    for (const xx of [-0.238, 0.238])
      for (const z of [-0.13, 0, 0.13])
        k.box(g, 0.025, 1.9, 0.025, stone, x + xx, 1.1, z);
    for (let j = 0; j < 12; j++) {
      k.box(g, 0.32, 0.027, 0.57, stone, x, 0.32 + j * 0.14);
      k.box(g, 0.49, 0.027, 0.34, stone, x, 0.32 + j * 0.14);
    }
    // Recessed crown framed by two piers and a level lintel.
    k.box(g, 0.24, 0.24, 0.26, glass, x, 2.15);
    for (const dx of [-0.17, 0.17])
      k.box(g, 0.07, 0.34, 0.33, stone, x + dx, 2.21);
    k.box(g, 0.41, 0.055, 0.33, trim, x, 2.39);
    k.box(g, 0.26, 0.045, 0.39, trim, x, 2.04);
  }
  for (let j = 0; j < 8; j++)
    k.box(g, 0.22, 0.055, 0.515, glass, 0, 0.43 + j * 0.14);
  for (const x of [-0.11, 0.11]) k.box(g, 0.025, 1.38, 0.53, trim, x, 0.88);
  k.box(g, 0.3, 0.22, 0.025, glass, 0, 0.25, 0.266);
  k.box(g, 0.42, 0.055, 0.25, trim, 0, 0.39, 0.36);
};
