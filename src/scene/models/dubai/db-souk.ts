import type { Factory } from "../../kit";
/** Tier 3: six shops and three clear timber trusses over an open lane. */
export const dbSoukFactory: Factory = (k, g) => {
  for (const x of [-0.4, 0.4])
    for (const z of [-0.35, 0, 0.35]) {
      k.box(g, 0.37, 0.42, 0.3, "#b7956e", x, 0.21, z);
      k.box(
        g,
        0.018,
        0.26,
        0.19,
        "#715b44",
        x + (x > 0 ? -0.19 : 0.19),
        0.15,
        z,
      );
    }
  for (const z of [-0.43, 0, 0.43]) {
    for (const x of [-0.24, 0.24]) {
      k.box(g, 0.04, 0.58, 0.045, "#94704b", x, 0.29, z);
      k.beam(g, [x, 0.58, z], [0, 0.7, z], 0.035, "#94704b");
    }
    k.box(g, 0.54, 0.035, 0.045, "#94704b", 0, 0.53, z);
  }
  // Sparse shade slats suggest the mat canopy without hiding the lane.
  for (let i = -3; i <= 3; i++)
    k.box(g, 0.56, 0.024, 0.06, "#b69b70", 0, 0.59, i * 0.14);
  for (const [x, z, color] of [
    [-0.2, -0.33, "#9a6c55"],
    [0.2, 0.32, "#748f90"],
  ] as const)
    k.box(g, 0.022, 0.16, 0.12, color, x, 0.22, z);
};
