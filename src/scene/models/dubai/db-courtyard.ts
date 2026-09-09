import type { Factory } from "../../kit";

/** Tier 2: a low, wide courtyard ring and one prominent palm. */
export const dbCourtyardFactory: Factory = (k, g) => {
  const wall = "#dfcda8",
    trim = "#f0e2c3";
  k.box(g, 1.38, 0.025, 1.26, "#b89a72");
  // Thin wings exaggerate the open sky court at board scale.
  k.box(g, 1.36, 0.32, 0.2, wall, 0, 0.16, -0.52);
  for (const x of [-0.58, 0.58]) {
    k.box(g, 0.2, 0.32, 0.84, wall, x, 0.16);
    k.box(g, 0.23, 0.035, 0.81, trim, x, 0.3375);
  }
  for (const x of [-0.43, 0.43]) k.box(g, 0.5, 0.32, 0.2, wall, x, 0.16, 0.52);
  k.box(g, 0.36, 0.08, 0.2, wall, 0, 0.28, 0.52);
  for (const z of [-0.52, 0.52]) k.box(g, 1.4, 0.035, 0.23, trim, 0, 0.3375, z);
  // This is a courtyard type, not a particular wind-tower compound.
  // Keep the palm as its only tall feature, distinct from tiers 1 and 4.
  k.cylinder(g, 0.035, 0.64, "#8c7251", 0.21, 0.345, -0.06);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI * 2) / 6;
    k.beam(
      g,
      [0.21, 0.665, -0.06],
      [0.21 + Math.cos(a) * 0.29, 0.55, -0.06 + Math.sin(a) * 0.29],
      0.085,
      i % 2 ? "#789264" : "#91a875",
    );
  }
};
