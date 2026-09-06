import type { Factory } from "../../kit";
import * as T from "three";

export const syHarbourbridgeFactory: Factory = (k, g) => {
  const steel = "#53696c",
    stone = "#b9b09b",
    trim = "#d4cbb7";
  k.box(g, 1.5, 0.035, 1.05, "#8daeb2", 0, 0.018);
  k.box(g, 1.55, 0.06, 0.5, "#596465", 0, 0.4).name = "deck";
  // Grouped roadway and rail corridor; the long axis is X.
  k.box(g, 1.54, 0.008, 0.1, "#7b827c", 0, 0.434, -0.15);
  for (const z of [-0.18, -0.12])
    k.box(g, 1.54, 0.009, 0.012, trim, 0, 0.442, z);
  for (let i = -5; i <= 5; i++)
    k.box(g, 0.065, 0.006, 0.012, trim, i * 0.13, 0.435, 0.045);
  for (const z of [-0.255, 0.255]) {
    k.box(g, 1.55, 0.028, 0.035, trim, 0, 0.439, z);
    k.box(g, 1.55, 0.018, 0.018, steel, 0, 0.492, z);
    for (let i = -6; i <= 6; i++)
      k.box(g, 0.013, 0.05, 0.013, steel, i * 0.12, 0.467, z);
  }
  const span = 0.61,
    panels = 12,
    halfWidth = 0.22;
  const xAt = (i: number) => -span + (i * 2 * span) / panels;
  const lower = (x: number) => 0.13 + 0.8 * (1 - (x / span) ** 2);
  const upper = (x: number) => 0.46 + 0.62 * (1 - (x / span) ** 2);
  // Independent upper/lower chords meet bearings below the road at each end.
  for (const z of [-halfWidth, halfWidth]) {
    for (let i = 0; i < panels; i++) {
      const x = xAt(i),
        n = xAt(i + 1);
      k.beam(g, [x, lower(x), z], [n, lower(n), z], 0.035, steel).name =
        "lower-chord";
      k.beam(g, [x, upper(x), z], [n, upper(n), z], 0.031, steel).name =
        "upper-chord";
      const a = i < panels / 2 ? x : n,
        b = i < panels / 2 ? n : x;
      k.beam(g, [a, upper(a), z], [b, lower(b), z], 0.02, steel);
    }
    for (let i = 0; i <= panels; i++) {
      const x = xAt(i),
        y = lower(x);
      k.beam(g, [x, y, z], [x, upper(x), z], 0.018, steel);
      if (y > 0.43)
        k.beam(g, [x, 0.43, z], [x, y, z], 0.014, "#728383").name = "hanger";
    }
  }
  // Top lateral bracing makes the paired trusses read as one spatial structure.
  for (let i = 0; i <= panels; i += 2) {
    const x = xAt(i);
    k.beam(
      g,
      [x, upper(x), -halfWidth],
      [x, upper(x), halfWidth],
      0.022,
      steel,
    ).name = "cross-tie";
    if (i === panels) continue;
    const n = xAt(i + 2);
    for (const z of [-halfWidth, halfWidth])
      k.beam(g, [x, upper(x), z], [n, upper(n), -z], 0.014, steel);
  }
  // Four granite-faced pylons: battered shafts, restrained cornices and niches.
  const niche = k.geometry("sy-harbourbridge:niche", () => {
    const s = new T.Shape();
    s.moveTo(-0.032, 0);
    s.lineTo(0.032, 0);
    s.lineTo(0.032, 0.09);
    s.quadraticCurveTo(0.032, 0.13, 0, 0.13);
    s.quadraticCurveTo(-0.032, 0.13, -0.032, 0.09);
    s.closePath();
    return new T.ShapeGeometry(s, 6);
  });
  for (const x of [-0.66, 0.66])
    for (const z of [-0.35, 0.35]) {
      k.box(g, 0.235, 0.085, 0.245, trim, x, 0.0775, z);
      const shaft = k.cylinder(g, 0.15, 0.58, stone, x, 0.41, z, 0.125, 4);
      shaft.rotation.y = Math.PI / 4;
      shaft.name = "pylon";
      k.box(g, 0.195, 0.035, 0.195, trim, x, 0.69, z);
      k.box(g, 0.17, 0.055, 0.17, stone, x, 0.735, z);
      k.box(g, 0.135, 0.012, 0.135, "#777d76", x, 0.768, z);
      for (const side of [-1, 1]) {
        const face = k.mesh(g, niche, "#596564", x, 0.44, z + side * 0.102);
        face.rotation.y = side === 1 ? 0 : Math.PI;
        k.box(g, 0.084, 0.024, 0.017, trim, x, 0.431, z + side * 0.104);
        k.box(g, 0.026, 0.012, 0.008, "#777d76", x, 0.732, z + side * 0.087);
      }
    }
};
