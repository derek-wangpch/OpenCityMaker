import * as T from "three";
import type { Factory, ModelKit } from "../../kit";

// 中信大厦 / China Zun — CITIC Tower (KPF + Arup, Beijing CBD, 2018, 528 m).
//
// The massing abstracts the bronze ritual vessel 尊: widest at a flared foot,
// sweeping inward through a concave waist at ≈73 % of the height (54 m of the
// 78 m base), then flaring convexly back out to the 69 m crown, whose parapet
// folds into a saddle — corners lift, the middle of each face dips. The plan
// is a square with rounded corners, the facade reads as dense vertical
// fluting, and dark louvered mechanical bands puncture the shaft at regular
// intervals (eight transfer-truss levels in reality). Reference record:
// docs/references/bj-zun.md.
//
// One profile function, halfWidth(t), generates shell, flutes, bands and lip,
// so every part hugs the same curved surface. The factory this replaces
// stacked shrinking boxes, which faked the smooth wall with false ledges.

const H = 2.4; // parapet base; the saddle lip rises a little higher
const WAIST_T = 0.73; // narrowest point, 385 m of 528 m
const WAIST_W = 0.692; // waist, 54 m of the 78 m base
const TOP_W = 0.885; // crown, 69 m of the 78 m base
const HW_BASE = 0.265; // grade half-width — chunked from the true ~0.18 to sit
// alongside the 国贸三期 taper in the same pack; waist/top ratios held exact.
const FOOT_T = 0.055; // trumpet foot: extra flare over the bottom 5.5 %
const FOOT_FLARE = 0.05;

const CROWN_T = 0.905; // crown zone, above the last louver row
const LIP_H = 0.075; // parapet rise at the corners
const LIP_DIP = 0.028; // how far face centres saddle below the corners
const LIP_OUT = 0.013; // outward curl of the lip
const LIP_THICK = 0.011; // parapet wall thickness

const GLASS = "#7ea9a3"; // pale silver-green vision glass, greener than 国贸's blue
const FIN = "#cfdcd6"; // bright silvery vertical fluting
const MECH = "#5a737b"; // louvered mechanical bands, flush with the glass
const CROWN_FIN = "#e3dcc8"; // warmer, denser aluminium ribs of the 内尊 crown
const DECK = "#5b6d70"; // sunken roof deck behind the parapet
const STONE = "#c3bca6"; // plaza paving at the foot

const RING = 32; // rounded-square resolution: 8 segments per quadrant
const SUPER = 0.5; // superellipse |cos|^(2/4): a square with rounded corners

/** One point of the rounded-square plan at half-width hw. */
const point = (theta: number, hw: number): [number, number] => [
  hw * Math.sign(Math.cos(theta)) * Math.abs(Math.cos(theta)) ** SUPER,
  hw * Math.sign(Math.sin(theta)) * Math.abs(Math.sin(theta)) ** SUPER,
];

/** Half-width of the tower at fraction-of-height t. Below the waist (t=0.73)
 * a gently concave near-linear sweep — the photos hold ~0.93 of base width at
 * 20 % height and ease into the 54 m waist; above it a moderately convex flare
 * back out to the crown. The trumpet foot is a local term at the bottom. */
const halfWidth = (t: number) => {
  const w =
    t <= WAIST_T
      ? WAIST_W + (1 - WAIST_W) * (1 - t / WAIST_T) ** 0.75
      : WAIST_W + (TOP_W - WAIST_W) * ((t - WAIST_T) / (1 - WAIST_T)) ** 1.15;
  const foot = t < FOOT_T ? FOOT_FLARE * (1 - t / FOOT_T) ** 2 : 0;
  return HW_BASE * (w + foot);
};

/** A point on the facade skin: ring position at height t, pushed out by `out`
 * along the radial. Flutes and ribs sample this, so they stay on the glass. */
const skin = (theta: number, t: number, out: number): number[] => {
  // Interpolate the actual polygon, rather than an unrelated smooth section.
  const u = (theta / (2 * Math.PI)) * RING;
  const i = Math.floor(u),
    f = u - i;
  const a = point((i * 2 * Math.PI) / RING, halfWidth(t));
  const b = point(((i + 1) * 2 * Math.PI) / RING, halfWidth(t));
  const [x, z] = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const r = Math.hypot(x, z) || 1;
  return [x + (x / r) * out, t * H, z + (z / r) * out];
};

const ringAt = (y: number, scale = 1) =>
  Array.from({ length: RING }, (_, i) => {
    const [x, z] = point((i * 2 * Math.PI) / RING, halfWidth(y / H) * scale);
    return [x, y, z];
  });

/** Connect cross-section rings into one closed surface — the smooth way to
 * model a curved facade; stacking boxes would put ledges on the waist. */
function loft(
  k: ModelKit,
  g: T.Group,
  key: string,
  ys: number[],
  color: string,
  scale = 1,
) {
  const geo = k.geometry(key, () => {
    const p: number[] = [];
    const rings = ys.map((y) => ringAt(y, scale));
    for (let n = 0; n < rings.length - 1; n++) {
      const a = rings[n],
        b = rings[n + 1];
      for (let i = 0; i < RING; i++) {
        const j = (i + 1) % RING;
        // Wound so the normals face outward (ring runs with rising angle).
        p.push(...a[i], ...b[i], ...b[j]);
        p.push(...a[i], ...b[j], ...a[j]);
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
  });
  k.mesh(g, geo, color);
}

/** Louver band a hair proud of the glass — mechanical/refuge floors. */
const band = (k: ModelKit, g: T.Group, y: number, h: number) =>
  loft(k, g, `bj-zun:band:${y}:${h}`, [y, y + h], MECH, 1.012);

export const bjZunFactory: Factory = (k, g) => {
  // Plaza the foot lands on; the real tower meets a low stone square, not a
  // podium block, and the entry canopy folds out low from the glass.
  k.box(g, 0.94, 0.016, 0.94, STONE, 0, 0.008);
  k.box(g, 0.36, 0.012, 0.13, FIN, 0, 0.05, HW_BASE * 1.07 + 0.06);
  for (const side of [-1, 1])
    k.cylinder(
      g,
      0.008,
      0.05,
      FIN,
      side * 0.15,
      0.025,
      HW_BASE * 1.07 + 0.115,
      0.008,
      6,
    );

  // The shaft: one smooth zun profile, grade to parapet. Extra samples through
  // the foot keep the trumpet flare from faceting. Levels are world heights —
  // ringAt() divides by H to get the profile fraction.
  const profileTs = [
    ...new Set([
      0,
      0.028,
      FOOT_T,
      WAIST_T,
      CROWN_T,
      0.985,
      1,
      ...Array.from({ length: 24 }, (_, i) => (i + 1) / 24),
      ...[0.17, 0.315, 0.45, 0.585, 0.72, 0.868].flatMap((t) => [
        t,
        t + (t === 0.868 ? 0.038 : 0.026) / H,
      ]),
    ]),
  ].sort((a, b) => a - b);
  const levels = profileTs.map((t) => t * H);
  loft(k, g, "bj-zun:shell", levels, GLASS);

  // Mechanical/refuge floors: five evenly spaced louver bands up the shaft
  // (the real equipment levels repeat on a regular cycle) plus the heavier
  // vent row at the base of the crown zone.
  for (const t of [0.17, 0.315, 0.45, 0.585, 0.72]) band(k, g, t * H, 0.026);
  band(k, g, 0.868 * H, 0.038);

  // Vertical fluting: sixteen bright ribs wrapping the plan, each leaning in
  // and back out with the profile so the rhythm survives the waist.
  const FLUTES = 16;
  const RIB_TS = profileTs;
  for (let i = 0; i < FLUTES; i++) {
    const theta = ((i + 0.5) * 2 * Math.PI) / FLUTES;
    for (let j = 0; j < RIB_TS.length - 1; j++)
      k.beam(
        g,
        skin(theta, RIB_TS[j], 0.0045),
        skin(theta, RIB_TS[j + 1], 0.0045),
        0.011,
        FIN,
      );
  }

  // 内尊 crown: between the main flutes the crown zone carries denser, warmer
  // aluminium ribs (zun-head closeup). They stop at the parapet base — the lip
  // above them folds outward on its own curve.
  for (let i = 0; i < FLUTES; i++) {
    const theta = (i * 2 * Math.PI) / FLUTES;
    k.beam(
      g,
      skin(theta, CROWN_T, 0.004),
      skin(theta, 0.985, 0.004),
      0.009,
      CROWN_FIN,
    );
  }

  // Sunken roof deck inside the parapet: a centre fan over the full ring —
  // the wrap-around pair (j = i + 1 mod RING) closes the wedge at ring[0].
  const deck = k.geometry("bj-zun:deck", () => {
    const ring = ringAt(H - 0.004),
      p: number[] = [];
    for (let i = 0; i < RING; i++) {
      const j = (i + 1) % RING;
      p.push(0, H - 0.012, 0, ...ring[j], ...ring[i]);
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
  });
  k.mesh(g, deck, DECK);

  // The saddle lip: the parapet folds outward and up, corners highest, each
  // face dipping mid-way — the crown's signature seen from every vantage.
  const lip = k.geometry("bj-zun:lip", () => {
    const p: number[] = [];
    const hwOut = halfWidth(1) + LIP_OUT;
    const saddle = (hw: number) =>
      Array.from({ length: RING }, (_, i) => {
        const theta = (i * 2 * Math.PI) / RING;
        const [x, z] = point(theta, hw);
        const dip = (LIP_DIP * (1 + Math.cos(4 * theta))) / 2;
        return [x, H + LIP_H - dip, z];
      });
    const base = ringAt(H),
      outer = saddle(hwOut),
      inner = saddle(hwOut - LIP_THICK);
    for (let i = 0; i < RING; i++) {
      const j = (i + 1) % RING;
      p.push(...base[i], ...outer[i], ...outer[j]); // outward-folded wall
      p.push(...base[i], ...outer[j], ...base[j]);
      p.push(...outer[i], ...inner[j], ...outer[j]); // up-facing parapet top
      p.push(...outer[i], ...inner[i], ...inner[j]);
      const lowI = [inner[i][0], H - 0.01, inner[i][2]];
      const lowJ = [inner[j][0], H - 0.01, inner[j][2]];
      p.push(...inner[i], ...lowI, ...lowJ, ...inner[i], ...lowJ, ...inner[j]);
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
  });
  k.mesh(g, lip, FIN);
};
