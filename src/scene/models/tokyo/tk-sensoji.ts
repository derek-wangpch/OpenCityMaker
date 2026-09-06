import type { Factory } from "../../kit";
import { temple, templeRoof } from "./shared";
export const tkSensojiFactory: Factory = (k, g) => {
  temple(k, g, 0.25, -0.12, 0.75);
  // Pagoda is to the left and forward of the hall; keep a visible gap.
  const x = -0.51,
    z = 0.24;
  k.box(g, 0.48, 0.08, 0.49, "#bdb6a6", x, 0.04, z);
  for (let i = 0; i < 5; i++) {
    const w = 0.46 - i * 0.028,
      y = 0.08 + i * 0.225;
    k.box(g, w * 0.59, 0.19, w * 0.59, "#b44837", x, y + 0.095, z);
    k.box(g, w * 0.6, 0.045, w * 0.61, "#e5d5b7", x, y + 0.115, z);
    templeRoof(k, g, w, w, y + 0.2, 0.105, x, z);
  }
  k.cylinder(g, 0.012, 0.28, "#b59a5e", x, 1.425, z);
  for (const y of [1.34, 1.4, 1.46])
    k.cylinder(g, 0.025, 0.022, "#b59a5e", x, y, z, 0.025, 8);
};
