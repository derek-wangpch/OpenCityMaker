import type { Factory } from "../../kit";
import { villageHouse } from "./vernacular";

export const hkHouseFactory: Factory = (k, g) => {
  villageHouse(k, g, 0, 0, 1.05, "#ebddbe");
  k.tree(g, -0.59, -0.3, 0.8);
};
