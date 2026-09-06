import type { Factory } from "../../kit";
import { gable } from "../../architecture";
export const syWarehouseFactory: Factory = (k, g) => {
  // A paired Rocks warehouse type, abstracted from the gabled bonded stores.
  k.box(g, 1.13, 0.055, 0.88, "#cbb795");
  for (const x of [-0.27, 0.27]) {
    k.box(g, 0.53, 0.63, 0.76, "#c5aa80", x, 0.37);
    gable(k, g, 0.56, 0.81, 0.22, "#817568", x, 0.685);
    for (const z of [-0.39, 0.39]) {
      k.box(g, 0.16, 0.28, 0.02, "#655e50", x, 0.195, z);
      k.box(g, 0.15, 0.2, 0.02, "#655e50", x, 0.55, z);
    }
    k.box(g, 0.19, 0.03, 0.08, "#ded0af", x, 0.435, 0.41);
    k.beam(g, [x, 0.78, 0.3], [x, 0.78, 0.54], 0.036, "#59645e");
  }
  for (const x of [-0.543, 0.543])
    for (const z of [-0.22, 0.22])
      k.box(g, 0.018, 0.17, 0.11, "#655e50", x, 0.5, z);
};
