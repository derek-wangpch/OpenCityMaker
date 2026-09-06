import type { Factory } from "../../kit";
import { loft } from "../../architecture";

/**
 * International Commerce Centre (環球貿易廣場), KPF. The identifying moves,
 * all read off harbour and West Kowloon elevations:
 *   - a chamfered-square plan whose four narrow corner bevels read as bright
 *     silver spines running the whole height, against horizontally striped
 *     glass — the opposite grain to IFC's vertical silver fluting next door;
 *   - a gentle, uninterrupted taper; no setbacks anywhere on the shaft;
 *   - the "dragon tail" base, where the four curtain walls peel outward over
 *     the bottom sixth of the tower while the corner wedges drop straight to
 *     the plaza and widen as the facades sweep out past them;
 *   - a level parapet, standing slightly proud of the wall below, notched at
 *     each corner by a dark canted plate: four tabs in elevation, a peak when
 *     the tower is seen corner-on. No spire, no mast;
 *   - five grouped mechanical zones at unequal heights (photo approximation).
 */
export const hkIccFactory: Factory = (k, g) => {
  const glass = "#9dbcc9", // pale silver-blue vision glass
    spine = "#d9e4e2", // bright bevelled corner
    trim = "#cadadd", // spandrel lines
    louvre = "#5d7684", // recessed mechanical bands
    skirt = "#6c8492", // sloped base flare, reflecting the plaza
    stone = "#c8cec1";

  const ROOF = 2.44,
    FLARE = 0.4, // top of the peeled-away base
    WIDE = 0.288, // facade half-width where the shaft meets the flare
    TIP = 0.254; // facade half-width at the parapet

  /** Distance from the axis to a facade plane. */
  const face = (y: number) => {
    if (y >= FLARE) return WIDE - (WIDE - TIP) * ((y - FLARE) / (ROOF - FLARE));
    return WIDE + 0.188 * Math.pow((FLARE - y) / FLARE, 2.0);
  };
  /**
   * Half-width of the flat facade before the corner bevel starts. Above the
   * flare the bevel is a slim chamfer that slims further as the tower rises.
   * Through the flare, face + run is held constant so the corner keeps its
   * station on the plaza while the facade planes swing outward past it — the
   * long diagonal facet that opens up is the peeling wall, not a wider bevel.
   */
  const HELD = WIDE * (1 + 0.83);
  const run = (y: number) =>
    y >= FLARE
      ? face(y) * (0.83 + 0.05 * ((y - FLARE) / (ROOF - FLARE)))
      : Math.max(0.06, HELD - face(y));
  /**
   * How much of that diagonal facet is actually the pale corner wedge: all of
   * it on the shaft, only the middle of it down in the flare, so the outer
   * ends stay with the dark peeling walls they belong to.
   */
  const wedge = (y: number) =>
    y >= FLARE ? 1 : 1 - 0.66 * Math.pow((FLARE - y) / FLARE, 1.1);

  /** Chamfered square: four facade planes joined by four corner bevels. */
  const plan = (y: number): [number, number][] => {
    const f = face(y),
      e = run(y);
    return [
      [-e, -f],
      [e, -f],
      [f, -e],
      [f, e],
      [e, f],
      [-e, f],
      [-f, e],
      [-f, -e],
    ];
  };
  /** Quarter-turn about the axis, so one facade's math serves all four. */
  const spin = (x: number, z: number, s: number): [number, number] => {
    let a = x,
      b = z;
    for (let i = 0; i < s; i++) [a, b] = [-b, a];
    return [a, b];
  };
  const levels = (y0: number, y1: number, n: number) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const y = y0 + ((y1 - y0) * i) / n;
      return { y, points: plan(y) };
    });

  // Elements podium and the station deck the tower stands on.
  k.box(g, 1.26, 0.06, 1.14, stone, 0, 0.03);

  // Peeled base and the smooth shaft above it. Split only so the sloping
  // skirt can carry its own darker glass tone; the rings match at FLARE.
  loft(k, g, "hk-icc:skirt", levels(0.04, FLARE, 7), skirt);
  loft(k, g, "hk-icc:shaft", levels(FLARE, ROOF, 5), glass);

  // Bright bevelled corners: a thin skin over each chamfer facet, running the
  // whole height. Through the flare the widening chamfer becomes the pale
  // corner wedge that drops to the plaza between the dark peeling walls.
  for (let c = 0; c < 4; c++)
    loft(
      k,
      g,
      `hk-icc:bevel:${c}`,
      [
        ...Array.from({ length: 8 }, (_, i) => 0.04 + ((FLARE - 0.04) * i) / 7),
        ...Array.from(
          { length: 5 },
          (_, i) => FLARE + ((ROOF - FLARE) * (i + 1)) / 5,
        ),
      ].map((y) => {
        const f = face(y) + 0.006,
          e = run(y);
        // Walk in from both ends of the diagonal facet by the wedge fraction.
        const t0 = (1 - wedge(y)) / 2,
          t1 = 1 - t0;
        const on = (t: number, s: number): [number, number] =>
          spin((e + (f - e) * t) * s, -(f + (e - f) * t) * s, c);
        const ring: [number, number][] = [
          on(t0, 1),
          on(t1, 1),
          on(t1, 0.985),
          on(t0, 0.985),
        ];
        return { y, points: ring };
      }),
      spine,
    );

  for (let s = 0; s < 4; s++) {
    const at = (u: number, y: number, out = 0.005): number[] => {
      const [x, z] = spin(u * run(y), -face(y) - out, s);
      return [x, y, z];
    };
    // Dense horizontal spandrel banding — ICC reads as stripes, not mullions.
    for (let i = 1; i <= 17; i++) {
      const y = FLARE + ((ROOF - FLARE) * i) / 18;
      k.beam(g, at(-1, y), at(1, y), 0.007, trim);
    }
    // A few lines survive onto the narrow flat panel of the flaring skirt.
    for (const y of [0.14, 0.24, 0.34])
      k.beam(g, at(-1, y), at(1, y), 0.007, trim);
    // Group the louvres into broad dark strips; avoid three tiny vibrating lines.
    for (const y of [0.45, 0.94, 1.44, 1.94, 2.32])
      k.beam(g, at(-1, y, 0.001), at(1, y, 0.001), 0.046, louvre);
    // Level parapet, slightly proud of the wall below, as the top floors are.
    k.beam(
      g,
      at(-1, ROOF - 0.014, 0.012),
      at(1, ROOF - 0.014, 0.012),
      0.026,
      spine,
    );
  }

  // Each corner bevel stops a little short of the level parapet and is closed
  // by a dark canted plate, so the crown reads as four notched corner tabs.
  for (let c = 0; c < 4; c++) {
    const m = (face(ROOF) + run(ROOF)) / 2;
    const [x, z] = spin(m, -m, c);
    k.beam(
      g,
      [x * 0.93, ROOF - 0.055, z * 0.93],
      [x * 1.08, ROOF + 0.014, z * 1.08],
      0.046,
      louvre,
    );
  }
};
