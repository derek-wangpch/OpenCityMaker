import type { Factory } from "../../kit";

export const szBambooFactory: Factory = (k, g) => {
  // China Resources Tower is a bullet, not a cone: the shaft swells from a
  // branching entry ribs to full shoulders about a third of the way up, then the
  // ribs close over the crown in one long convex sweep to a rounded point.
  const total = 2.34,
    R = 0.3, // shoulder radius, the widest the shaft ever gets
    swell = 0.34, // height fraction where the belly sits
    zs = 1, // radial symmetry of the built tower
    // Steel-blue glass under silver mullions: the shoot is the one tower in
    // the pack whose curtain wall reads blue, so it keeps its own tone.
    SHELL = "#6f96ac",
    RIB = "#e3e1d4";
  const at = (t: number) =>
    t <= swell
      ? R * (0.76 + 0.24 * Math.sin((t / swell) * Math.PI * 0.5))
      : Math.max(
          0.018,
          R * Math.cos(((t - swell) / (1 - swell)) * Math.PI * 0.5) ** 0.82,
        );
  const n = 24;
  for (let i = 0; i < n; i++) {
    const t = i / n,
      t2 = (i + 1) / n;
    const shell = k.cylinder(
      g,
      at(t),
      total / n,
      SHELL,
      0,
      (i + 0.5) * (total / n),
      0,
      at(t2),
      20,
    );
    shell.scale.z = zs;
  }
  // Silver mullions tracking the profile; they converge on their own as the
  // shoulders fall away. The real facade braces into diamonds near the top.
  const ribs = 20,
    steps = n;
  for (let j = 0; j < ribs; j++) {
    const a = (j * Math.PI * 2) / ribs;
    for (let i = 0; i < steps; i++) {
      const t = i / steps,
        t2 = (i + 1) / steps;
      const p1 = [
        Math.cos(a) * (at(t) + 0.008),
        t * total,
        Math.sin(a) * (at(t) + 0.008) * zs,
      ];
      const p2 = [
        Math.cos(a) * (at(t2) + 0.008),
        t2 * total,
        Math.sin(a) * (at(t2) + 0.008) * zs,
      ];
      k.beam(g, p1, p2, 0.011, RIB);
      if ((i >= 18 || i < 3) && j % 2 === 0) {
        const a2 = ((j + 1) % ribs) * ((Math.PI * 2) / ribs);
        k.beam(
          g,
          p1,
          [
            Math.cos(a2) * (at(t2) + 0.008),
            t2 * total,
            Math.sin(a2) * (at(t2) + 0.008) * zs,
          ],
          0.01,
          RIB,
        );
      }
    }
  }
  // The branching entrance columns are exaggerated around a low round plinth.
  const plinth = k.cylinder(g, 0.4, 0.05, "#cfc9b8", 0, 0.025, 0, 0.4, 28);
  plinth.scale.z = zs;
  for (let j = 0; j < 12; j++) {
    const a = (j * Math.PI * 2) / 12 + 0.13;
    k.beam(
      g,
      [Math.cos(a) * 0.15, 0.3, Math.sin(a) * 0.15 * zs],
      [Math.cos(a) * 0.38, 0.045, Math.sin(a) * 0.38 * zs],
      0.026,
      "#f2efe4",
    );
  }
  k.cylinder(g, 0.018, 0.04, RIB, 0, total + 0.02, 0, 0.002, 12);
};
