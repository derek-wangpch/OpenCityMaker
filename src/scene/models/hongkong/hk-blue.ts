import type { Factory } from "../../kit";
import { gable } from "../../architecture";

// Tier 5: four storeys, three suspended verandas, shallow roof and a plain flank.
export const hkBlueFactory: Factory = (k, g) => {
  const blue = "#428fb9",
    pale = "#eee5d4",
    green = "#3d786a";
  // Join the two colour bays at x=0.29; overlapping full-width bodies would
  // put blue and pale end faces on the same plane and flicker during rotation.
  k.box(g, 0.83, 1.15, 0.74, blue, -0.125, 0.575, -0.06);
  // Restored pale end bay; colour placement is a compact interpretation.
  k.box(g, 0.25, 1.15, 0.748, pale, 0.415, 0.575, -0.06);
  const roof = gable(k, g, 0.8, 1.14, 0.07, "#808b85", 0, 1.17, -0.06);
  roof.rotation.y = Math.PI / 2;
  for (const y of [0.34, 0.61, 0.88]) {
    k.box(g, 1.13, 0.035, 0.22, pale, 0, y, 0.4);
    k.box(g, 1.11, 0.021, 0.018, green, 0, y + 0.09, 0.503);
    for (const x of [-0.48, -0.24, 0, 0.24, 0.48]) {
      k.box(g, 0.02, 0.09, 0.02, green, x, y + 0.045, 0.503);
      k.box(g, 0.105, 0.17, 0.023, green, x, y + 0.14, 0.32);
    }
    // Side/rear windows do not repeat the projecting front balconies.
    for (const s of [-1, 1])
      for (const z of [-0.29, 0.12])
        k.box(g, 0.02, 0.14, 0.13, green, s * 0.551, y + 0.13, z);
    for (const x of [-0.35, 0, 0.35])
      k.box(g, 0.14, 0.14, 0.02, green, x, y + 0.13, -0.441);
  }
  k.box(g, 1.14, 0.035, 0.22, pale, 0, 1.16, 0.4);
  for (const x of [-0.35, 0, 0.35]) {
    k.box(g, 0.25, 0.235, 0.025, green, x, 0.135, 0.325);
    k.box(g, 0.27, 0.065, 0.035, pale, x, 0.285, 0.34);
  }
};
