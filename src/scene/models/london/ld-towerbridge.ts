import type { Factory } from "../../kit";
import * as T from "three";
import { arch } from "../../architecture";
export const ldTowerbridgeFactory: Factory = (k, g) => {
  k.box(g, 1.56, 0.035, 0.98, "#92afb1", 0, 0.018);
  // X is the road axis. Both towers have an actual through passage.
  k.box(g, 1.56, 0.055, 0.31, "#a1a79c", 0, 0.25);
  k.box(g, 0.012, 0.006, 0.31, "#637677", 0, 0.281);
  for (const x of [-0.4, 0.4]) {
    k.box(g, 0.36, 0.15, 0.63, "#b4ae97", x, 0.13);
    const tower = new T.Group();
    tower.position.x = x;
    tower.rotation.y = Math.PI / 2;
    g.add(tower);
    arch(k, tower, 0.5, 0.52, 0.29, "#c5b99a", 0, 0.27);
    k.box(g, 0.29, 0.35, 0.5, "#c5b99a", x, 0.955);
    for (const dx of [-0.115, 0.115])
      for (const z of [-0.23, 0.23]) {
        k.box(g, 0.085, 0.91, 0.085, "#d9ceb0", x + dx, 0.74, z);
        k.cylinder(
          g,
          0.072,
          0.18,
          "#728b91",
          x + dx,
          1.285,
          z,
          0,
          4,
        ).rotation.y = Math.PI / 4;
        k.cylinder(g, 0.011, 0.06, "#b7ac87", x + dx, 1.4, z);
      }
    k.box(g, 0.34, 0.065, 0.56, "#d9ceb0", x, 1.15);
    k.cylinder(g, 0.2, 0.26, "#728b91", x, 1.31, 0, 0.025, 4).rotation.y =
      Math.PI / 4;
    for (const z of [-0.258, 0.258])
      for (const dx of [-0.065, 0.065])
        k.box(g, 0.045, 0.16, 0.014, "#567580", x + dx, 0.98, z);
  }
  for (const z of [-0.2, 0.2]) {
    for (const y of [0.91, 1.035])
      k.box(g, 0.8, 0.025, 0.06, "#7da8b3", 0, y, z);
    for (let i = -3; i <= 2; i++) {
      k.beam(
        g,
        [i * 0.12, 0.92, z],
        [i * 0.12 + 0.12, 1.025, z],
        0.016,
        "#789ea8",
      );
      k.beam(
        g,
        [i * 0.12, 1.025, z],
        [i * 0.12 + 0.12, 0.92, z],
        0.012,
        "#d1dad3",
      );
    }
    for (const side of [-1, 1]) {
      const point = (t: number) => [
        side * (0.4 + 0.37 * t),
        0.3 + 0.63 * (1 - t) ** 2,
        z,
      ];
      for (let i = 0; i < 6; i++) {
        k.beam(g, point(i / 6), point((i + 1) / 6), 0.032, "#73a4b2");
        const p = point((i + 1) / 6);
        k.beam(g, [p[0], 0.29, z], p, 0.012, "#d1dad3");
      }
    }
    k.box(g, 1.54, 0.025, 0.025, "#73a4b2", 0, 0.33, z);
  }
};
