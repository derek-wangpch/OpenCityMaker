import type { Factory } from "../../kit";
import { gable, arch } from "../../architecture";

// Complete apartment typology inspired by Ara Coeli; the roof is reconstructed.
export const rmInsulaFactory: Factory = (k, g) => {
  k.box(g, 0.94, 0.9, 0.72, "#b18765", 0, 0.45);
  k.box(g, 0.98, 0.035, 0.76, "#cfb18a", 0, 0.35);
  k.box(g, 1, 0.04, 0.78, "#cfb18a", 0, 0.9);
  gable(k, g, 1.04, 0.82, 0.16, "#a56547", 0, 0.92);
  for (const x of [-0.31, 0, 0.31]) {
    k.box(g, 0.21, 0.28, 0.014, "#50463b", x, 0.14, 0.366);
    arch(k, g, 0.25, 0.31, 0.045, "#c6a27a", x, 0, 0.39);
    for (const y of [0.51, 0.75])
      k.box(g, 0.115, 0.145, 0.014, "#554d3f", x, y, 0.367);
  }
  for (const x of [-0.477, 0.477])
    for (const y of [0.51, 0.75])
      for (const z of [-0.19, 0.19])
        k.box(g, 0.014, 0.14, 0.105, "#554d3f", x, y, z);
};
