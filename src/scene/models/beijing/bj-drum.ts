import type { Factory } from "../../kit";
import { hipRoof, archWall } from "./heritage";

// Tier 5: tall red masonry, a timber gallery, two main eaves and a lower skirt.
export const bjDrumFactory: Factory = (k, g) => {
  const red = "#ad5544",
    roof = "#737f64",
    trim = "#698777";
  archWall(k, g, 1.12, 0.64, 0.88, 0.23, 0.39, red);
  k.box(g, 1.18, 0.06, 0.94, "#c3b89c", 0, 0.67);
  hipRoof(k, g, 1.4, 1.09, 0.71, 0.12, roof);
  k.box(g, 0.99, 0.36, 0.71, red, 0, 0.99);
  for (const side of [-1, 1]) {
    for (const x of [-0.36, -0.18, 0, 0.18, 0.36])
      k.box(g, 0.105, 0.21, 0.02, "#614c40", x, 1.02, side * 0.36);
    for (const x of [-0.46, -0.23, 0, 0.23, 0.46])
      k.cylinder(g, 0.019, 0.36, red, x, 0.99, side * 0.425, 0.019, 8);
    k.box(g, 1.08, 0.06, 0.027, trim, 0, 1.17, side * 0.42);
    k.box(g, 1.08, 0.046, 0.025, "#c29a67", 0, 0.855, side * 0.44);
  }
  hipRoof(k, g, 1.34, 1.02, 1.205, 0.13, roof);
  k.box(g, 0.95, 0.13, 0.66, trim, 0, 1.34);
  hipRoof(k, g, 1.25, 0.94, 1.43, 0.22, roof, true);
};
