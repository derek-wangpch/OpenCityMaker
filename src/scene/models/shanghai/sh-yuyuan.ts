import type { Factory } from "../../kit";
import { TILE, STONE } from "./shared";

export const shYuyuanFactory: Factory = (k, g) => {
  k.box(g, 1.34, 0.03, 1.16, "#7fa3a8", 0, 0.015, 0.1);
  k.box(g, 1.36, 0.05, 0.08, STONE, 0, 0.025, 0.68);
  // Rockery: irregular stacked stones, never a tree cluster.
  for (const [x, y, z, r] of [
    [-0.5, 0.16, 0.24, 0.19],
    [-0.36, 0.28, 0.36, 0.14],
    [-0.58, 0.3, 0.4, 0.11],
  ]) {
    const rock = k.sphere(g, r, "#8d8b83", x, Math.max(y, r * 1.5 + 0.03), z);
    rock.scale.set(r, r * 1.5, r * 0.85);
  }
  // A short zigzag connects the front bank to the pavilion platform.
  // This is a garden vignette, not a surveyed reconstruction of Jiuqu Bridge.
  const path = [
    [0.48, 0.68],
    [0.48, 0.43],
    [0.12, 0.43],
    [0.12, 0.18],
    [-0.16, 0.18],
    [-0.16, -0.2],
  ];
  for (let i = 1; i < path.length; i++) {
    const [x0, z0] = path[i - 1],
      [x1, z1] = path[i];
    k.beam(g, [x0, 0.085, z0], [x1, 0.085, z1], 0.1, STONE);
  }
  // Pavilion with an upturned eave, on the far bank.
  k.box(g, 0.6, 0.06, 0.5, STONE, -0.16, 0.03, -0.42);
  for (const x of [-0.38, 0.06])
    for (const z of [-0.6, -0.24])
      k.cylinder(g, 0.024, 0.36, "#a8493a", x, 0.24, z);
  k.roof(g, 0.68, 0.6, 0.42, 0.22, TILE, -0.16, -0.42);
};
