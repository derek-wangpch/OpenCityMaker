import type { Factory } from "../../kit";
import { shikumenUnit } from "./shared";

export const shLilongFactory: Factory = (k, g) => {
  k.box(g, 1.5, 0.016, 0.24, "#cec6b2", 0, 0.008, 0.18);
  for (const [i, x] of [-0.448, 0, 0.448].entries())
    shikumenUnit(k, g, x, -0.1, 0.56, ["#9c6350", "#8f6a5a", "#a8705a"][i]);
};
