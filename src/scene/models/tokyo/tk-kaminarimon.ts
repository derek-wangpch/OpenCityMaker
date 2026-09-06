import type { Factory } from "../../kit";
import { templeRoof } from "./shared";
export const tkKaminarimonFactory: Factory = (k, g) => {
  const red = "#b74736",
    jade = "#76968b";
  for (const x of [-0.48, 0.48]) {
    k.box(g, 0.28, 0.62, 0.43, red, x, 0.34);
    for (const z of [-0.225, 0.225]) {
      k.box(g, 0.2, 0.31, 0.025, "#514e43", x, 0.4, z);
      k.box(g, 0.23, 0.12, 0.03, jade, x, 0.18, z);
      for (const dx of [-0.085, 0, 0.085])
        k.box(g, 0.018, 0.32, 0.033, jade, x + dx, 0.4, z);
    }
    for (const dx of [-0.16, 0.16])
      k.cylinder(g, 0.045, 0.7, red, x + dx, 0.35, 0);
  }
  k.box(g, 1.3, 0.13, 0.47, red, 0, 0.735);
  k.box(g, 1.24, 0.055, 0.49, "#dfd2b4", 0, 0.8);
  templeRoof(k, g, 1.49, 0.91, 0.85, 0.34);
  k.cylinder(g, 0.15, 0.21, "#ce4935", 0, 0.51, 0, 0.15, 12);
  k.cylinder(g, 0.1, 0.04, "#ce4935", 0, 0.385, 0, 0.15, 12);
  k.cylinder(g, 0.15, 0.04, "#ce4935", 0, 0.635, 0, 0.1, 12);
  for (const y of [0.355, 0.665])
    k.cylinder(g, 0.1, 0.035, "#af9658", 0, y, 0, 0.1, 12);
  k.box(g, 0.075, 0.21, 0.02, "#443b30", 0, 0.51, 0.151);
  k.box(g, 0.23, 0.095, 0.025, "#57766a", 0, 0.75, 0.254);
};
