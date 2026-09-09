import type { Factory } from "../../kit";
import { barjeel } from "./shared";

/** Tier 4: a stepped ochre quarter with two separated skyline towers. */
export const dbFahidiFactory: Factory = (k, g) => {
  // Two taller rear houses and two low front terraces frame a cross alley.
  // X is facade width, Z is depth; this is a neighbourhood abstraction.
  const houses = [
    [-0.4, -0.36, 0.54, 0.6, 0.72, "#bd9470"],
    [0.32, -0.4, 0.62, 0.52, 0.58, "#d1ab82"],
    [-0.43, 0.36, 0.5, 0.5, 0.36, "#d9ba93"],
    [0.3, 0.35, 0.64, 0.52, 0.42, "#c69c75"],
  ] as const;
  k.box(g, 0.18, 0.012, 1.36, "#a28463", -0.055, 0.006, 0);
  k.box(g, 1.32, 0.012, 0.18, "#a28463", 0, 0.006, 0.01);
  for (const [x, z, w, d, h, color] of houses) {
    k.box(g, w, h, d, color, x, h / 2, z);
    // Continuous flat parapets read as terraces rather than tiny castle teeth.
    for (const edge of [-1, 1]) {
      k.box(
        g,
        w,
        0.06,
        0.035,
        "#e6cba7",
        x,
        h + 0.03,
        z + (edge * (d - 0.035)) / 2,
      );
      k.box(
        g,
        0.035,
        0.06,
        d - 0.07,
        "#e6cba7",
        x + (edge * (w - 0.035)) / 2,
        h + 0.03,
        z,
      );
    }
    k.box(g, 0.11, 0.23, 0.016, "#705541", x, 0.115, z + d / 2 + 0.005);
    k.box(g, 0.016, 0.13, 0.1, "#705541", x + w / 2 + 0.005, h * 0.65, z);
  }
  // Pair placed on opposite rear corners: retain the district's barjeel identity.
  barjeel(k, g, -0.43, 0.72, -0.39, 0.29, 0.68, "#dfc29b");
  barjeel(k, g, 0.39, 0.58, -0.43, 0.28, 0.61, "#dfc29b");
  // One readable roof-access stair replaces the previous scattering of tiny huts.
  for (let i = 0; i < 4; i++) {
    const h = 0.09 * (i + 1);
    k.box(g, 0.19, h, 0.12, "#e6cba7", 0.65, h / 2, 0.5 - i * 0.12);
  }
};
