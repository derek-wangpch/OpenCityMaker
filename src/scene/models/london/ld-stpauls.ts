import type { Factory } from "../../kit";
import { dome, gable } from "../../architecture";
export const ldStpaulsFactory: Factory = (k, g) => {
  const stone = "#d7d0b6",
    roof = "#899a94";
  // Long nave and short transepts, rather than a square block under the dome.
  k.box(g, 0.54, 0.48, 1.28, "#c5c2ad", 0, 0.24, -0.03);
  k.box(g, 1.1, 0.46, 0.42, "#c5c2ad", 0, 0.23, -0.18);
  gable(k, g, 0.57, 1.15, 0.12, roof, 0, 0.48, -0.04);
  k.cylinder(g, 0.29, 0.29, stone, 0, 0.735, -0.18);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    k.cylinder(
      g,
      0.018,
      0.23,
      "#eee2c7",
      Math.sin(a) * 0.285,
      0.735,
      -0.18 + Math.cos(a) * 0.285,
    );
  }
  k.cylinder(g, 0.32, 0.045, stone, 0, 0.895, -0.18);
  // Continuous hemispherical shell; no stacked cones or onion profile.
  dome(k, g, 0.305, 0.285, roof, 0, 0.918, -0.18);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    for (let j = 0; j < 6; j++) {
      const p = (n: number) => {
        const t = (n * Math.PI) / 12;
        return [
          Math.cos(t) * 0.309 * Math.sin(a),
          0.918 + Math.sin(t) * 0.288,
          -0.18 + Math.cos(t) * 0.309 * Math.cos(a),
        ];
      };
      k.beam(g, p(j), p(j + 1), 0.01, "#aab3a6");
    }
  }
  k.cylinder(g, 0.073, 0.14, stone, 0, 1.26, -0.18);
  dome(k, g, 0.082, 0.065, roof, 0, 1.33, -0.18);
  k.beam(g, [0, 1.39, -0.18], [0, 1.49, -0.18], 0.014, "#c6b77f");
  k.beam(g, [-0.033, 1.455, -0.18], [0.033, 1.455, -0.18], 0.014, "#c6b77f");
  for (const x of [-0.37, 0.37]) {
    k.box(g, 0.21, 0.62, 0.24, stone, x, 0.31, 0.49);
    k.box(g, 0.235, 0.04, 0.26, "#e5ddc1", x, 0.63, 0.49);
    k.cylinder(g, 0.083, 0.18, stone, x, 0.74, 0.49, 0.068, 8);
    for (const dx of [-0.055, 0.055])
      k.box(g, 0.025, 0.12, 0.025, "#eee2c7", x + dx, 0.73, 0.558);
    dome(k, g, 0.095, 0.08, roof, x, 0.84, 0.49);
    k.cylinder(g, 0.017, 0.1, "#c6b77f", x, 0.95, 0.49, 0.003, 8);
  }
  k.box(g, 0.56, 0.03, 0.2, stone, 0, 0.035, 0.63);
  for (const x of [-0.22, -0.11, 0, 0.11, 0.22])
    k.cylinder(g, 0.024, 0.32, "#e5ddc1", x, 0.21, 0.635);
  k.box(g, 0.6, 0.05, 0.16, stone, 0, 0.395, 0.635);
  gable(k, g, 0.6, 0.15, 0.16, stone, 0, 0.42, 0.635);
  for (const side of [-1, 1])
    for (const z of [-0.49, 0.1, 0.35])
      k.box(g, 0.014, 0.16, 0.065, "#71817f", side * 0.278, 0.3, z);
};
