import * as T from "three";
import type { Factory } from "../../kit";

export const shSwfcFactory: Factory = (k, g) => {
  // Shanghai World Financial Center. The plan is a SQUARE the whole way up —
  // it never tapers. What narrows the tower is two arcs slicing off the two
  // opposite corners, taking nothing at the ground and the whole corner by
  // the roof, so the plan runs square -> hexagon -> a thin strip lying on the
  // other diagonal. Everything recognizable follows from that: across the
  // sliced diagonal the tower is a flat-sided slab with a level roof, across
  // the surviving diagonal it is a blade tapering almost to nothing, and the
  // sky portal is cut through the crown of the slab. Model space puts the
  // sliced corners on z and the surviving corners on x, so the plot's front
  // elevation is the slab and its side elevation is the blade.
  const glass = "#7f97a8", // matte blue-grey curtain wall
    mullion = "#cfdae0", // bright metal arrises, sill and roof trim
    band = "#54707f", // recessed equipment floors
    podium = "#bdbcae";

  const base = 0.055, // stone podium skirt the tower stands on
    height = 2.17, // roof lands at 2.225: above Jin Mao, below Shanghai Tower
    R = 0.35, // half-diagonal — the slab elevation is 2R wide at every level
    eaten = 0.82; // share of the corner the slices have taken by the roof

  // How much of the sliced corner survives at height t. A circular arc of the
  // radius involved is a parabola to well inside a pixel over this sweep, and
  // a quadratic is what the measured silhouette actually fits, with the
  // parabola vertex at ground level — the slice opens from nothing, tangent
  // to the corner, and bites hardest at the crown.
  const halfD = (t: number) => R * (1 - eaten * t * t);

  // Cross-section at height t: the square |x| + |z| <= R with its two z
  // corners sliced back to |z| <= h. Wound clockwise in (x, z) so the lofted
  // faces end up pointing outward.
  const hexagon = (t: number): number[][] => {
    const h = halfD(t),
      w = R - h;
    return [
      [R, 0],
      [w, -h],
      [-w, -h],
      [-R, 0],
      [-w, h],
      [w, h],
    ];
  };
  // One crown leg: the same section clipped to the outer side of a jamb.
  // Kept at a fixed five vertices (collapsing harmlessly once the jamb sits
  // outboard of the slice) so consecutive rings always loft cleanly.
  const leg = (t: number, side: number, j: number): number[][] => {
    const h = halfD(t),
      xk = Math.max(R - h, j),
      zk = Math.min(h, R - xk),
      zj = Math.min(h, R - j);
    const half = [
      [R, 0],
      [xk, -zk],
      [j, -zj],
      [j, zj],
      [xk, zk],
    ];
    // Mirroring x flips the winding, so the -x leg walks the loop backwards.
    return side > 0 ? half : half.map(([x, z]) => [-x, z]).reverse();
  };

  // The sky portal. Its jambs are the slivers left either side of the hole,
  // and they taper to a point at the surviving corners — thin blades, as in
  // the crown photographs. The opening widens as it rises, so the jamb sits
  // further out at the sill than at the head.
  const sill = 0.851,
    head = 0.952,
    jamb = (t: number) => R * (0.72 - ((t - sill) / (head - sill)) * 0.1);

  const at = (p: number[], t: number, out = 0) => {
    const scale = out === 0 ? 1 : 1 + out / R;
    return [p[0] * scale, base + height * t, p[1] * scale];
  };

  const wall: number[] = [];
  // Loft a stack of same-sized rings into a closed solid.
  const shell = (
    t0: number,
    t1: number,
    section: (t: number) => number[][],
    steps: number,
  ) => {
    const ring = (t: number) => section(t).map((p) => at(p, t));
    const cap = (r: number[][], t: number, up: boolean) => {
      const c = at([0, 0], t);
      for (let e = 0; e < r.length; e++) {
        const a = r[e],
          b = r[(e + 1) % r.length];
        wall.push(...c, ...(up ? a : b), ...(up ? b : a));
      }
    };
    let prev = ring(t0);
    cap(prev, t0, false);
    for (let i = 1; i <= steps; i++) {
      const t = t0 + ((t1 - t0) * i) / steps;
      const cur = ring(t);
      for (let e = 0; e < prev.length; e++) {
        const n = (e + 1) % prev.length;
        wall.push(...prev[e], ...prev[n], ...cur[n]);
        wall.push(...prev[e], ...cur[n], ...cur[e]);
      }
      prev = cur;
    }
    cap(prev, t1, true);
  };

  // Shaft to the sill; enough levels that the slice reads as a swept curve
  // under flat shading rather than a stack of setbacks.
  shell(0, sill, hexagon, 26);
  // The two crown legs either side of the portal.
  for (const side of [-1, 1])
    shell(sill, head, (t) => leg(t, side, jamb(t)), 5);
  // The head beam over the opening — the deep 94–101F band that carries the
  // Sky Walk — closed underneath so the soffit reads through the portal.
  shell(head, 1, hexagon, 4);

  const geometry = k.geometry("sh-swfc:sliced-prism", () => {
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(wall, 3));
    geo.computeVertexNormals();
    return geo;
  });
  k.mesh(g, geometry, glass);

  // A thin ring hugging the shell — fine floor lines, the recessed equipment
  // zones, and the bright sill, portal head and roof trims all use it.
  const belt = (t: number, thickness: number, color: string, out: number) => {
    const half = thickness / height / 2;
    const lo = Math.max(0, t - half),
      hi = Math.min(1, t + half);
    const a = hexagon(lo),
      b = hexagon(hi);
    const positions: number[] = [];
    for (let e = 0; e < a.length; e++) {
      const n = (e + 1) % a.length;
      positions.push(
        ...at(a[e], lo, out),
        ...at(a[n], lo, out),
        ...at(b[n], hi, out),
        ...at(a[e], lo, out),
        ...at(b[n], hi, out),
        ...at(b[e], hi, out),
      );
    }
    const geo = k.geometry(`sh-swfc:belt:${t}:${thickness}:${out}`, () => {
      const result = new T.BufferGeometry();
      result.setAttribute(
        "position",
        new T.Float32BufferAttribute(positions, 3),
      );
      result.computeVertexNormals();
      return result;
    });
    k.mesh(g, geo, color);
  };

  // Floor lines: a quiet horizontal grain, kept subordinate to the arrises.
  for (let floor = 1; floor < 22; floor++)
    belt((floor / 22) * sill, 0.005, "#8fa8b6", 0.001);
  // Three recessed equipment zones, each a dark double line, at the heights
  // measured off the elevation photograph.
  for (const t of [0.2, 0.45, 0.7])
    for (const d of [-0.013, 0.013]) belt(t + d, 0.016, band, 0.0025);

  // Bright metal arrises. Two kinds, and the difference is the whole point:
  // the surviving corners are dead-straight verticals the full height, while
  // the slice edges sweep out from the foot of the slab to its top corners —
  // the long diagonals that cross the facade in every photograph.
  const fin = (
    plan: (t: number) => number[],
    t0: number,
    t1: number,
    width: number,
  ) => {
    const steps = Math.max(1, Math.round((t1 - t0) * 26));
    const sample = (t: number) => at(plan(t), t, 0.002);
    for (let i = 0; i < steps; i++)
      k.beam(
        g,
        sample(t0 + ((t1 - t0) * i) / steps),
        sample(t0 + ((t1 - t0) * (i + 1)) / steps),
        width,
        mullion,
      );
  };
  for (const sx of [-1, 1]) {
    fin(() => [sx * R, 0], 0, 1, 0.014); // surviving corner
    for (const sz of [-1, 1]) {
      fin((t) => [sx * (R - halfD(t)), sz * halfD(t)], 0, 1, 0.012); // slice edge
      // Grouped mullions. A real mullion stands at a fixed place in plan, so
      // one at |x| = c simply follows the section boundary there: it rides
      // the square face while the slice is still outboard of it, then bends
      // onto the slice face where the two meet. Fractions of face width
      // instead would fan into a spider web as the faces change size.
      for (const f of [0.3, 0.68])
        fin(
          (t) => [sx * f * R, sz * Math.min(halfD(t), R - f * R)],
          0,
          sill,
          0.007,
        );
      // The jamb edges either side of the portal follow the trapezoid slope.
      fin(
        (t) => [sx * jamb(t), sz * Math.min(halfD(t), R - jamb(t))],
        sill,
        head,
        0.009,
      );
    }
  }

  // Sill, portal head and roof trim: the three horizontal lines that make the
  // crown read as a frame around a genuine hole.
  belt(sill, 0.016, mullion, 0.003);
  belt(head, 0.014, mullion, 0.003);
  belt(1, 0.012, mullion, 0.003);

  // Low podium skirt. The upper step turns with the tower so it reads as the
  // tower's own base rather than a stray plate crossing the diamond plan.
  k.box(g, 0.92, base, 0.9, podium, 0, base / 2);
  k.box(g, 0.53, 0.03, 0.53, podium, 0, base + 0.015).rotation.y = Math.PI / 4;
};
