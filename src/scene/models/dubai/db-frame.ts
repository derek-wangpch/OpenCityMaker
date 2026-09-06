import * as T from "three";
import type { Factory } from "../../kit";

/** Tier 8: a complete gold frame with patterned glazing and a thin skybridge. */
export const dbFrameFactory: Factory = (k, g) => {
  const gold = "#c7a250",
    edge = "#e6ca82",
    glass = "#738f99";
  const motif = k.geometry(
    "db-frame:circle",
    () => new T.TorusGeometry(0.055, 0.009, 4, 12),
  );
  for (const x of [-0.54, 0.54]) {
    k.box(g, 0.2, 1.95, 0.24, gold, x, 1.055);
    for (const z of [-0.126, 0.126]) {
      k.box(g, 0.135, 1.84, 0.012, glass, x, 1.06, z);
      for (let j = 0; j < 14; j++) {
        const circle = k.mesh(
          g,
          motif,
          edge,
          x + (j % 2 ? 0.023 : -0.023),
          0.2 + j * 0.13,
          z + Math.sign(z) * 0.009,
        );
        circle.scale.set(j % 3 === 0 ? 0.72 : 1, 1, 1);
      }
    }
    // Narrow lift glazing on the deep sides, inside continuous gold borders.
    for (const side of [-1, 1])
      k.box(g, 0.012, 1.76, 0.08, glass, x + side * 0.105, 1.06);
  }
  k.box(g, 1.28, 0.18, 0.24, gold, 0, 1.95);
  k.box(g, 0.88, 0.025, 0.16, "#acc6c4", 0, 1.85);
  // Low glazed gallery completes the fourth side without filling the opening.
  k.box(g, 1.28, 0.15, 0.31, gold, 0, 0.115);
  for (const z of [-0.163, 0.163]) {
    k.box(g, 0.91, 0.075, 0.012, glass, 0, 0.12, z);
    for (let j = -3; j <= 3; j++) {
      k.mesh(g, motif, edge, j * 0.125, 1.95, z * 0.8);
      const m = k.mesh(
        g,
        motif,
        edge,
        j * 0.125,
        0.12,
        z + Math.sign(z) * 0.008,
      );
      m.scale.setScalar(0.62);
    }
  }
  k.box(g, 1.44, 0.04, 0.59, "#cebd98", 0, 0.02);
};
