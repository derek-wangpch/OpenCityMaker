import type { Factory } from "../../kit";
import { loft } from "../../architecture";

// Tier 5: rounded triangular prow, three facade zones and a strong cornice.
export const nyFlatironFactory: Factory = (k, g) => {
  const pts: [number, number][] = [
    [-0.5, -0.38],
    [0.5, -0.38],
    [0.52, -0.33],
    [0.22, 0.44],
    [0.17, 0.52],
    [0.11, 0.54],
    [0.045, 0.5],
    [-0.52, -0.32],
  ];
  const slab = (
    key: string,
    y: number,
    h: number,
    s: number,
    color: string,
  ) => {
    const points = pts.map(([x, z]): [number, number] => [x * s, z * s]);
    loft(
      k,
      g,
      key,
      [
        { y, points },
        { y: y + h, points },
      ],
      color,
    );
  };
  slab("ny-flatiron-body", 0, 1.5, 1, "#c5b89e");
  slab("ny-flatiron-base", 0, 0.24, 1.008, "#cec0a4");
  for (const [y, h, s] of [
    [0.25, 0.035, 1.035],
    [1.15, 0.04, 1.025],
    [1.44, 0.065, 1.06],
  ])
    slab(`ny-flatiron-cornice:${y}`, y, h, s, "#e0d3b5");
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i],
      b = pts[(i + 1) % pts.length];
    const dx = b[0] - a[0],
      dz = b[1] - a[1],
      length = Math.hypot(dx, dz);
    if (length < 0.08) continue;
    const cols = length > 0.6 ? 4 : 1;
    for (const y of [0.13, 0.4, 0.59, 0.78, 0.97, 1.29])
      for (let j = 0; j < cols; j++) {
        const t = (j + 0.5) / cols;
        const m = k.box(
          g,
          length > 0.6 ? 0.065 : 0.031,
          y === 1.29 ? 0.15 : 0.1,
          0.017,
          "#5e7378",
          a[0] + dx * t + (dz / length) * 0.008,
          y,
          a[1] + dz * t - (dx / length) * 0.008,
        );
        m.rotation.y = -Math.atan2(dz, dx);
      }
  }
};
