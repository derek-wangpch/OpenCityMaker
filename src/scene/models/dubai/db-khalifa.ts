import * as T from "three";
import type { Factory } from "../../kit";

/**
 * Burj Khalifa (SOM / Adrian Smith, 828 m).
 *
 * The identifying geometry is a buttressed core: three wings on FIXED axes
 * 120 deg apart around a central hexagonal core. The wings do not twist — the
 * famous spiral comes from the *order* of the 27 setbacks, which retreat one
 * wing at a time as the tower climbs, so at any height the three wings have
 * slightly different reaches. Above the last wing (585 m, ~70% of height) the
 * core carries on alone and hands off to a 244 m telescoping steel spire.
 */
export const dbKhalifaFactory: Factory = (k, g) => {
  const glass = "#8fb3c4"; // reflective blue-grey curtain wall
  const fin = "#e2e8e5"; // stainless vertical tubular fins
  const terrace = "#b7ccd2"; // spandrel / setback parapet
  const steel = "#d3dbd8"; // spire
  const podium = "#cabfa4";

  const yBase = 0.05; // top of the podium slab
  const wingSpan = 1.6; // height over which wing 0 runs out of setbacks
  const coreTop = 1.86;
  const apex = 2.65; // the plot's hard ceiling — this is the city's tallest
  const steps = 9; // setbacks per wing; 3 wings x 9 = the real 27
  const R0 = 0.275; // ground-level wing reach
  const hw0 = 0.09; // ground-level wing half-width

  // Measured off the Wikimedia height-comparison elevation: the plan area
  // sheds fast in the lower third, then the shaft stays slender for a long
  // stretch. A plain linear taper would read as a cone, not a needle.
  const reachAt = (u: number) =>
    R0 * (0.16 + 0.84 * Math.pow(Math.max(0, 1 - u), 1.8));
  // Wings narrow across as well as shorten, but far less: the setbacks mainly
  // crop the wing tip, which is why the crown plan reads as a rounded triangle.
  const halfWidthFor = (reach: number) => hw0 * (0.45 + (0.55 * reach) / R0);

  // Setback heights for wing j. The j/3 phase offset IS the spiral: a setback
  // happens every 1/27 of the climb, rotating around the three wings. The 0.8
  // exponent keeps the lower bays tall and bunches the upper ones, as on the
  // real tower — evenly spaced steps read as a machined cone.
  const stepBottom = (n: number, j: number) =>
    yBase + wingSpan * Math.pow((n + j / 3) / steps, 0.8);

  const wings = [0, 1, 2];
  const angleOf = (j: number) => Math.PI / 2 + (j * Math.PI * 2) / 3;

  /** Wing footprint: a bar out from the core with a chamfered nose. */
  const wingPolygon = (reach: number, hw: number, angle: number) => {
    const local: number[][] = [
      [0, hw],
      [reach * 0.7, hw],
      [reach * 0.93, hw * 0.6],
      [reach, 0],
      [reach * 0.93, -hw * 0.6],
      [reach * 0.7, -hw],
      [0, -hw],
    ];
    const c = Math.cos(angle),
      s = Math.sin(angle);
    return local.map(([lx, lz]) => [lx * c - lz * s, lx * s + lz * c]);
  };

  /** Extrude a closed XZ polygon between two heights, outward-facing. */
  const prism = (poly: number[][], y0: number, y1: number, out: number[]) => {
    const n = poly.length;
    for (let i = 0; i < n; i++) {
      const a = poly[i],
        b = poly[(i + 1) % n];
      out.push(a[0], y0, a[1], b[0], y0, b[1], b[0], y1, b[1]);
      out.push(a[0], y0, a[1], b[0], y1, b[1], a[0], y1, a[1]);
    }
    for (let i = 1; i < n - 1; i++) {
      out.push(
        poly[0][0],
        y1,
        poly[0][1],
        poly[i][0],
        y1,
        poly[i][1],
        poly[i + 1][0],
        y1,
        poly[i + 1][1],
      );
      out.push(
        poly[0][0],
        y0,
        poly[0][1],
        poly[i + 1][0],
        y0,
        poly[i + 1][1],
        poly[i][0],
        y0,
        poly[i][1],
      );
    }
  };

  const emit = (key: string, positions: number[], color: string) =>
    k.mesh(
      g,
      k.geometry(key, () => {
        const geo = new T.BufferGeometry();
        geo.setAttribute(
          "position",
          new T.Float32BufferAttribute(positions, 3),
        );
        geo.computeVertexNormals();
        return geo;
      }),
      color,
    );

  // --- Wings: one stepped prism per setback bay ---------------------------
  const wingFaces: number[] = [];
  const parapets: number[] = [];
  for (const j of wings) {
    const angle = angleOf(j);
    for (let n = 0; n < steps; n++) {
      const y0 = n === 0 ? yBase : stepBottom(n, j);
      const y1 = stepBottom(n + 1, j);
      const reach = reachAt(Math.pow(n / steps, 0.8));
      const hw = halfWidthFor(reach);
      prism(wingPolygon(reach, hw, angle), y0, y1, wingFaces);
      // Bright lip along each setback: this is the terrace edge that makes
      // the 27-step spiral legible instead of a smooth cone.
      prism(
        wingPolygon(reach + 0.006, hw + 0.006, angle),
        y1 - 0.012,
        y1,
        parapets,
      );
    }
  }
  emit("db-khalifa:wings", wingFaces, glass);
  emit("db-khalifa:parapets", parapets, terrace);

  // --- Hexagonal buttressed core -----------------------------------------
  // Three frustums with matching radii at the joins, so the core tapers
  // without inventing ledges the real concrete core does not have.
  const coreSections: [number, number, number, number][] = [
    [yBase, 0.75, 0.105, 0.082],
    [0.75, 1.35, 0.082, 0.058],
    [1.35, coreTop, 0.058, 0.036],
  ];
  for (const [y0, y1, r0, r1] of coreSections)
    k.cylinder(g, r0, y1 - y0, glass, 0, (y0 + y1) / 2, 0, r1, 6);

  // --- Telescoping steel spire (244 m of the 828 m, ~27% of the height) ---
  const spire: [number, number, number, number][] = [
    [coreTop, 2.14, 0.036, 0.024],
    [2.14, 2.36, 0.024, 0.013],
    [2.36, 2.52, 0.013, 0.006],
    [2.52, apex, 0.006, 0.0015],
  ];
  for (const [y0, y1, r0, r1] of spire)
    k.cylinder(g, r0, y1 - y0, steel, 0, (y0 + y1) / 2, 0, r1, 8);
  // Thin collars mark where each spire section telescopes out of the last.
  for (const [y, r] of [
    [coreTop, 0.042],
    [2.14, 0.029],
    [2.36, 0.017],
  ])
    k.cylinder(g, r, 0.012, terrace, 0, y, 0, r, 8);

  // --- Vertical tubular fins on the wing side walls -----------------------
  // The side walls are near-planar, so fins run the full bay and simply stop
  // where a setback crops them — the tower's dominant vertical texture.
  for (const j of wings) {
    const angle = angleOf(j),
      c = Math.cos(angle),
      s = Math.sin(angle);
    const place = (lx: number, lz: number, y: number): number[] => [
      lx * c - lz * s,
      y,
      lx * s + lz * c,
    ];
    for (let n = 0; n < 7; n++) {
      const y0 = n === 0 ? yBase : stepBottom(n, j),
        y1 = stepBottom(n + 1, j);
      const reach = reachAt(Math.pow(n / steps, 0.8));
      const hw = halfWidthFor(reach) + 0.004;
      for (const lx of [0.11, 0.19, 0.27])
        if (lx < reach * 0.92)
          for (const side of [-1, 1])
            k.beam(
              g,
              place(lx, side * hw, y0),
              place(lx, side * hw, y1),
              0.011,
              fin,
            );
      // Nose mullion on the wing tip, present at every setback.
      k.beam(g, place(reach, 0, y0), place(reach, 0, y1), 0.013, fin);
    }
  }

  // --- Podium ------------------------------------------------------------
  // A low plinth, kept tight to the wing tips so the Y-plan stays readable
  // from above instead of sitting on a saucer.
  k.cylinder(g, 0.37, yBase, podium, 0, yBase / 2, 0, 0.34, 12);
  k.cylinder(g, 0.34, 0.01, terrace, 0, yBase, 0, 0.34, 12);
};
