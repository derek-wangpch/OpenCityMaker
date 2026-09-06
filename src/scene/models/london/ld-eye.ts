import type { Factory } from "../../kit";
import { ring } from "../../architecture";
export const ldEyeFactory: Factory = (k, g) => {
  const cy = 0.98,
    radius = 0.64;
  k.box(g, 1.12, 0.05, 0.86, "#aab6ac", 0, 0.025, 0.12);
  for (const z of [-0.035, 0.035])
    ring(k, g, radius, 0.016, "#d7dfd8", 0, cy, z);
  for (let i = 0; i < 32; i++) {
    const a = (i * Math.PI * 2) / 32,
      c = Math.cos(a),
      s = Math.sin(a);
    const x = c * radius,
      y = cy + s * radius;
    k.beam(
      g,
      [0, cy, i % 2 ? -0.045 : 0.045],
      [x, y, i % 2 ? 0.035 : -0.035],
      0.006,
      "#b9c9c7",
    );
    k.beam(g, [x, y, -0.035], [x, y, 0.035], 0.016, "#d7dfd8");
    const px = c * 0.718,
      py = cy + s * 0.718;
    k.beam(g, [x, y, 0], [px, py, 0], 0.014, "#d7dfd8");
    // Level ovoid cabins outside the rim, not beads embedded in the ring.
    const pod = k.sphere(g, 0.045, "#8fb6c0", px, py, 0);
    pod.scale.set(0.067, 0.043, 0.053);
    k.box(g, 0.075, 0.012, 0.062, "#6c8c96", px, py - 0.034, 0);
  }
  // One-sided A frame and bank-side stays.
  for (const x of [-0.39, 0.39]) {
    k.box(g, 0.15, 0.1, 0.17, "#c2c6b9", x, 0.1, 0.39);
    k.beam(g, [x, 0.12, 0.39], [0, cy, 0.1], 0.053, "#e2e4d6");
    k.beam(g, [x * 1.22, 0.05, 0.51], [0, cy, 0.1], 0.009, "#95aaa6");
  }
  k.cylinder(g, 0.059, 0.23, "#a7b9b7", 0, cy, 0.025).rotation.x = Math.PI / 2;
  k.box(g, 0.65, 0.065, 0.24, "#d2d0ba", 0, 0.16, 0);
};
