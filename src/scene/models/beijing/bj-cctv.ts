import * as T from "three";
import type { Factory, ModelKit } from "../../kit";

// 中央电视台总部大楼 / CCTV Headquarters (OMA — Rem Koolhaas & Ole Scheeren,
// structure by Arup, 2012). Beijing CBD.
//
// The building is a closed loop that lives inside a 160 × 160 × 234 m cube, and
// the loop is *three dimensional*: in plan it is a rectangular ring whose two
// legs stand at diagonally opposite corners. Tower 1 (51 storeys, 234 m) takes
// the north-west corner with its long axis north–south; Tower 2 (45 storeys,
// 213.9 m) takes the south-east corner with its long axis east–west. A
// nine-storey plinth filling the whole square joins their feet, and the
// thirteen-storey Overhang joins their tops as an L that turns the south-west
// corner — 75 m of cantilever west from Tower 2, 67 m south from Tower 1.
//
// The model this replaces extruded a flat trapezoid with a hole through it,
// which reads as an arch: one elevation showed the loop, the perpendicular one
// a blank slab. The real building cannot do that, because its legs sit on
// perpendicular sides of the ring, so every elevation is a portal and every
// oblique view shows depth.
//
// Both legs lean 6° in *two* directions at once, straight in toward the middle
// of the square. One shear function `lean(y)` therefore generates the whole
// upper structure: legs and Overhang arms all slide inward together, which is
// what keeps the Overhang's outer faces flush with the legs they continue.

const S = 0.008; // model units per real metre (234 m → 1.87)
const HALF = 160 * S * 0.5; // the 160 m square the loop is framed by
const PODIUM = 46.45 * S; // plinth roof — the bottom edge of the famous void
const SOFFIT = 161 * S; // underside of the Overhang — the top of the void
const CROWN2 = 213.9 * S; // Tower 2 roof, and the Overhang roof with it
const CROWN1 = 234 * S; // Tower 1 roof, standing 20 m proud of everything

const ARM = 40 * S; // width of an Overhang arm = the leg width it continues
const T1_LONG = 53 * S; // Tower 1's north–south plate; leaves a 67 m cantilever
const T2_LONG = 45 * S; // Tower 2's east–west plate; leaves a 75 m cantilever
const TAN6 = Math.tan((6 * Math.PI) / 180);

// Model axes: +x is south, +z is west. That puts the Overhang's outside corner
// (south-west) toward the default camera, which is the view the building is
// photographed from, and puts the symmetric "trousers" west elevation on +z.
const lean = (y: number) => TAN6 * y;

const GLASS = "#6f8896"; // dark blue-grey reflective curtain wall
const GRID = "#afbebc"; // the steel diagrid — silver-grey close to the glass
// tone, so the net sits quietly on the facade instead of shouting over it
const SOFFIT_C = "#55697a"; // shaded underside of the two cantilevers
const DISH = "#cfd6cd"; // the satellite dish farm on the plinth roof
const DECK = "#a9b3ac"; // paved plaza

const WIDE = 0.013; // diagrid tube width
const TOWER_CELL = 0.44; // the legs carry big open diamonds …
const ARM_CELL = 0.32; // … the Overhang and plinth a tighter net

type V3 = [number, number, number];
/** Bounds of a horizontal slice of one limb. */
type Rect = { x0: number; x1: number; z0: number; z1: number };
/** A face as four corners: bottom-left, bottom-right, top-right, top-left. */
type Quad = [V3, V3, V3, V3];

const len = (u: V3) => Math.hypot(u[0], u[1], u[2]);
const bays = (l: number, cell: number) => Math.max(1, Math.round(l / cell));

/** The four plan corners of a slice, in ring order, at height `y`. */
const corners = (r: Rect, y: number): V3[] => [
  [r.x0, y, r.z0],
  [r.x1, y, r.z0],
  [r.x1, y, r.z1],
  [r.x0, y, r.z1],
];

/**
 * One limb of the loop, lofted from its plan slice at `y0` to its slice at
 * `y1`. The plinth passes the same rectangle twice; the legs and the Overhang
 * arms pass sheared rectangles, which tilts them as one continuous plane
 * instead of the stepped boxes that would fake a lean with false ledges.
 */
function limb(
  k: ModelKit,
  g: T.Group,
  key: string,
  slice: (y: number) => Rect,
  y0: number,
  y1: number,
) {
  const lo = corners(slice(y0), y0),
    hi = corners(slice(y1), y1);
  const geo = k.geometry(key, () => {
    const p: number[] = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      p.push(...lo[i], ...hi[i], ...hi[j], ...lo[i], ...hi[j], ...lo[j]);
    }
    p.push(...hi[0], ...hi[2], ...hi[1], ...hi[0], ...hi[3], ...hi[2]); // roof
    p.push(...lo[0], ...lo[1], ...lo[2], ...lo[0], ...lo[2], ...lo[3]); // soffit
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
  });
  k.mesh(g, geo, GLASS);
}

/** Face `i` of a limb between two heights, as a quad ready to be braced. */
function face(
  slice: (y: number) => Rect,
  y0: number,
  y1: number,
  i: number,
): Quad {
  const lo = corners(slice(y0), y0),
    hi = corners(slice(y1), y1);
  const j = (i + 1) % 4;
  return [lo[i], lo[j], hi[j], hi[i]];
}

/**
 * The CCTV skin is not a window grid: it is an exposed braced tube whose
 * diagonals run unbroken from the plinth, up a leg, through the Overhang and
 * down the other leg. Drawing both diagonals of every structural bay gives the
 * diamond net the building is recognised by.
 *
 * The real pattern is force-driven rather than regular: wide-open diamonds over
 * the mid-height of each leg, subdividing into a tight mesh at the feet, at the
 * corners and in the crotch under the Overhang. `dense` reproduces that by
 * halving the named rows.
 */
function diagrid(
  k: ModelKit,
  g: T.Group,
  q: Quad,
  nu: number,
  nv: number,
  dense: number[] = [],
) {
  // Outward normal of the face, so the steel sits proud of the glass.
  const u: V3 = [q[1][0] - q[0][0], 0, q[1][2] - q[0][2]];
  const v: V3 = [q[3][0] - q[0][0], q[3][1] - q[0][1], q[3][2] - q[0][2]];
  const n: V3 = [
    v[1] * u[2] - v[2] * u[1],
    v[2] * u[0] - v[0] * u[2],
    v[0] * u[1] - v[1] * u[0],
  ];
  const m = len(n) || 1;
  const off: V3 = [(n[0] / m) * 0.008, (n[1] / m) * 0.008, (n[2] / m) * 0.008];
  const at = (s: number, t: number): V3 => {
    const b = q[0].map((c, d) => c + (q[1][d] - c) * s);
    const p = q[3].map((c, d) => c + (q[2][d] - c) * s);
    return [
      b[0] + (p[0] - b[0]) * t + off[0],
      b[1] + (p[1] - b[1]) * t + off[1],
      b[2] + (p[2] - b[2]) * t + off[2],
    ];
  };
  for (let i = 0; i < nu; i++)
    for (let j = 0; j < nv; j++) {
      const s0 = i / nu,
        s1 = (i + 1) / nu,
        t0 = j / nv,
        t1 = (j + 1) / nv;
      if (dense.includes(j)) {
        // Stiffened band: two half-height X's, plus the mid stitch between them.
        const tm = (t0 + t1) / 2,
          sm = (s0 + s1) / 2;
        k.beam(g, at(s0, t0), at(sm, tm), WIDE, GRID);
        k.beam(g, at(sm, t0), at(s0, tm), WIDE, GRID);
        k.beam(g, at(sm, t0), at(s1, tm), WIDE, GRID);
        k.beam(g, at(s1, t0), at(sm, tm), WIDE, GRID);
        k.beam(g, at(s0, tm), at(sm, t1), WIDE, GRID);
        k.beam(g, at(sm, tm), at(s0, t1), WIDE, GRID);
        k.beam(g, at(sm, tm), at(s1, t1), WIDE, GRID);
        k.beam(g, at(s1, tm), at(sm, t1), WIDE, GRID);
      } else {
        k.beam(g, at(s0, t0), at(s1, t1), WIDE, GRID);
        k.beam(g, at(s1, t0), at(s0, t1), WIDE, GRID);
      }
    }
  // Edge beams at every bracing node. On the real facade these are the only
  // horizontals; without them the diamonds read as chain-link fencing.
  for (let j = 0; j <= nv; j++)
    k.beam(g, at(0, j / nv), at(1, j / nv), WIDE * 0.7, GRID);
}

export const bjCctvFactory: Factory = (k, g) => {
  // Plan slices. Every one of them is written against `lean(y)`, so the whole
  // upper building shears inward together and the Overhang stays flush with
  // the legs it continues.
  const plinth = (): Rect => ({ x0: -HALF, x1: HALF, z0: -HALF, z1: HALF });
  // Tower 1, north-west, long axis north–south, leaning south and east.
  const t1 = (y: number): Rect => ({
    x0: -HALF + lean(y),
    x1: -HALF + T1_LONG + lean(y),
    z0: HALF - ARM - lean(y),
    z1: HALF - lean(y),
  });
  // Tower 2, south-east, long axis east–west, leaning north and west.
  const t2 = (y: number): Rect => ({
    x0: HALF - ARM - lean(y),
    x1: HALF - lean(y),
    z0: -HALF + lean(y),
    z1: -HALF + T2_LONG + lean(y),
  });
  // The Overhang's west arm: Tower 1's plate run all the way south, and its
  // south arm: Tower 2's plate run all the way west. They cross at the
  // south-west corner, which is the outside corner of the L.
  const west = (y: number): Rect => ({
    x0: -HALF + lean(y),
    x1: HALF - lean(y),
    z0: HALF - ARM - lean(y),
    z1: HALF - lean(y),
  });
  const south = (y: number): Rect => ({
    x0: HALF - ARM - lean(y),
    x1: HALF - lean(y),
    z0: -HALF + lean(y),
    z1: HALF - lean(y),
  });

  k.box(g, 1.5, 0.04, 1.5, DECK, 0, 0.02); // landscaped plaza

  limb(k, g, "bj-cctv-plinth", plinth, 0.02, PODIUM);
  limb(k, g, "bj-cctv-t1", t1, PODIUM, CROWN1);
  limb(k, g, "bj-cctv-t2", t2, PODIUM, CROWN2);
  limb(k, g, "bj-cctv-west", west, SOFFIT, CROWN2);
  limb(k, g, "bj-cctv-south", south, SOFFIT, CROWN2);

  // Shaded soffits, so the two cantilevers read as hanging in the air rather
  // than as blocks resting on something.
  const shade = (r: Rect) =>
    k.box(
      g,
      r.x1 - r.x0,
      0.016,
      r.z1 - r.z0,
      SOFFIT_C,
      (r.x0 + r.x1) / 2,
      SOFFIT - 0.008,
      (r.z0 + r.z1) / 2,
    );
  shade(west(SOFFIT));
  shade(south(SOFFIT));

  // ---- Skin -------------------------------------------------------------
  // Legs, plinth roof to Overhang soffit: all four faces stand free here, and
  // the bracing tightens on the bottom bay where the leaning legs are worked
  // hardest. The top bay stays open: at toy scale a second dense band under
  // the soffit reads as noise rather than as the crotch stiffening.
  for (const slice of [t1, t2]) {
    const nv = bays(SOFFIT - PODIUM, TOWER_CELL);
    for (let i = 0; i < 4; i++) {
      const q = face(slice, PODIUM, SOFFIT, i);
      const w = len([q[1][0] - q[0][0], 0, q[1][2] - q[0][2]]);
      diagrid(k, g, q, bays(w, TOWER_CELL), nv, [0]);
    }
  }

  // Between soffit and Overhang roof each leg is swallowed by its own arm, so
  // only the arms are clad there. Skipping the two faces where the arms meet
  // keeps a single grid on each shared plane at the south-west corner.
  for (const [slice, skip] of [
    [west, 1],
    [south, 2],
  ] as const) {
    const nv = bays(CROWN2 - SOFFIT, ARM_CELL);
    for (let i = 0; i < 4; i++) {
      if (i === skip) continue;
      const q = face(slice, SOFFIT, CROWN2, i);
      const w = len([q[1][0] - q[0][0], 0, q[1][2] - q[0][2]]);
      diagrid(k, g, q, bays(w, ARM_CELL), nv);
    }
  }

  // Tower 1's last twenty metres, standing proud of the Overhang roof. This
  // stepped, off-centre crown is the loop's only asymmetry and it is worth
  // keeping: it is how the two legs tell themselves apart on the skyline.
  for (let i = 0; i < 4; i++) {
    const q = face(t1, CROWN2, CROWN1, i);
    const w = len([q[1][0] - q[0][0], 0, q[1][2] - q[0][2]]);
    diagrid(k, g, q, bays(w, ARM_CELL), 1);
  }

  // Plinth: the same braced tube at the legs' own rhythm, so the net reads as
  // one continuous skin running from the ground up — as it does on the real
  // facade, where the diamonds never break at the plinth roof.
  for (let i = 0; i < 4; i++)
    diagrid(k, g, face(plinth, 0.02, PODIUM, i), bays(2 * HALF, TOWER_CELL), 2);

  // The dish farm on the plinth roof — this is a television headquarters, and
  // in every photograph a row of white antennas sits on that roof inside the
  // void. It also gives the eye something to find in the middle of the loop.
  for (let i = 0; i < 3; i++) {
    const x = -0.24 + i * 0.24;
    k.cylinder(g, 0.012, 0.05, DISH, x, PODIUM + 0.025, -0.1, 0.012, 8);
    const dish = k.sphere(g, 0.035, DISH, x, PODIUM + 0.065, -0.1);
    dish.scale.set(0.035, 0.02, 0.035);
  }
};
