import { Group } from "three";
import type { Factory } from "../../kit";
import { dome } from "../../architecture";

export const hkClockFactory: Factory = (k, g) => {
  const stone = "#e7d8bc",
    brick = "#b97657",
    dark = "#53625e";
  k.box(g, 0.72, 0.1, 0.66, stone);
  k.box(g, 0.44, 1.25, 0.44, brick, 0, 0.725);
  for (const x of [-0.19, 0.19])
    for (const z of [-0.19, 0.19])
      k.box(g, 0.064, 1.28, 0.064, stone, x, 0.73, z);
  k.box(g, 0.54, 0.075, 0.54, stone, 0, 1.39);
  k.box(g, 0.37, 0.12, 0.37, brick, 0, 1.48);
  // Octagonal lantern, pale supports and a rounded concrete dome, not a tiled roof.
  k.cylinder(g, 0.17, 0.23, dark, 0, 1.65, 0, 0.17, 8);
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4;
    k.box(
      g,
      0.035,
      0.26,
      0.035,
      stone,
      0.17 * Math.cos(a),
      1.66,
      0.17 * Math.sin(a),
    );
  }
  k.cylinder(g, 0.21, 0.045, stone, 0, 1.795, 0, 0.21, 8);
  dome(k, g, 0.195, 0.15, stone, 0, 1.82);
  k.cylinder(g, 0.012, 0.22, dark, 0, 2.065);
  for (let side = 0; side < 4; side++) {
    const face = new Group();
    face.rotation.y = (side * Math.PI) / 2;
    g.add(face);
    const clock = k.cylinder(face, 0.12, 0.016, stone, 0, 1.17, 0.227);
    clock.rotation.x = Math.PI / 2;
    const dial = k.cylinder(face, 0.097, 0.018, dark, 0, 1.17, 0.239);
    dial.rotation.x = Math.PI / 2;
    k.box(face, 0.012, 0.07, 0.012, stone, 0, 1.199, 0.253);
    k.box(face, 0.064, 0.012, 0.012, stone, 0.025, 1.17, 0.253);
    for (const [x, y] of [
      [0, 0.079],
      [0, -0.079],
      [-0.079, 0],
      [0.079, 0],
    ])
      k.box(face, 0.015, 0.015, 0.012, stone, x, 1.17 + y, 0.253);
    // A few tall recessed-looking windows replace a blank brick shaft.
    for (const y of [0.34, 0.77]) {
      k.box(face, 0.16, 0.25, 0.025, stone, 0, y, 0.228);
      k.box(face, 0.115, 0.205, 0.02, dark, 0, y, 0.245);
    }
    for (const x of [-0.105, 0, 0.105])
      k.box(face, 0.06, 0.07, 0.02, dark, x, 1.31, 0.228);
  }
};
