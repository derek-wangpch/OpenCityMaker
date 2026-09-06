import * as T from "three";
import type { Factory } from "../../kit";
import { arch, gable, loft, ring } from "../../architecture";

const stone = "#d2c4a6";
const stoneLight = "#e6d8b8";
const shade = "#b3a58c";
const roof = "#6a7678";
const glass = "#5a6a6e";
const lead = "#546062";

export const paNotredameFactory: Factory = (k, g) => {
  // +z = west parvis facade. −z = east chevet. +x = south.
  // Real 127 × 48 m is compressed on the long axis; facade width
  // and the 69 m / 96 m heights stay independent.
  const facadeW = 1.0;
  const naveW = 0.5;
  const aisleW = 0.76;
  const naveH = 0.6;
  const aisleH = 0.36;
  const roofH = 0.34;
  const westZ = 0.55;
  const crossZ = -0.18;
  const chevetZ = -0.42;
  const towerW = 0.34;
  const towerD = 0.26;
  const towerH = 1.5;
  const towerX = 0.33;
  const towerZ = westZ - towerD / 2;

  // Double-aisle body — the chapel line is almost as wide as the transept.
  k.box(g, aisleW, aisleH, 1.08, stone, 0, aisleH / 2, -0.02);
  k.box(g, naveW, naveH, 1.06, stone, 0, naveH / 2, -0.02);
  k.box(g, aisleW + 0.04, 0.03, 1.1, stoneLight, 0, aisleH + 0.01, -0.02);

  // Rounded chevet and lower ambulatory (radiating chapels).
  k.cylinder(g, 0.28, naveH, stone, 0, naveH / 2, chevetZ, 0.28, 14);
  k.cylinder(g, 0.36, aisleH, stone, 0, aisleH / 2, chevetZ, 0.36, 14);

  // Shallow transept arms — they barely clear the aisle line.
  k.box(g, 0.88, naveH, 0.24, stone, 0, naveH / 2, crossZ);
  k.box(g, 0.92, 0.03, 0.28, stoneLight, 0, naveH + 0.01, crossZ);

  // West wall that carries the rose, between the two tower masses.
  k.box(g, facadeW, 0.84, 0.14, stone, 0, 0.42, westZ - 0.05);
  // Four buttress strips of the harmonic facade, rising into the tower corners.
  for (const x of [-0.49, -0.165, 0.165, 0.49])
    k.box(g, 0.055, 0.84, 0.08, stoneLight, x, 0.42, westZ - 0.02);

  // Twin unfinished square towers — flat lead terraces, never given spires.
  for (const x of [-towerX, towerX]) {
    k.box(g, towerW, towerH, towerD, stone, x, towerH / 2, towerZ);
    k.box(g, towerW + 0.04, 0.03, towerD + 0.04, stoneLight, x, 0.84, towerZ);
    k.box(
      g,
      towerW + 0.03,
      0.025,
      towerD + 0.03,
      stoneLight,
      x,
      towerH,
      towerZ,
    );
    for (const [dx, dz] of [
      [0, towerD / 2 + 0.012],
      [0, -towerD / 2 - 0.012],
      [towerW / 2 + 0.012, 0],
      [-towerW / 2 - 0.012, 0],
    ] as const)
      k.box(
        g,
        dx ? 0.012 : towerW * 0.72,
        0.055,
        dz ? 0.012 : towerD * 0.72,
        stoneLight,
        x + dx,
        towerH + 0.03,
        towerZ + dz,
      );
    for (const dx of [-0.065, 0.065])
      k.box(g, 0.075, 0.4, 0.02, glass, x + dx, 1.14, westZ + 0.01);
    k.box(
      g,
      0.02,
      0.4,
      0.1,
      glass,
      x + Math.sign(x) * (towerW / 2 + 0.01),
      1.14,
      towerZ,
    );
  }

  // Steep lead nave / choir roof. Transept gable is rotated onto the N–S axis.
  gable(k, g, naveW + 0.08, 1.08, roofH, roof, 0, naveH, -0.02);
  const arm = new T.Group();
  arm.position.z = crossZ;
  arm.rotation.y = Math.PI / 2;
  g.add(arm);
  gable(k, arm, 0.3, 0.9, 0.3, roof, 0, naveH);
  k.cylinder(
    g,
    0.26,
    roofH * 0.45,
    roof,
    0,
    naveH + roofH * 0.22,
    chevetZ,
    0.04,
    12,
  );

  // Crossing flèche — chunky octagonal shaft, then the 96 m needle.
  const ridgeY = naveH + roofH;
  const oct = (r: number): [number, number][] =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4 + Math.PI / 8;
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
  k.box(g, 0.16, 0.08, 0.16, lead, 0, ridgeY + 0.03, crossZ);
  const fleche = new T.Group();
  fleche.position.z = crossZ;
  g.add(fleche);
  loft(
    k,
    fleche,
    "pa-nd-fleche",
    [
      { y: ridgeY + 0.06, points: oct(0.1) },
      { y: ridgeY + 0.28, points: oct(0.09) },
      { y: ridgeY + 0.5, points: oct(0.078) },
      { y: ridgeY + 0.62, points: oct(0.04) },
      { y: ridgeY + 1.05, points: oct(0.012) },
      { y: ridgeY + 1.28, points: oct(0.002) },
    ],
    lead,
  );
  k.box(g, 0.05, 0.012, 0.012, lead, 0, ridgeY + 1.32, crossZ);
  k.box(g, 0.012, 0.055, 0.012, lead, 0, ridgeY + 1.35, crossZ);

  // Flying buttresses sit in the open nave, then radiate around the chevet.
  for (const z of [0.2, 0.04, -0.38]) {
    for (const side of [-1, 1]) {
      const pierX = side * 0.62;
      const pierH = 0.58;
      k.box(g, 0.085, pierH, 0.09, stone, pierX, pierH / 2, z);
      k.box(g, 0.055, 0.1, 0.055, stoneLight, pierX, pierH + 0.04, z);
      k.beam(
        g,
        [pierX, pierH - 0.04, z],
        [side * (naveW / 2 + 0.03), naveH + 0.1, z],
        0.04,
        stoneLight,
      );
    }
  }
  for (let i = -2; i <= 2; i++) {
    const a = Math.PI + (i * Math.PI) / 6;
    const reach = 0.36;
    const pierX = Math.sin(a) * reach;
    const pierZ = chevetZ + Math.cos(a) * reach;
    const wallX = Math.sin(a) * 0.26;
    const wallZ = chevetZ + Math.cos(a) * 0.26;
    k.box(g, 0.07, aisleH + 0.1, 0.07, stone, pierX, (aisleH + 0.1) / 2, pierZ);
    k.beam(
      g,
      [pierX, aisleH + 0.12, pierZ],
      [wallX, naveH + 0.03, wallZ],
      0.03,
      stoneLight,
    );
  }

  // West portals — centre Last Judgment is the widest.
  arch(k, g, 0.24, 0.3, 0.055, stoneLight, 0, 0.02, westZ + 0.03);
  k.box(g, 0.11, 0.16, 0.016, shade, 0, 0.12, westZ + 0.045);
  for (const x of [-0.32, 0.32]) {
    arch(k, g, 0.19, 0.26, 0.05, stoneLight, x, 0.02, westZ + 0.03);
    k.box(g, 0.085, 0.13, 0.016, shade, x, 0.11, westZ + 0.045);
  }

  // Gallery of Kings — a statue band, not twenty-eight figures.
  k.box(g, facadeW + 0.02, 0.05, 0.07, stoneLight, 0, 0.35, westZ + 0.015);
  for (let i = -4; i <= 4; i++)
    k.box(g, 0.05, 0.075, 0.02, shade, i * 0.1, 0.35, westZ + 0.035);

  // West rose and the paired lancets under each tower.
  k.cylinder(g, 0.12, 0.022, glass, 0, 0.6, westZ + 0.03, 0.12, 16).rotation.x =
    Math.PI / 2;
  ring(k, g, 0.12, 0.018, stoneLight, 0, 0.6, westZ + 0.042);
  for (const x of [-towerX, towerX])
    for (const dx of [-0.055, 0.055])
      k.box(g, 0.05, 0.17, 0.016, glass, x + dx, 0.56, westZ + 0.025);

  // Grande galerie — the open colonnade that ties the two towers.
  k.box(g, 0.4, 0.09, 0.06, stoneLight, 0, 0.8, westZ + 0.01);
  for (let i = -3; i <= 3; i++)
    k.box(g, 0.03, 0.075, 0.02, shade, i * 0.052, 0.8, westZ + 0.035);

  // Clerestory lancets — one facade rhythm along the high nave.
  for (const z of [0.2, 0.04, -0.38])
    for (const side of [-1, 1])
      k.box(g, 0.016, 0.13, 0.055, glass, side * (naveW / 2 + 0.01), 0.5, z);

  // South transept rose (the larger of the three roses).
  k.cylinder(g, 0.1, 0.02, glass, 0.45, 0.52, crossZ, 0.1, 16).rotation.z =
    Math.PI / 2;
  ring(k, g, 0.1, 0.015, stoneLight, 0.46, 0.52, crossZ).rotation.y =
    Math.PI / 2;
};
