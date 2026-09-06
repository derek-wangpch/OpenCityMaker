import type { Factory } from "../../kit";
import { villageRoof } from "./vernacular";

// Joss House Bay: a broad five-part frontage, two halls and an open lightwell.
// Tier 4 keeps the roof rhythm, stone porch and red entrances, omitting sculpture.
export const hkTempleFactory: Factory = (k, g) => {
  const stone = "#d9d1bb",
    wall = "#909f99",
    red = "#9f5147",
    roof = "#638d7d";
  k.box(g, 1.47, 0.045, 1.23, stone);
  for (const z of [0.28, -0.4]) {
    // Front hall has a portal cut through its centre.
    if (z > 0) {
      for (const x of [-0.195, 0.195])
        k.box(g, 0.21, 0.38, 0.32, wall, x, 0.235, z);
      k.box(g, 0.18, 0.11, 0.32, wall, 0, 0.37, z);
    } else k.box(g, 0.6, 0.42, 0.32, wall, 0, 0.255, z);
    villageRoof(k, g, 0.68, 0.43, 0.13, 0, z > 0 ? 0.425 : 0.465, z, roof);
  }
  for (const x of [-0.62, -0.4, 0.4, 0.62]) {
    k.box(g, 0.2, 0.33, 0.94, wall, x, 0.21, -0.1);
    villageRoof(k, g, 0.22, 1.02, 0.105, x, 0.375, -0.1, roof);
  }
  for (const x of [-0.29, 0.29])
    k.box(g, 0.035, 0.38, 0.04, stone, x, 0.235, 0.475);
  for (const x of [-0.105, 0.105])
    k.box(g, 0.027, 0.265, 0.025, red, x, 0.1775, 0.454);
  k.box(g, 0.25, 0.055, 0.025, red, 0, 0.33, 0.454);
  // One simple ridge ornament on each end of the main hall, with a central pearl.
  for (const x of [-0.28, 0.28])
    k.box(g, 0.05, 0.075, 0.045, red, x, 0.59, 0.28);
  k.sphere(g, 0.035, stone, 0, 0.6, 0.28);
  k.box(g, 0.32, 0.045, 0.12, stone, 0, 0.155, 0.6);
  for (const x of [-0.13, 0.13])
    k.box(g, 0.035, 0.11, 0.085, stone, x, 0.0775, 0.6);
};
