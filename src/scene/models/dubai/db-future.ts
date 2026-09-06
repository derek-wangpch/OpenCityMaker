import * as T from "three";
import type { Factory } from "../../kit";

/** Tier 7: thick asymmetric oval, an off-centre void and surface-following strokes. */
export const dbFutureFactory: Factory = (k, g) => {
  // A continuous rounded section joins the outer oval to the smaller,
  // elevated hole. Unlike a scaled torus, the top and bottom are not equally thick.
  const point = (a: number, b: number, offset = 0) => {
    const outer = [0.68 * Math.cos(a), 0.77 + 0.48 * Math.sin(a)];
    const inner = [0.07 + 0.34 * Math.cos(a), 0.83 + 0.23 * Math.sin(a)];
    const u = (1 + Math.cos(b)) / 2;
    return new T.Vector3(
      inner[0] + (outer[0] - inner[0]) * u,
      inner[1] + (outer[1] - inner[1]) * u,
      (0.23 + offset) * Math.sin(b),
    );
  };
  const geo = k.geometry("db-future:elliptical-shell", () => {
    const positions: number[] = [],
      indices: number[] = [];
    const around = 64,
      section = 20;
    for (let i = 0; i <= around; i++)
      for (let j = 0; j <= section; j++)
        positions.push(
          ...point(
            (i / around) * Math.PI * 2,
            (j / section) * Math.PI * 2,
          ).toArray(),
        );
    for (let i = 0; i < around; i++)
      for (let j = 0; j < section; j++) {
        const a = i * (section + 1) + j,
          b = a + section + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const result = new T.BufferGeometry();
    result.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  });
  k.mesh(g, geo, "#cbd1cb");
  // Broad linked strokes suggest calligraphic windows; these are abstract
  // motifs, not invented Arabic text. They use the shell's own coordinates.
  for (const face of [1, -1])
    for (const lane of [0.65, 1.8])
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const curve = new T.CatmullRomCurve3([
          point(a - 0.11, face * (lane - 0.3), 0.008),
          point(a - 0.055, face * lane, 0.008),
          point(a + 0.035, face * (lane + 0.35), 0.008),
          point(a + 0.09, face * (lane + 0.05), 0.008),
        ]);
        k.mesh(
          g,
          k.geometry(
            `db-future:stroke:${face}:${lane}:${i}`,
            () => new T.TubeGeometry(curve, 8, 0.01, 4, false),
          ),
          "#61767a",
        );
      }
  // Green hillside meets the underside; a low entrance sits in the slope.
  const mound = k.mesh(
    g,
    k.geometry(
      "db-future:mound",
      () => new T.SphereGeometry(1, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    ),
    "#8f9f70",
  );
  mound.scale.set(0.77, 0.33, 0.55);
  k.box(g, 0.24, 0.075, 0.028, "#657878", 0.24, 0.075, 0.49);
  k.box(g, 0.29, 0.02, 0.11, "#d1cdb7", 0.24, 0.12, 0.49);
};
