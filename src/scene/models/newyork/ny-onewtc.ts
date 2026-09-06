import type { Factory } from "../../kit";
import { loft } from "../../architecture";

// One World Trade Center (SOM, 2014). A cube rises into eight planar
// isosceles triangles — four up, four down — so the plan runs square →
// octagon at mid-shaft → a square rotated 45° at the parapet, then a
// cable-stayed needle to 1,776 ft.
//
// Real top/base side is 150/200. Rotated 45°, the diamond's axis span is
// almost the podium width — that near-match is the crystal, not a pyramid.
// Shaft and needle use the 2.65 cap; the podium is slimmer so the extra
// height reads as slenderness.

const W = 0.28; // half-width of the podium / shaft foot
const TOP = 0.88; // slightly fuller than 150/200 so the crown doesn't pinch
const S = W * TOP * Math.SQRT2;

const PODIUM = 0.22;
const ROOF = 2.04;
const TIP = 2.65;

const GLASS = "#7f9eac";
const RIDGE = "#c9d6d2";
const MULLION = "#b7c6c2";
const SPANDREL = "#6d8690";
const MECH = "#4a5c64";
const POD = "#9aa8a5";
const FIN = "#c4cdc8";
const SLAT = "#7e8c89";
const ENTRY = "#4a5c62";
const DECK = "#c5cdc8";
const STEEL = "#d4dbe0";
const RING = "#b0b6b2";

const oct = (s: number, c: number): [number, number][] => [
  [-s, -c],
  [-c, -s],
  [c, -s],
  [s, -c],
  [s, c],
  [c, s],
  [-c, s],
  [-s, c],
];

const section = (t: number, scale = 1): [number, number][] => {
  const s = (W + (S - W) * t) * scale;
  const c = Math.max(W * (1 - t), 0.01) * scale;
  return oct(s, c);
};

const shaftY = (t: number) => PODIUM + (ROOF - PODIUM) * t;

const lerp2 = (
  a: [number, number],
  b: [number, number],
  u: number,
): [number, number] => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

export const nyOnewtcFactory: Factory = (k, g) => {
  // Windowless podium: glass fins over steel slats, cable-net portals.
  k.box(g, W * 2, PODIUM, W * 2, POD);
  k.box(g, W * 2 + 0.02, 0.024, W * 2 + 0.02, FIN, 0, PODIUM - 0.008);
  for (const bandY of [0.06, 0.12, 0.18])
    k.box(g, W * 2 + 0.012, 0.012, W * 2 + 0.012, SLAT, 0, bandY);
  for (const [nx, nz] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const) {
    k.box(
      g,
      nx ? 0.018 : 0.2,
      PODIUM * 0.42,
      nz ? 0.018 : 0.2,
      ENTRY,
      nx * (W + 0.012),
      PODIUM * 0.22,
      nz * (W + 0.012),
    );
    k.box(
      g,
      nx ? 0.045 : 0.24,
      0.014,
      nz ? 0.045 : 0.24,
      FIN,
      nx * (W + 0.028),
      PODIUM * 0.44,
      nz * (W + 0.028),
    );
    for (let j = -3; j <= 3; j++) {
      if (j === 0) continue;
      k.box(
        g,
        nx ? 0.014 : 0.016,
        PODIUM * 0.92,
        nz ? 0.014 : 0.016,
        FIN,
        nx * (W + 0.01) + (nz ? j * 0.07 : 0),
        PODIUM * 0.48,
        nz * (W + 0.01) + (nx ? j * 0.07 : 0),
      );
    }
  }

  loft(
    k,
    g,
    "ny-onewtc-shaft",
    [
      { y: PODIUM, points: section(0) },
      { y: ROOF, points: section(1) },
    ],
    GLASS,
  );

  // Eight facet arrises, plus two mullions on each upward face and one
  // down the middle of each chamfer — grouped from the 5 ft curtain grid.
  const at = (t: number, i: number) => section(t)[i];
  for (let i = 0; i < 8; i++) {
    const a = at(0, i),
      b = at(1, i);
    k.beam(g, [a[0], PODIUM, a[1]], [b[0], ROOF, b[1]], 0.016, RIDGE);
  }
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8;
    const chamfer = i % 2 === 0;
    const us = chamfer ? [0.5] : [0.32, 0.68];
    for (const u of us) {
      const p0 = lerp2(at(0.04, i), at(0.04, j), u);
      const p1 = lerp2(at(0.82, i), at(0.82, j), u);
      k.beam(
        g,
        [p0[0], shaftY(0.04), p0[1]],
        [p1[0], shaftY(0.82), p1[1]],
        0.012,
        MULLION,
      );
    }
  }

  for (const t of [0.08, 0.18, 0.28, 0.38, 0.5, 0.6, 0.7, 0.8])
    loft(
      k,
      g,
      `ny-onewtc-belt:${t}`,
      [
        { y: shaftY(t), points: section(t, 1.004) },
        {
          y: shaftY(t) + (t === 0.5 ? 0.024 : 0.016),
          points: section(t + 0.008, 1.004),
        },
      ],
      SPANDREL,
    );

  loft(
    k,
    g,
    "ny-onewtc-obs",
    [
      { y: shaftY(0.86), points: section(0.86, 1.003) },
      { y: shaftY(0.92), points: section(0.92, 1.003) },
    ],
    SPANDREL,
  );
  loft(
    k,
    g,
    "ny-onewtc-mech",
    [
      { y: shaftY(0.92), points: section(0.92, 1.005) },
      { y: shaftY(1), points: section(1, 1.005) },
    ],
    MECH,
  );

  loft(
    k,
    g,
    "ny-onewtc-parapet",
    [
      { y: ROOF, points: section(1, 1.02) },
      { y: ROOF + 0.026, points: section(1, 1.02) },
    ],
    DECK,
  );
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    k.box(
      g,
      0.018,
      0.04,
      0.018,
      DECK,
      Math.cos(a) * S * 0.92,
      ROOF + 0.02,
      Math.sin(a) * S * 0.92,
    );
  }

  // Three comms rings with spokes, then a longer telescoping mast.
  for (let i = 0; i < 3; i++) {
    const y = ROOF + 0.038 + i * 0.038;
    const r = 0.13 - i * 0.016;
    k.cylinder(g, r, 0.014, RING, 0, y, 0, r, 16);
    for (let s = 0; s < 4; s++) {
      const a = (s * Math.PI) / 2 + i * 0.2;
      k.box(g, r * 1.7, 0.008, 0.01, STEEL, 0, y, 0).rotation.y = a;
    }
  }
  const mastBase = ROOF + 0.11;
  const segs: [number, number, number][] = [
    [0.032, 0.024, 0.09],
    [0.024, 0.018, 0.09],
    [0.018, 0.013, 0.085],
    [0.013, 0.009, 0.08],
    [0.009, 0.006, 0.075],
    [0.006, 0.0035, 0.07],
  ];
  let y = mastBase;
  for (const [r0, r1, h] of segs) {
    k.cylinder(g, r0, h, STEEL, 0, y + h / 2, 0, r1, 10);
    k.cylinder(g, r0 + 0.004, 0.01, RING, 0, y + 0.004, 0, r0 + 0.004, 10);
    y += h;
  }
  // Broadcast panels on the lower mast sections.
  for (const [ty, h, r] of [
    [0.18, 0.055, 0.028],
    [0.32, 0.045, 0.022],
  ] as const)
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      k.box(
        g,
        0.012,
        h,
        0.008,
        RING,
        Math.cos(a) * r,
        mastBase + ty,
        Math.sin(a) * r,
      );
    }
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    k.beam(
      g,
      [Math.cos(a) * 0.12, ROOF + 0.05, Math.sin(a) * 0.12],
      [Math.cos(a) * 0.014, mastBase + 0.28, Math.sin(a) * 0.014],
      0.008,
      STEEL,
    );
  }
  k.sphere(g, 0.02, DECK, 0, Math.min(y + 0.018, TIP), 0);
};
