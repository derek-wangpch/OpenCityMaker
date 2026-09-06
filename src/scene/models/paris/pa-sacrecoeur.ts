import type { Factory, ModelKit } from "../../kit";
import { arch, dome } from "../../architecture";
import type { Group } from "three";

const stone = "#eee8d6";
const stoneLight = "#f6f1e3";
const shade = "#c4bda8";
const glass = "#66767a";

/** Elongated ovoid cupola on a short drum, with a miniature lantern. */
function cupola(
  k: ModelKit,
  g: Group,
  r: number,
  drumH: number,
  domeH: number,
  x: number,
  y: number,
  z: number,
) {
  k.cylinder(g, r * 0.76, drumH, stone, x, y + drumH / 2, z, r * 0.76, 16);
  k.cylinder(g, r * 0.82, 0.025, stoneLight, x, y + drumH, z);
  dome(k, g, r, domeH, stoneLight, x, y + drumH, z);
  const ly = y + drumH + domeH;
  k.cylinder(g, r * 0.15, r * 0.2, stone, x, ly + r * 0.1, z, r * 0.15, 10);
  dome(k, g, r * 0.17, r * 0.2, stoneLight, x, ly + r * 0.18, z);
  k.cylinder(g, 0.01, r * 0.18, shade, x, ly + r * 0.44, z);
}

export const paSacrecoeurFactory: Factory = (k, g) => {
  // +z = south porch facing Paris. Real plan is 85 × 35 m; N–S is
  // compressed to the plot, but the south front stays the full width.
  const bodyH = 0.48;
  const crossZ = -0.02;
  const campZ = -0.6;
  const halfW = 0.46;

  // Monumental stair — a short hint of the Louise-Michel cascade.
  for (let i = 0; i < 4; i++)
    k.box(
      g,
      0.88 - i * 0.05,
      0.04,
      0.14,
      stoneLight,
      0,
      0.02 + i * 0.04,
      0.62 - i * 0.07,
    );

  // Greek-cross body no wider than the south towers.
  k.box(g, 0.58, bodyH, 0.56, stone, 0, bodyH / 2, crossZ);
  k.box(g, 0.52, bodyH, 0.28, stone, 0, bodyH / 2, 0.26);
  k.box(g, 0.46, bodyH, 0.26, stone, 0, bodyH / 2, -0.34);
  k.box(g, 0.62, 0.028, 0.6, stoneLight, 0, bodyH + 0.01, crossZ);

  // Rounded choir and transept apses — they stay inside the front width.
  k.cylinder(g, 0.2, bodyH, stone, 0, bodyH / 2, -0.46, 0.2, 14);
  for (const x of [-halfW + 0.16, halfW - 0.16]) {
    k.box(g, 0.22, bodyH, 0.36, stone, x, bodyH / 2, crossZ);
    k.cylinder(
      g,
      0.17,
      bodyH,
      stone,
      x + Math.sign(x) * 0.06,
      bodyH / 2,
      crossZ,
    );
  }

  // Triple round-arched porch modelled on Périgueux.
  const porchZ = 0.44;
  k.box(g, 0.62, 0.4, 0.15, stone, 0, 0.2, porchZ);
  k.box(g, 0.66, 0.03, 0.18, stoneLight, 0, 0.41, porchZ + 0.01);
  for (const x of [-0.2, 0, 0.2]) {
    arch(k, g, 0.18, 0.28, 0.045, stoneLight, x, 0.035, porchZ + 0.065);
    k.box(g, 0.11, 0.18, 0.02, shade, x, 0.15, porchZ + 0.055);
  }
  // Two lights in the south nave wall above the porch terrace.
  for (const x of [-0.1, 0.1])
    k.box(g, 0.05, 0.09, 0.016, glass, x, 0.58, 0.41);

  // South facade towers carry the two front cupolas of the quincunx.
  for (const x of [-0.32, 0.32]) {
    k.box(g, 0.26, 0.78, 0.24, stone, x, 0.39, 0.26);
    k.box(g, 0.3, 0.03, 0.28, stoneLight, x, 0.79, 0.26);
    cupola(k, g, 0.135, 0.09, 0.2, x, 0.8, 0.26);
    k.box(g, 0.05, 0.1, 0.02, glass, x, 0.56, 0.39);
  }

  // North pair of the four smaller cupolas, at the crossing corners.
  for (const x of [-0.24, 0.24])
    cupola(k, g, 0.115, 0.09, 0.17, x, bodyH, -0.26);

  // Central elongated ovoid cupola — drum colonnade, then the ovoid itself.
  const drumH = 0.34;
  const drumR = 0.185;
  k.cylinder(g, drumR, drumH, stone, 0, bodyH + drumH / 2, crossZ, drumR, 18);
  k.cylinder(g, drumR + 0.02, 0.03, stoneLight, 0, bodyH + drumH, crossZ);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const pane = k.box(
      g,
      0.038,
      0.13,
      0.014,
      glass,
      Math.sin(a) * (drumR + 0.006),
      bodyH + drumH * 0.52,
      crossZ + Math.cos(a) * (drumR + 0.006),
    );
    pane.rotation.y = a;
  }
  cupola(k, g, 0.25, 0.02, 0.66, 0, bodyH + drumH, crossZ);

  // Square north campanile (Savoyarde): a fat staged shaft, not a needle.
  // Kept level with the central lantern so it hides on a true south elevation.
  k.box(g, 0.32, 1.12, 0.32, stone, 0, 0.56, campZ);
  k.box(g, 0.36, 0.035, 0.36, stoneLight, 0, 0.42, campZ);
  k.box(g, 0.36, 0.035, 0.36, stoneLight, 0, 0.86, campZ);
  k.box(g, 0.36, 0.04, 0.36, stoneLight, 0, 1.14, campZ);
  k.box(g, 0.26, 0.24, 0.26, stone, 0, 1.28, campZ);
  for (const [dx, dz] of [
    [0, 0.14],
    [0, -0.14],
    [0.14, 0],
    [-0.14, 0],
  ] as const)
    k.box(
      g,
      dx ? 0.016 : 0.09,
      0.13,
      dz ? 0.016 : 0.09,
      shade,
      dx,
      1.28,
      campZ + dz,
    );
  k.box(g, 0.3, 0.03, 0.3, stoneLight, 0, 1.41, campZ);
  cupola(k, g, 0.115, 0.07, 0.14, 0, 1.42, campZ);
};
