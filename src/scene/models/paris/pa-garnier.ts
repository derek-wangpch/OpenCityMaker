import type { Factory } from "../../kit";
import { arch, dome, gable } from "../../architecture";

/** Tier 5: arcade, paired columns and a layered roof silhouette, no fine relief. */
export const paGarnierFactory: Factory = (k, g) => {
  const STONE = "#d3c1a2",
    LIGHT = "#ebd7b3",
    SHADOW = "#596966";
  const COPPER = "#779b88",
    GOLD = "#d0aa52",
    BRONZE = "#587b70";

  k.box(g, 1.4, 0.04, 1.4, LIGHT, 0, 0.02);
  k.box(g, 1.22, 0.56, 1.16, STONE, 0, 0.32, -0.035);
  for (const y of [0.29, 0.61]) k.box(g, 1.26, 0.035, 1.2, LIGHT, 0, y, -0.035);

  // Taller stage house behind the round auditorium roof; the ridge runs in z.
  k.box(g, 0.88, 0.33, 0.46, STONE, 0, 0.765, -0.4);
  k.box(g, 0.94, 0.035, 0.51, LIGHT, 0, 0.93, -0.4);
  gable(k, g, 0.94, 0.51, 0.23, COPPER, 0, 0.95, -0.4);
  for (const side of [-1, 1]) {
    k.beam(g, [side * 0.47, 0.95, -0.138], [0, 1.18, -0.138], 0.022, LIGHT);
    for (const z of [-0.54, -0.38, -0.22])
      k.box(g, 0.012, 0.1, 0.052, SHADOW, side * 0.446, 0.79, z);
  }
  k.cylinder(g, 0.335, 0.08, STONE, 0, 0.67, 0.075);
  dome(k, g, 0.35, 0.23, COPPER, 0, 0.71, 0.075);
  k.cylinder(g, 0.055, 0.04, BRONZE, 0, 0.953, 0.075);

  // Side rotundas are intentionally simplified, with only three visible bays.
  for (const side of [-1, 1]) {
    const x = side * 0.61;
    k.cylinder(g, 0.16, 0.53, STONE, x, 0.305, -0.045, 0.16, 16);
    k.cylinder(g, 0.177, 0.035, LIGHT, x, 0.57, -0.045, 0.177, 16);
    dome(k, g, 0.174, 0.14, COPPER, x, 0.59, -0.045);
    for (const a of [-0.85, 0, 0.85]) {
      const px = x + side * Math.cos(a) * 0.163;
      const pz = -0.045 + Math.sin(a) * 0.163;
      const pane = k.box(g, 0.055, 0.18, 0.014, SHADOW, px, 0.34, pz);
      pane.rotation.y = (side * Math.PI) / 2 - a;
    }
    for (const z of [-0.48, -0.3, 0.23, 0.4])
      for (const y of [0.17, 0.45])
        k.box(g, 0.012, 0.12, 0.065, SHADOW, side * 0.618, y, z);
  }

  // Ground arcade in front of a recessed dark wall; arches remain open shapes.
  k.box(g, 1.3, 0.045, 0.34, LIGHT, 0, 0.045, 0.51);
  k.box(g, 1.1, 0.26, 0.015, SHADOW, 0, 0.195, 0.55);
  for (let i = -3; i <= 3; i++)
    arch(k, g, 0.145, 0.265, 0.08, LIGHT, i * 0.16, 0.065, 0.606);
  k.box(g, 1.33, 0.045, 0.26, LIGHT, 0, 0.35, 0.52);
  k.box(g, 1.27, 0.32, 0.2, STONE, 0, 0.53, 0.51);
  for (const x of [-0.4, -0.2, 0, 0.2, 0.4])
    k.box(g, 0.13, 0.235, 0.018, SHADOW, x, 0.515, 0.618);
  for (const x of [-0.5, -0.3, -0.1, 0.1, 0.3, 0.5])
    for (const offset of [-0.024, 0.024]) {
      k.cylinder(g, 0.018, 0.25, LIGHT, x + offset, 0.515, 0.651, 0.018, 8);
      k.box(g, 0.045, 0.025, 0.045, LIGHT, x + offset, 0.647, 0.651);
    }
  k.box(g, 1.36, 0.035, 0.28, LIGHT, 0, 0.69, 0.52);
  k.box(g, 1.28, 0.095, 0.22, STONE, 0, 0.75, 0.52);
  k.box(g, 1.38, 0.027, 0.29, LIGHT, 0, 0.808, 0.52);
  for (const x of [-0.36, -0.18, 0, 0.18, 0.36])
    k.sphere(g, 0.022, GOLD, x, 0.754, 0.638);

  // Winged gilded groups are toy silhouettes, separate from rear Apollo.
  for (const x of [-0.565, 0.565]) {
    k.box(g, 0.16, 0.07, 0.17, LIGHT, x, 0.845, 0.51);
    k.cylinder(g, 0.035, 0.09, GOLD, x, 0.915, 0.51, 0.021, 8);
    k.sphere(g, 0.026, GOLD, x, 0.983, 0.51);
    for (const side of [-1, 1]) {
      const wing = k.box(
        g,
        0.032,
        0.13,
        0.035,
        GOLD,
        x + side * 0.048,
        0.953,
        0.505,
      );
      wing.rotation.z = -side * 0.55;
    }
  }
  k.cylinder(g, 0.025, 0.09, BRONZE, 0, 1.216, -0.14, 0.016, 8);
  k.sphere(g, 0.02, BRONZE, 0, 1.279, -0.14);
  k.beam(g, [-0.06, 1.23, -0.14], [0, 1.265, -0.14], 0.022, BRONZE);
  k.beam(g, [0, 1.265, -0.14], [0.055, 1.31, -0.14], 0.022, BRONZE);

  for (const x of [-0.43, -0.22, 0, 0.22, 0.43])
    for (const y of [0.18, 0.45])
      k.box(g, 0.065, 0.12, 0.012, SHADOW, x, y, -0.621);
};
