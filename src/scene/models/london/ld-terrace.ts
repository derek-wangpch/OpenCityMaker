import type { Factory } from "../../kit";
import { brickhome } from "./shared";
export const ldTerraceFactory: Factory = (k, g) => {
  // Touching party walls, a shared roof line and two restrained window rows.
  for (const x of [-0.225, 0.225]) brickhome(k, g, x, 0.9);
};
