import type { Factory } from "../../kit";
import { laneHouse } from "./shared";

export const bjHutongFactory: Factory = (k, g, c) => {
  k.box(g, 0.32, 0.018, 1.48, "#d7cfb8", 0, 0.009);
  // Opposing doors face the lane; neither exit is occupied by a tree.
  for (const z of [-0.45, 0, 0.45]) {
    laneHouse(k, g, c, -0.38, z, 0.56, Math.PI / 2).scale.y = 0.72;
    laneHouse(k, g, c, 0.38, z, 0.56, -Math.PI / 2).scale.y = 0.72;
  }
};
