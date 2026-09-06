import * as T from "three";
import type { Factory } from "../../kit";

/**
 * Burj Al Arab (Atkins / Tom Wright, 321 m).
 *
 * Plan is a V: two hotel wings split from a central spine and splay forward,
 * and the mouth between them is closed by the PTFE-coated membrane that reads
 * as the sail. So the whole tower is one volume that shrinks *toward the
 * spine* as it rises — which is what produces the famous elevation: a dead
 * straight vertical edge on the mast side and a convex bellying edge on the
 * membrane side, meeting under an exposed needle.
 */
export const dbBurjAlArabFactory: Factory = (k, root, city) => {
  // Turn the V so the board camera gets the postcard elevation — membrane
  // sail on one side, glazed wing on the other, mast edge dead vertical.
  const g = new T.Group();
  g.rotation.y = -0.9;
  root.add(g);

  const membrane = "#f1ece0"; // teflon-coated woven glass fibre
  const glass = "#7d9ab0"; // wing curtain wall, deeper than the Khalifa's
  const steel = "#f7f5ec"; // exoskeleton, mast and sail leech
  const seam = "#d8d3c2"; // membrane tension seams
  const island = "#cdc2a5";
  const gold = city.palette.accent;

  const y0 = 0.07; // top of the island podium
  const yTop = 2.1; // where the membrane meets the mast
  const mastTop = 2.54;

  // Apex of the V, directly under the mast. This point never moves with
  // height — it is the straight edge of the sail elevation.
  const apex = [0, -0.28];
  const tip = 0.3; // wing tip half-width at grade
  const tipZ = 0.12;

  /**
   * Fitted off the sail elevation: the membrane holds its width through the
   * lower half then sweeps in hard near the top, so the leading edge reads as
   * an arc rather than the straight rake of a cone.
   */
  const spread = (t: number) =>
    Math.max(0.035, Math.pow(Math.max(0, 1 - t * t), 0.58));

  // Base footprint, wound so the extruded side quads face outward:
  // apex -> left wing tip -> membrane arc -> right wing tip.
  const arcPoint = (v: number) => {
    const c = [0, 0.52]; // Bezier control pushing the membrane forward
    const a = [-tip, tipZ],
      b = [tip, tipZ];
    const w = (1 - v) * (1 - v),
      m = 2 * v * (1 - v),
      e = v * v;
    return [a[0] * w + c[0] * m + b[0] * e, a[1] * w + c[1] * m + b[1] * e];
  };
  const arcSamples = 8;
  const base: number[][] = [apex, [-tip, tipZ]];
  for (let i = 1; i < arcSamples; i++) base.push(arcPoint(i / arcSamples));
  base.push([tip, tipZ]);
  // Edge i runs base[i] -> base[i+1]; only the first and last are wing walls.
  const isMembrane = (i: number) => i > 0 && i < base.length - 1;

  const ringAt = (t: number, outset = 0) => {
    const s = spread(t) + outset;
    return base.map(([x, z]) => [
      apex[0] + (x - apex[0]) * s,
      apex[1] + (z - apex[1]) * s,
    ]);
  };
  const yAt = (t: number) => y0 + (yTop - y0) * t;

  const membraneFaces: number[] = [];
  const glassFaces: number[] = [];
  const levels = 40;
  for (let n = 0; n < levels; n++) {
    const lo = ringAt(n / levels),
      hi = ringAt((n + 1) / levels);
    const yl = yAt(n / levels),
      yh = yAt((n + 1) / levels);
    for (let i = 0; i < base.length; i++) {
      const j = (i + 1) % base.length;
      const out = isMembrane(i) ? membraneFaces : glassFaces;
      const a = lo[i],
        b = lo[j],
        c = hi[j],
        d = hi[i];
      out.push(a[0], yl, a[1], b[0], yl, b[1], c[0], yh, c[1]);
      out.push(a[0], yl, a[1], c[0], yh, c[1], d[0], yh, d[1]);
    }
  }
  // Close the top sliver and the underside.
  for (const [t, y, flip] of [
    [1, yAt(1), false],
    [0, y0, true],
  ] as [number, number, boolean][]) {
    const ring = ringAt(t);
    for (let i = 1; i < ring.length - 1; i++) {
      const tri = [ring[0], ring[i], ring[i + 1]];
      if (flip) tri.reverse();
      for (const p of tri) membraneFaces.push(p[0], y, p[1]);
    }
  }

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
  emit("db-burj-al-arab:membrane", membraneFaces, membrane);
  emit("db-burj-al-arab:wings", glassFaces, glass);

  // --- Horizontal tension seams across the membrane ----------------------
  // The fabric is divided into stacked panels; these bands are the strongest
  // texture cue on the sail and read better than a literal window grid.
  const seams: number[] = [];
  for (let b = 1; b < 13; b++) {
    const t = b / 13;
    const lo = ringAt(t, 0.004),
      hi = ringAt(t, 0.004);
    const yl = yAt(t) - 0.008,
      yh = yAt(t) + 0.008;
    for (let i = 1; i < base.length - 1; i++) {
      const a = lo[i],
        c = lo[i + 1];
      seams.push(a[0], yl, a[1], c[0], yl, c[1], c[0], yh, c[1]);
      seams.push(a[0], yl, a[1], c[0], yh, c[1], hi[i][0], yh, hi[i][1]);
    }
  }
  emit("db-burj-al-arab:seams", seams, seam);

  // --- Sail leech: the exposed structural arc on the leading edge ---------
  // A slender blade standing proud of the fabric, sweeping from the base up
  // to the mast head. Sampling the same spread() keeps it on the silhouette.
  const nose = Math.floor(base.length / 2); // the forward-most plan vertex
  const bladeAt = (t: number) => {
    const p = ringAt(t, 0.022)[nose];
    return [p[0], yAt(t), p[1]];
  };
  for (let i = 0; i < 24; i++)
    k.beam(
      g,
      bladeAt(i / 24),
      bladeAt((i + 1) / 24),
      0.034 - 0.016 * (i / 24),
      steel,
    );

  // --- Exoskeleton: diagonal trusses across each wing wall ----------------
  // Atkins put the bracing on the outside; six diagonals zigzag up each face.
  for (const side of [-1, 1]) {
    const edge = (t: number, outer: boolean) => {
      const ring = ringAt(t, 0.012);
      const p = outer ? ring[side > 0 ? 1 : base.length - 1] : ring[0];
      return [p[0], yAt(t), p[1]];
    };
    for (let i = 0; i < 6; i++)
      k.beam(
        g,
        edge(i / 6, i % 2 === 0),
        edge((i + 1) / 6, i % 2 !== 0),
        0.025,
        steel,
      );
  }

  // Grouped silver spandrels lie on both glazed wings, following the loft.
  for (let band = 1; band <= 14; band++) {
    const t = band / 16;
    const ring = ringAt(t, 0.013);
    for (const i of [1, base.length - 1])
      k.beam(
        g,
        [ring[0][0], yAt(t), ring[0][1]],
        [ring[i][0], yAt(t), ring[i][1]],
        0.018,
        steel,
      );
  }
  for (const i of [1, base.length - 1])
    for (let n = 0; n < 24; n++) {
      const a = ringAt(n / 24, 0.017)[i];
      const b = ringAt((n + 1) / 24, 0.017)[i];
      k.beam(
        g,
        [a[0], yAt(n / 24), a[1]],
        [b[0], yAt((n + 1) / 24), b[1]],
        0.028,
        steel,
      );
    }

  // --- Mast and needle at the apex of the V -------------------------------
  const mast = k.cylinder(
    g,
    0.032,
    2.24,
    steel,
    apex[0],
    y0 + 1.12,
    apex[1],
    0.019,
    10,
  );
  mast.scale.z = 0.62; // the real mast section is a 5 x 2.5 m oval
  k.cylinder(g, 0.015, 0.24, steel, apex[0], 2.19, apex[1], 0.008, 8);
  k.cylinder(g, 0.007, 0.24, seam, apex[0], mastTop - 0.12, apex[1], 0.0015, 6);

  // The helipad projects beyond the curved front; the restaurant sits
  // behind the spine. Their supports remain attached in plan and elevation.
  const frontZ = ringAt(0.78)[nose][1];
  k.beam(g, [0, 1.65, frontZ], [0, 1.69, 0.31], 0.04, steel);
  k.beam(g, [0, 1.43, frontZ], [0, 1.68, 0.31], 0.03, steel);
  k.cylinder(g, 0.12, 0.032, steel, 0, 1.7, 0.34, 0.12, 16);
  k.cylinder(g, 0.09, 0.008, "#9fb59f", 0, 1.72, 0.34, 0.09, 16);
  k.beam(g, [0, 1.58, apex[1]], [0, 1.58, -0.39], 0.045, steel);
  k.box(g, 0.36, 0.085, 0.12, glass, 0, 1.6, -0.41);
  k.box(g, 0.38, 0.018, 0.14, steel, 0, 1.65, -0.41);
  k.box(g, 0.36, 0.016, 0.12, gold, 0, 1.551, -0.41);

  // --- Artificial island --------------------------------------------------
  // Kept tight to the footprint so the V-plan stays legible from above.
  k.cylinder(g, 0.41, y0, island, 0, y0 / 2, 0, 0.38, 16);
  k.cylinder(g, 0.38, 0.01, "#ddd4b8", 0, y0, 0, 0.38, 16);
};
