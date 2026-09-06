import * as T from "three";
import type { Factory, ModelKit } from "../../kit";
import { TRIM } from "./shared";

/**
 * Shenzhen Civic Center — the 486 m × 154 m "roc's wing" (大鹏展翅) roof over
 * three low blocks, pierced beside the ceremonial axis by the gold round tower
 * (west, 12 floors, 天圆) and the red square tower (east, 15 floors, 地方) in
 * the flag's colours.
 *
 * The roof is a shallow WAVE, not a tent: a broad crown at the centre, an
 * S-curve down to a low shoulder about 70 % out where it nearly grazes the wing
 * roofs, then a rise into upturned wingtips. Real length/height is 5.7:1, which
 * would be unreadable on the board, so the model is exaggerated to ~1.9:1 while
 * the internal height ratios measured off the south elevation are preserved
 * (crown 0.79 of the tower top, shoulder 0.28, wingtip 0.45, podium 0.14).
 * See docs/references/sz-civic.md.
 *
 * Axes: +x east, +z south (the plaza side), so the gold drum sits left and the
 * red tower right in the front view, as in the photographs from the plaza.
 */

const L = 0.75; // half-length; the 486 m roof spans 1.50 of the plot

/**
 * Roof stations, sampled on u = |x| / L.
 *  hc   centreline top height
 *  lift parabolic offset applied to the eaves: negative near the crown barrels
 *       the roof up along its spine, positive out at the tips curls the north
 *       and south eaves upward — the anticlastic twist that reads as a wing
 *  d    half-depth (roof plan tapers and rounds toward the tips)
 *  th   slab thickness (the deep midspan truss thins toward the tips)
 */
const PROF: [number, number, number, number, number][] = [
  [0.0, 0.656, -0.012, 0.27, 0.095],
  [0.12, 0.637, -0.009, 0.273, 0.092],
  [0.24, 0.594, -0.003, 0.275, 0.086],
  [0.36, 0.522, 0.004, 0.272, 0.078],
  [0.48, 0.453, 0.007, 0.264, 0.07],
  [0.6, 0.402, 0.01, 0.252, 0.063],
  [0.7, 0.361, 0.013, 0.238, 0.057],
  [0.8, 0.352, 0.017, 0.221, 0.052],
  [0.9, 0.38, 0.021, 0.198, 0.047],
  [0.96, 0.402, 0.024, 0.176, 0.044],
  [1.0, 0.426, 0.026, 0.135, 0.041],
];

/** Linear interpolation of the station table at |u|. */
function sample(u: number) {
  const a = Math.min(Math.abs(u), 1);
  let i = 0;
  while (i < PROF.length - 2 && PROF[i + 1][0] < a) i++;
  const p = PROF[i],
    q = PROF[i + 1];
  const t = (a - p[0]) / (q[0] - p[0]);
  const mix = (n: number) => p[n] + (q[n] - p[n]) * t;
  return { hc: mix(1), lift: mix(2), d: mix(3), th: mix(4) };
}

/** Top surface of the roof shell. u along the length, w across the depth. */
const surf = (u: number, w: number) => {
  const s = sample(u);
  return { y: s.hc + s.lift * w * w, z: w * s.d, th: s.th };
};

const NX = 16; // stations along the length
const WS = [-1, -0.55, 0, 0.55, 1]; // samples across the depth

/**
 * Prism with a slanted top: the top height ramps linearly across the local x
 * span. Both civic towers are sliced this way, dropping toward the ceremonial
 * axis so their outer edges stand highest.
 */
function slantPrism(
  k: ModelKit,
  g: T.Group,
  ring: [number, number][], // local x,z outline, ordered so side faces point out
  cx: number,
  cz: number,
  half: number, // half of the local x span the ramp is measured over
  yBase: number,
  yAtMinusX: number,
  yAtPlusX: number,
  color: string,
) {
  const topY = (lx: number) =>
    yAtMinusX + ((lx + half) / (2 * half)) * (yAtPlusX - yAtMinusX);
  const pos: number[] = [];
  const tri = (a: number[], b: number[], c: number[]) =>
    pos.push(...a, ...b, ...c);
  const lo = ring.map(([x, z]) => [cx + x, yBase, cz + z]);
  const hi = ring.map(([x, z]) => [cx + x, topY(x), cz + z]);
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    tri(lo[i], lo[j], hi[j]);
    tri(lo[i], hi[j], hi[i]);
  }
  for (let i = 1; i < ring.length - 1; i++) {
    tri(hi[0], hi[i], hi[i + 1]); // slanted cap
    tri(lo[0], lo[i + 1], lo[i]); // base
  }
  const geo = new T.BufferGeometry();
  geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  return k.mesh(g, geo, color);
}

export const szCivicFactory: Factory = (k, g) => {
  const RED = "#c8402f",
    GOLD = "#dfa62c",
    BLUE = "#3d8ec7", // the blue top field of the roof
    EDGE = "#8e99a2", // silver-grey fascia band and soffit
    STONE = "#dcd6c6",
    TEAL = "#5f8f8a"; // the green-tinted glass podium

  // Stone plaza plinth under the whole complex.
  k.box(g, 1.54, 0.025, 0.54, "#bcb5a4", 0, 0.0125);

  // Continuous glass podium running the full length, two-and-a-bit storeys.
  k.box(g, 1.42, 0.12, 0.44, TEAL, 0, 0.073);
  k.box(g, 1.44, 0.013, 0.46, TRIM, 0, 0.139);

  // West and east wing bars sitting on the podium, ribbon-glazed. The roof
  // sinks until it nearly grazes these at the shoulders, as it does in the
  // south elevation.
  for (const s of [-1, 1]) {
    k.box(g, 0.46, 0.021, 0.38, STONE, s * 0.49, 0.156);
    k.box(g, 0.462, 0.019, 0.382, "#7f9aa5", s * 0.49, 0.176);
    k.box(g, 0.45, 0.024, 0.37, STONE, s * 0.49, 0.198);
  }

  // Two splayed walls funnelling out to the south plaza stair on the axis.
  for (const s of [-1, 1]) {
    const w = k.box(g, 0.009, 0.1, 0.21, TEAL, s * 0.12, 0.15, 0.15);
    w.rotation.y = s * 0.42;
  }
  // The ceremonial stair itself, running south between them to the plaza.
  k.box(g, 0.095, 0.014, 0.2, TRIM, 0, 0.152, 0.12);

  // Gold round tower (west, exhibition hall) and red square tower (east,
  // auditorium + archives): 天圆地方 in the flag's colours. Both are cut on a
  // slant that falls toward the central axis, and both pierce the roof.
  const RT = 0.072;
  const drum: [number, number][] = [];
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    drum.push([RT * Math.cos(a), -RT * Math.sin(a)]); // clockwise from above -> outward faces
  }
  slantPrism(k, g, drum, -0.175, -0.005, RT, 0.145, 0.74, 0.638, GOLD);

  const RW = 0.072,
    RD = 0.085;
  const sq: [number, number][] = [
    [-RW, -RD],
    [-RW, RD],
    [RW, RD],
    [RW, -RD],
  ];
  slantPrism(k, g, sq, 0.175, -0.005, RW, 0.145, 0.675, 0.78, RED);

  // Roof shell: one closed grey solid swept through the sampled sections. The
  // blue field is laid over it inset from the eaves, leaving the silver fascia
  // band that rings the real roof.
  const P: number[][][] = [], // top surface grid
    B: number[][][] = []; // soffit grid
  for (let i = 0; i <= NX; i++) {
    const u = -1 + (2 * i) / NX;
    const rowP: number[][] = [],
      rowB: number[][] = [];
    for (const w of WS) {
      const { y, z, th } = surf(u, w);
      rowP.push([u * L, y, z]);
      rowB.push([u * L, y - th, z]);
    }
    P.push(rowP);
    B.push(rowB);
  }

  const pos: number[] = [];
  const quad = (a: number[], b: number[], c: number[], e: number[]) =>
    pos.push(...a, ...b, ...c, ...a, ...c, ...e);
  for (let i = 0; i < NX; i++) {
    for (let j = 0; j < WS.length - 1; j++) {
      quad(P[i][j], P[i][j + 1], P[i + 1][j + 1], P[i + 1][j]); // top (+y)
      quad(B[i][j], B[i + 1][j], B[i + 1][j + 1], B[i][j + 1]); // soffit (-y)
    }
    const e = WS.length - 1;
    quad(B[i][e], B[i + 1][e], P[i + 1][e], P[i][e]); // south fascia (+z)
    quad(B[i + 1][0], B[i][0], P[i][0], P[i + 1][0]); // north fascia (-z)
  }
  for (let j = 0; j < WS.length - 1; j++) {
    quad(B[NX][j], P[NX][j], P[NX][j + 1], B[NX][j + 1]); // east tip cap (+x)
    quad(B[0][j + 1], P[0][j + 1], P[0][j], B[0][j]); // west tip cap (-x)
  }
  const shell = new T.BufferGeometry();
  shell.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  shell.computeVertexNormals();
  k.mesh(g, shell, EDGE);

  /** A strip of the top surface, inset and floated clear of the grey shell. */
  const topStrip = (
    uA: number,
    uB: number,
    wSpan: number,
    dy: number,
    color: string,
    steps = NX,
  ) => {
    const p: number[] = [];
    const at = (u: number, w: number) => {
      const { y, z } = surf(u, w);
      return [u * L, y + dy, z];
    };
    for (let i = 0; i < steps; i++) {
      const u0 = uA + ((uB - uA) * i) / steps,
        u1 = uA + ((uB - uA) * (i + 1)) / steps;
      for (let j = 0; j < WS.length - 1; j++) {
        const w0 = WS[j] * wSpan,
          w1 = WS[j + 1] * wSpan;
        p.push(
          ...at(u0, w0),
          ...at(u0, w1),
          ...at(u1, w1),
          ...at(u0, w0),
          ...at(u1, w1),
          ...at(u1, w0),
        );
      }
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geo.computeVertexNormals();
    k.mesh(g, geo, color);
  };
  topStrip(-0.955, 0.955, 0.82, 0.006, BLUE);
  // The pale spine strip that crosses the crown on the ceremonial axis.
  topStrip(-0.028, 0.028, 1.0, 0.012, TRIM, 1);

  // White fan struts carrying the roof out over the wings — tall inboard, and
  // shortening as the roof settles toward the low shoulders.
  for (const sx of [-1, 1])
    for (const u of [0.4, 0.53, 0.66, 0.9])
      for (const sz of [-1, 1]) {
        const w = sz * 0.78;
        const foot = surf(sx * u, w);
        for (const d of [-0.05, 0.05]) {
          const cap = surf(sx * u + d, w);
          k.beam(
            g,
            [sx * u * L, 0.21, foot.z],
            [(sx * u + d) * L, cap.y - cap.th, cap.z],
            0.01,
            STONE,
          );
        }
      }
};
