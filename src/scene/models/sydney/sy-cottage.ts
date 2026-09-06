import type { Factory } from "../../kit";
import { gable } from "../../architecture";
export const syCottageFactory: Factory = (k, g) => {
  // Lowest-tier sandstone cottage: long eave faces the door, not the gable end.
  k.box(g, 0.88, 0.47, 0.58, "#d1c1a0");
  const roof = gable(k, g, 0.67, 0.99, 0.22, "#7a7b6c", 0, 0.47);
  roof.rotation.y = Math.PI / 2;
  k.box(g, 0.13, 0.23, 0.02, "#796f50", 0, 0.115, 0.3);
  for (const x of [-0.27, 0.27]) {
    k.box(g, 0.13, 0.17, 0.02, "#617674", x, 0.25, 0.3);
    k.box(g, 0.1, 0.24, 0.1, "#c4ad89", x, 0.64, -0.02);
  }
  k.box(g, 0.14, 0.17, 0.02, "#617674", 0, 0.25, -0.3);
};
