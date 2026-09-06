import type { Factory } from "../../kit";
import { mansard } from "./shared";
export const paCafeFactory: Factory = (k, g) => {
  k.box(g, 0.8, 0.54, 0.67, "#d9c5a0");
  mansard(k, g, "pa-cafe-roof", 0.87, 0.75, 0.55);
  k.box(g, 0.84, 0.045, 0.28, "#9a5348", 0, 0.33, 0.43);
  for (let i = -3; i <= 3; i++)
    k.box(g, 0.055, 0.012, 0.29, "#e8d7b7", i * 0.115, 0.357, 0.43);
  for (const x of [-0.26, 0.26]) {
    k.cylinder(g, 0.09, 0.02, "#c2ad82", x, 0.17, 0.61);
    k.cylinder(g, 0.012, 0.17, "#5d6259", x, 0.085, 0.61);
  }
};
