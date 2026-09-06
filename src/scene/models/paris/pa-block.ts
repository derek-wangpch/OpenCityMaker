import type { Factory } from "../../kit";
import { haussmann } from "./shared";
export const paBlockFactory: Factory = (k, g) => {
  for (const [x, z] of [
    [-0.37, -0.26],
    [0.17, -0.26],
    [0.36, 0.29],
  ])
    haussmann(k, g, x, z, 0.73);
};
