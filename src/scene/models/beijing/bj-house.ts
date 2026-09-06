import type { Factory } from "../../kit";
import { laneHouse } from "./shared";

export const bjHouseFactory: Factory = (k, g, c) => {
  laneHouse(k, g, c, 0, 0, 1.05);
  k.tree(g, -0.57, 0.28, 0.75);
};
