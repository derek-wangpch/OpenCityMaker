import type { Factory } from "../../kit";
import { brownstone } from "./shared";
export const nyRowFactory: Factory = (k, g) => {
  for (const [x, color] of [
    [-0.4, "#95694e"],
    [0, "#a57758"],
    [0.4, "#9c735a"],
  ] as const)
    brownstone(k, g, x, 0.8, color);
};
