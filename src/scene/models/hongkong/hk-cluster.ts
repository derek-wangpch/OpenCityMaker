import type { Factory } from "../../kit";
import { villageHouse } from "./vernacular";

export const hkClusterFactory: Factory = (k, g) => {
  // Two short rows leave a shared lane and a clear way out to the front.
  villageHouse(k, g, -0.34, -0.28, 0.78);
  villageHouse(k, g, 0.34, -0.28, 0.78, "#d9c9af");
  villageHouse(k, g, -0.34, 0.32, 0.78, "#dfc3a6");
};
