import * as T from "three";
import type { Factory } from "../../kit";
import { openings } from "../../architecture";

// Tier 8: seven square-plan sunburst shells, not concentric round domes.
// Each face is sampled from the same arch for its steel, edge and windows.
export const nyChryslerFactory: Factory = (k, g) => {
  const stone = "#c6c2ad",
    glass = "#617780",
    steel = "#c2cfce";
  for (const [w, d, y, h] of [
    [0.82, 0.72, 0, 0.25],
    [0.7, 0.6, 0.25, 0.2],
    [0.55, 0.48, 0.45, 0.77],
    [0.45, 0.4, 1.22, 0.23],
  ]) {
    k.box(g, w, h, d, stone, 0, y + h / 2);
    openings(k, g, w, h, d, h > 0.5 ? 5 : 1, 4, glass, 0, y);
    const rows = h > 0.5 ? 5 : 1;
    for (const side of [-1, 1])
      for (const z of [-d * 0.28, 0, d * 0.28])
        for (let row = 0; row < rows; row++)
          k.box(
            g,
            0.014,
            (h / rows) * 0.5,
            0.055,
            glass,
            side * (w / 2 + 0.004),
            y + ((row + 0.6) * h) / rows,
            z,
          );
    k.box(g, w + 0.024, 0.025, d + 0.024, steel, 0, y + h);
  }
  // Grouped dark shoulder band and four enlarged eagle/hood ornaments.
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      k.beam(
        g,
        [sx * 0.24, 1.24, sz * 0.21],
        [sx * 0.35, 1.28, sz * 0.29],
        0.052,
        steel,
      );
      k.box(g, 0.07, 0.035, 0.065, steel, sx * 0.35, 1.29, sz * 0.29);
    }
  const sample = (tier: number, u: number): T.Vector3 => {
    const r = 0.255 - tier * 0.034;
    return new T.Vector3(
      u * r,
      1.38 + tier * 0.108 + 0.28 * Math.sqrt(Math.max(0, 1 - u * u)),
      r,
    );
  };
  for (let tier = 0; tier < 7; tier++) {
    for (let side = 0; side < 4; side++) {
      const face = new T.Group();
      face.rotation.y = (side * Math.PI) / 2;
      g.add(face);
      if (tier === 0) {
        const cap = k.geometry("ny-chrysler-crown-masonry", () => {
          const shape = new T.Shape();
          shape.moveTo(-0.255, 1.38);
          shape.lineTo(0.255, 1.38);
          for (let j = 12; j >= 0; j--) {
            const p = sample(0, -1 + j / 6);
            shape.lineTo(p.x, p.y);
          }
          shape.closePath();
          return new T.ShapeGeometry(shape);
        });
        k.mesh(face, cap, stone, 0, 0, 0.254);
        for (const x of [-0.12, 0, 0.12])
          k.box(face, 0.034, 0.085, 0.013, glass, x, 1.49, 0.259);
      }
      const positions: number[] = [];
      const tri = (a: T.Vector3, b: T.Vector3, c: T.Vector3) =>
        positions.push(...a.toArray(), ...b.toArray(), ...c.toArray());
      for (let i = 0; i < 12; i++) {
        const u = -1 + i / 6,
          v = u + 1 / 6;
        const a = sample(tier, u),
          b = sample(tier, v);
        const c = sample(tier + 1, u),
          d = sample(tier + 1, v);
        tri(a, b, c);
        tri(b, d, c);
        k.beam(face, a.toArray(), b.toArray(), 0.013, "#e0e4da");
      }
      const geometry = k.geometry(`ny-chrysler-shell:${tier}`, () => {
        const geo = new T.BufferGeometry();
        geo.setAttribute(
          "position",
          new T.Float32BufferAttribute(positions, 3),
        );
        geo.computeVertexNormals();
        return geo;
      });
      k.mesh(face, geometry, steel);
      // Dark triangular sunbursts lie on the sloped shell, above its arch edge.
      for (const u of tier < 4 ? [-0.56, 0, 0.56] : [0]) {
        const a = sample(tier, u - 0.14),
          b = sample(tier, u + 0.14);
        const c = sample(tier + 1, u).lerp(sample(tier, u), 0.2);
        a.lerp(sample(tier + 1, u - 0.14), 0.13);
        b.lerp(sample(tier + 1, u + 0.14), 0.13);
        const geo = k.geometry(`ny-chrysler-sunburst:${tier}:${u}`, () => {
          const geo = new T.BufferGeometry();
          geo.setAttribute(
            "position",
            new T.Float32BufferAttribute(
              [a, b, c].flatMap((p) => [p.x, p.y + 0.006, p.z + 0.004]),
              3,
            ),
          );
          geo.computeVertexNormals();
          return geo;
        });
        k.mesh(face, geo, glass);
      }
    }
  }
  k.cylinder(g, 0.025, 0.16, steel, 0, 2.39, 0, 0.012, 8);
  k.cylinder(g, 0.012, 0.14, "#e0e4da", 0, 2.54, 0, 0.002, 8);
};
