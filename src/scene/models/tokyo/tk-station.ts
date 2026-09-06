import * as T from "three";
import type { Factory } from "../../kit";
import { dome, arch, openings, loft } from "../../architecture";
export const tkStationFactory: Factory = (k, g) => {
  const brick = "#a95c4d",
    stone = "#e4d5bb",
    roof = "#59636b",
    glass = "#526c7c";
  k.box(g, 1.48, 0.4, 0.43, brick, 0, 0.23);
  openings(k, g, 1.44, 0.35, 0.43, 3, 13, glass, 0, 0.055);
  for (const y of [0.07, 0.19, 0.31, 0.44])
    k.box(g, 1.5, 0.018, 0.45, stone, 0, y);
  // Continuous slate roof across the long wings, with a level ridge along X.
  loft(
    k,
    g,
    "tk-station-roof",
    [
      {
        y: 0.45,
        points: [
          [-0.37, -0.24],
          [0.37, -0.24],
          [0.37, 0.24],
          [-0.37, 0.24],
        ],
      },
      {
        y: 0.57,
        points: [
          [-0.35, -0.11],
          [0.35, -0.11],
          [0.35, 0.11],
          [-0.35, 0.11],
        ],
      },
    ],
    roof,
  );
  for (const x of [-0.55, 0.55]) {
    k.cylinder(g, 0.195, 0.48, brick, x, 0.28, 0, 0.195, 8);
    k.cylinder(g, 0.202, 0.055, stone, x, 0.515, 0, 0.202, 8);
    k.cylinder(g, 0.18, 0.1, stone, x, 0.59, 0, 0.18, 8);
    dome(k, g, 0.215, 0.17, roof, x, 0.64);
    k.cylinder(g, 0.035, 0.065, stone, x, 0.825, 0, 0.028, 8);
    k.cylinder(g, 0.022, 0.07, roof, x, 0.885, 0, 0.005, 8);
    k.box(g, 0.12, 0.18, 0.022, glass, x, 0.18, 0.19);
    arch(k, g, 0.16, 0.21, 0.035, stone, x, 0.08, 0.212);
    for (const z of [-0.12, 0, 0.12])
      k.box(g, 0.015, 0.07, 0.036, glass, x + 0.183, 0.59, z);
  }
  k.box(g, 0.28, 0.54, 0.49, brick, 0, 0.3);
  for (const x of [-0.145, 0.145]) k.box(g, 0.045, 0.57, 0.51, stone, x, 0.315);
  arch(k, g, 0.23, 0.19, 0.075, stone, 0, 0.05, 0.3);
  // Round-headed central pediment; deliberately enlarged at tier 7.
  const pediment = k.geometry("tk-station-pediment", () => {
    const shape = new T.Shape();
    shape.moveTo(-0.15, 0);
    shape.absarc(0, 0, 0.15, Math.PI, 0, true);
    shape.closePath();
    return new T.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: false,
      curveSegments: 10,
    });
  });
  k.mesh(g, pediment, brick, 0, 0.57, 0.2);
  arch(k, g, 0.33, 0.19, 0.035, roof, 0, 0.54, 0.285);
  const medallion = k.cylinder(
    g,
    0.035,
    0.018,
    stone,
    0,
    0.64,
    0.278,
    0.035,
    12,
  );
  medallion.rotation.x = Math.PI / 2;
};
