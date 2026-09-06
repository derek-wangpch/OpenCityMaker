import type { Factory } from "../../kit";
import * as T from "three";

export const syOperaFactory: Factory = (k, parent) => {
  const g = new T.Group();
  g.rotation.y = Math.PI;
  parent.add(g);
  const stone = "#c2a989",
    tile = "#f1eddb",
    glass = "#526c70";
  // The upper podium stops at the stair head; treads must remain exposed.
  k.box(g, 1.38, 0.06, 1.45, stone, 0, 0.03);
  k.box(g, 1.38, 0.12, 1.12, stone, 0, 0.12, -0.165);
  for (let i = 0; i < 6; i++) {
    const height = 0.06 + (i + 1) * 0.02;
    k.box(
      g,
      1.16,
      height,
      0.055,
      "#d5c09e",
      0.08,
      height / 2,
      0.6975 - i * 0.055,
    );
  }
  // A shallow, continuous side foyer grounds the roofs on the granite podium.
  for (const x of [-0.31, 0.32])
    k.box(g, 0.43, 0.055, 0.94, glass, x, 0.2075, -0.07);

  // Two parallel auditoriums: each roof is a vault with two curved sides,
  // meeting at a pointed ridge, rather than a freestanding leaf-shaped sail.
  const shell = (
    x: number,
    z: number,
    w: number,
    h: number,
    d: number,
    direction = 1,
  ) => {
    const point = (t: number, u: number, inner = false): number[] => {
      const sweep = Math.sin(t * 1.12) / Math.sin(1.12);
      return [
        x + u * w * sweep,
        0.235 +
          (h * sweep * Math.sqrt(1 - (0.35 + 0.65 * Math.abs(u)) ** 2)) /
            Math.sqrt(1 - 0.35 ** 2) -
          (inner ? 0.023 : 0),
        -(
          z +
          direction *
            (d * ((1 - Math.cos(t * 1.12)) / (1 - Math.cos(1.12)) - 0.5) +
              0.07 * sweep * (1 - u * u))
        ),
      ];
    };
    const geo = k.geometry(
      `sy-opera-vault:${x}:${z}:${w}:${h}:${d}:${direction}`,
      () => {
        const p: number[] = [];
        const tri = (a: number[], b: number[], c: number[]) =>
          direction === 1 ? p.push(...a, ...c, ...b) : p.push(...a, ...b, ...c);
        const quad = (a: number[], b: number[], c: number[], e: number[]) => {
          tri(a, b, c);
          tri(c, b, e);
        };
        for (let i = 0; i < 14; i++)
          for (let j = 0; j < 16; j++) {
            const t = i / 14,
              next = (i + 1) / 14,
              u = j / 8 - 1,
              v = (j + 1) / 8 - 1;
            quad(point(t, u), point(next, u), point(t, v), point(next, v));
            quad(
              point(t, v, true),
              point(next, v, true),
              point(t, u, true),
              point(next, u, true),
            );
          }
        // Close the exposed arch and both eaves with a genuine thickness.
        for (let j = 0; j < 16; j++) {
          const u = j / 8 - 1,
            v = (j + 1) / 8 - 1;
          quad(point(1, u), point(1, u, true), point(1, v), point(1, v, true));
        }
        for (const u of [-1, 1])
          for (let i = 0; i < 14; i++)
            quad(
              point(i / 14, u),
              point(i / 14, u, true),
              point((i + 1) / 14, u),
              point((i + 1) / 14, u, true),
            );
        const a = new T.BufferGeometry();
        a.setAttribute("position", new T.Float32BufferAttribute(p, 3));
        a.computeVertexNormals();
        return a;
      },
    );
    k.mesh(g, geo, tile);
    // Recessed glazing closes the vaulted end; bronze mullions fan to the arch.
    const facade = k.geometry(
      `sy-opera-glass:${x}:${z}:${w}:${h}:${d}:${direction}`,
      () => {
        const p: number[] = [];
        const panel = (a: number[], b: number[], c: number[]) => {
          if (direction === -1) p.push(...a, ...b, ...c);
          else p.push(...a, ...c, ...b);
        };
        for (let j = 0; j < 16; j++) {
          const a = point(0.965, j / 8 - 1, true),
            b = point(0.965, (j + 1) / 8 - 1, true);
          const lower = (v: number[]) => [
            v[0],
            0.205,
            v[2] - direction * 0.035,
          ];
          const knee = (v: number[]) => [
            v[0],
            0.205 + (v[1] - 0.205) * 0.3,
            v[2] - direction * 0.025,
          ];
          const c = knee(a),
            e = knee(b),
            f = lower(a),
            h = lower(b);
          panel(a, c, b);
          panel(b, c, e);
          panel(c, f, e);
          panel(e, f, h);
        }
        const a = new T.BufferGeometry();
        a.setAttribute("position", new T.Float32BufferAttribute(p, 3));
        a.computeVertexNormals();
        return a;
      },
    );
    k.mesh(g, facade, glass);
    for (const u of [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]) {
      const a = point(0.965, u, true);
      const knee = [
        a[0],
        0.205 + (a[1] - 0.205) * 0.3,
        a[2] - direction * 0.025,
      ];
      k.beam(
        g,
        [a[0], 0.205, a[2] - direction * 0.035],
        knee,
        0.009,
        "#ad9d80",
      );
      k.beam(g, knee, a, 0.009, "#ad9d80");
    }

    // Restrained tile seams follow the roof's compound curvature.
    for (const u of [-0.55, 0, 0.55])
      for (let i = 1; i < 14; i++)
        k.beam(g, point(i / 14, u), point((i + 1) / 14, u), 0.006, "#dad6c6");
  };
  // A larger concert hall and a slightly shorter, staggered opera hall.
  shell(-0.31, -0.3, 0.29, 0.84, 0.53);
  shell(-0.31, 0.03, 0.28, 0.69, 0.49);
  shell(-0.31, 0.32, 0.25, 0.44, 0.39);
  shell(0.32, -0.2, 0.25, 0.7, 0.48);
  shell(0.32, 0.12, 0.24, 0.55, 0.45);
  shell(0.32, 0.4, 0.2, 0.32, 0.3);
  // Smaller reverse-facing shells face the monumental steps.
  shell(-0.31, -0.46, 0.22, 0.43, 0.32, -1);
  shell(0.32, -0.35, 0.2, 0.35, 0.29, -1);
  // Separate Bennelong restaurant shell pair, subordinate to both halls.
  shell(-0.49, -0.54, 0.13, 0.23, 0.19, -1);
  shell(-0.49, -0.42, 0.13, 0.2, 0.17);
};
