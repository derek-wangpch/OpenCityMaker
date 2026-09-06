import * as T from "three";
import type { Factory, ModelKit } from "../../kit";

// 国贸三期 A / China World Trade Center Tower III (SOM, 2010, 330 m).
//
// The tower is one straight-edged tapering shaft — SOM call it a "tapering
// columnar form" — on a square plan whose four corners are cut by a narrow
// chamfer running the whole height. Three things identify it and everything
// below exists to serve them:
//
//   1. fine vertical metal sunshade fins covering every face, top to bottom;
//   2. a crown screen whose heavier fins carry on *past* the parapet as
//      free-standing blades, splaying outward into a serrated comb;
//   3. those same fins fanning into a zigzag where they land on the stone
//      podium of 国贸商城.
//
// The roof is level. Every upward photograph makes it look sloped; the long-lens
// elevation shows a horizontal top edge, so the taper is encoded in width only.

const SHAFT_TOP = 1.94; // glass shaft roof, where the metal crown screen starts
const CROWN_TOP = 2.1; // parapet of the crown screen
const CREST_TOP = 2.17; // tips of the free-standing crown blades
const FAN_TOP = 0.31; // where the splayed base fins rejoin the straight fins
const PODIUM = 0.13; // 国贸商城 podium the tower rises out of

const HW_BASE = 0.32; // half-width at grade
// Roof width as a fraction of the base. The elevation photo gives ~0.60, but
// the plot forces the tower down to ~3.4 : 1 from the real 5.1 : 1, and holding
// the width ratio over a shorter shaft doubles the *edge angle* into a pyramid.
// 0.74 over this height reproduces the photographed ~2.4° lean instead.
const TAPER = 0.74;
const CHAMFER = 0.14; // corner cut, as a fraction of the half-width

const GLASS = "#7593b0"; // fritted blue-grey vision glass
const FIN = "#c3d2d9"; // brushed metal sunshade fins and mullions
const MECH = "#5f7886"; // louvered mechanical-floor bands, darker than the glass
const CROWN = "#6d8390"; // shaded glass behind the crown's bold open screen
const DECK = "#4c5f68"; // roof deck, sunk inside the ring of blades
const STONE = "#b3a99b"; // podium cladding
const STONE_CAP = "#c8bfaf";

type Ring = [number, number][];

/** Half-width of the shaft at height y; extrapolates past SHAFT_TOP for the crown. */
const halfWidth = (y: number) => HW_BASE * (1 + (TAPER - 1) * (y / SHAFT_TOP));

/** Chamfered-square cross-section: a square with all four corners cut back. */
function ring(y: number, scale = 1): Ring {
  const h = halfWidth(y) * scale,
    c = h * CHAMFER,
    i = h - c;
  return [
    [h, i],
    [i, h],
    [-i, h],
    [-h, i],
    [-h, -i],
    [-i, -h],
    [i, -h],
    [h, -i],
  ];
}

/**
 * Connect sampled cross-sections into one closed surface. Stacking shrinking
 * boxes would fake this taper with ledges the real facade does not have.
 */
function loft(
  k: ModelKit,
  g: T.Group,
  key: string,
  levels: { y: number; scale: number }[],
  color: string,
  cap = false,
) {
  const geo = k.geometry(key, () => {
    const p: number[] = [];
    const at = (l: { y: number; scale: number }, i: number) => {
      const r = ring(l.y, l.scale)[i];
      return [r[0], l.y, r[1]];
    };
    for (let n = 0; n < levels.length - 1; n++) {
      const a = levels[n],
        b = levels[n + 1];
      for (let i = 0; i < 8; i++) {
        const j = (i + 1) % 8;
        // Wound so the normals face outward; the ring runs with rising angle.
        p.push(...at(a, i), ...at(b, i), ...at(b, j));
        p.push(...at(a, i), ...at(b, j), ...at(a, j));
      }
    }
    if (cap) {
      const top = levels[levels.length - 1];
      for (let i = 1; i < 7; i++)
        p.push(...at(top, 0), ...at(top, i + 1), ...at(top, i));
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
  });
  k.mesh(g, geo, color);
}

/** A flush collar hugging the tapering face — floor lines and mechanical bands. */
const collar = (k: ModelKit, g: T.Group, y: number, h: number, color: string) =>
  loft(
    k,
    g,
    `bj-cwt-collar:${y}:${h}:${color}`,
    [
      { y, scale: 1.008 },
      { y: y + h, scale: 1.008 },
    ],
    color,
  );

/**
 * Walk the eight facets and hand back a point on the skin: `edge` picks the
 * facet, `s` slides along it, `y` sets the height, `out` pushes clear of the
 * glass. Fins sample the same profile the shell does, so they stay on it.
 */
function skin(edge: number, s: number, y: number, out = 0): number[] {
  const r = ring(y);
  const a = r[edge],
    b = r[(edge + 1) % 8];
  const dx = b[0] - a[0],
    dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  // Outward normal of a facet, for a ring wound with rising angle.
  return [
    a[0] + dx * s + (dz / len) * out,
    y,
    a[1] + dz * s - (dx / len) * out,
  ];
}

/**
 * Fin positions along one facet. Ring vertex 0 sits mid-corner, so the *odd*
 * facets are the four broad faces and the even ones are the narrow chamfers,
 * which are about an eighth as wide and carry proportionally fewer fins.
 */
function stations(edge: number, wide: number, narrow: number) {
  const n = edge % 2 === 1 ? wide : narrow;
  return Array.from({ length: n }, (_, i) => (i + 0.5) / n);
}

export const bjCwtFactory: Factory = (k, g) => {
  // 国贸商城: the "robust base folded into the urban fabric" that anchors the
  // spire. Kept low and wide so the tower still reads as the tall thing.
  k.box(g, 0.9, PODIUM, 0.84, STONE, 0, PODIUM / 2);
  k.box(g, 0.86, 0.055, 0.8, "#8fa9b4", 0, 0.075); // mall shopfront glazing
  k.box(g, 0.94, 0.022, 0.88, STONE_CAP, 0, PODIUM + 0.011);

  // The shaft: a single straight taper, grade to roof, no setbacks.
  loft(
    k,
    g,
    "bj-cwt-shaft",
    [
      { y: 0, scale: 1 },
      { y: SHAFT_TOP, scale: 1 },
    ],
    GLASS,
    true,
  );

  // Regular floor banding, subordinate to the vertical fins but clearly there
  // in the elevation. Skipped where a mechanical band already sits.
  const mech = [0.36, 0.72].map((t) => PODIUM + t * (SHAFT_TOP - PODIUM));
  for (let i = 1; i <= 11; i++) {
    const y = PODIUM + (i * (SHAFT_TOP - PODIUM)) / 12;
    if (mech.some((m) => Math.abs(m - y) < 0.06)) continue;
    collar(k, g, y, 0.009, FIN);
  }
  // Two louvered mechanical floors, flush with the glass rather than projecting.
  for (const y of mech) collar(k, g, y - 0.025, 0.05, MECH);

  // Vertical sunshade fins. Each runs the full shaft and leans inward with the
  // taper, because it samples the same profile at both ends.
  for (let edge = 0; edge < 8; edge++)
    for (const s of stations(edge, 7, 1)) {
      k.beam(
        g,
        skin(edge, s, FAN_TOP, 0.003),
        skin(edge, s, SHAFT_TOP, 0.003),
        0.012,
        FIN,
      );
    }

  // Where the fins reach the podium they splay apart and cross, so the bottom
  // two floors read as a zigzag fan rather than a straight comb.
  for (let edge = 0; edge < 8; edge++) {
    const st = stations(edge, 7, 1);
    st.forEach((s, i) => {
      const lean =
        st.length > 1 ? (i % 2 === 0 ? 1 : -1) * (0.5 / st.length) : 0;
      k.beam(
        g,
        skin(edge, s, FAN_TOP, 0.003),
        skin(edge, Math.min(0.98, Math.max(0.02, s + lean)), PODIUM, 0.003),
        0.012,
        FIN,
      );
    });
  }

  // The crown. The hotel top is an open screen, not a curtain wall: in the
  // elevation it reads as a boldly striped block — fewer fins than the shaft
  // but half again as heavy, over glass sunk in their shadow — sitting very
  // slightly set in on the blue shaft.
  loft(
    k,
    g,
    "bj-cwt-crown",
    [
      { y: SHAFT_TOP, scale: 0.97 },
      { y: CROWN_TOP, scale: 0.97 },
    ],
    CROWN,
    true,
  );
  k.box(g, 0.24, 0.014, 0.22, DECK, 0, CROWN_TOP + 0.008); // sunken roof deck

  for (let edge = 0; edge < 8; edge++)
    for (const s of stations(edge, 7, 1)) {
      // The screen mullion …
      k.beam(
        g,
        skin(edge, s, SHAFT_TOP, 0.006),
        skin(edge, s, CROWN_TOP, 0.006),
        0.018,
        FIN,
      );
      // … and the blade it becomes above the parapet, kicked outward. This
      // serrated comb is the tower's signature against the sky.
      k.beam(
        g,
        skin(edge, s, CROWN_TOP, 0.006),
        skin(edge, s, CREST_TOP, 0.009),
        0.014,
        FIN,
      );
    }
};
