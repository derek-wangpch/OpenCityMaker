import * as T from "three";
import type { Factory } from "../../kit";
import { arch, dome, gable } from "../../architecture";

const stone = "#d6c6a6";
const stoneLight = "#ead8b6";
const gold = "#d4a84a";
const goldDeep = "#b8903c";
const glass = "#5a6c6f";

export const paInvalidesFactory: Factory = (k, g) => {
  // x = east–west, z = south ceremonial front. The real church is a Greek
  // cross in a nearly square plan; width and depth stay independent.
  const bodyW = 1.12;
  const bodyD = 1.08;
  const bodyH = 0.72;
  const terraceY = bodyH;
  const drum1R = 0.36;
  const drum1H = 0.42;
  const drum1Y = terraceY + 0.04 + drum1H / 2;
  const drum2R = 0.3;
  const drum2H = 0.16;
  const drum2Y = terraceY + 0.04 + drum1H + 0.04 + drum2H / 2;
  const domeR = 0.355;
  const domeH = 0.52;
  const domeBase = terraceY + 0.04 + drum1H + 0.04 + drum2H;

  // Square limestone church. Cornice stays on the wall line so the
  // pediments can rise cleanly; the terrace is only the pad under the drum.
  k.box(g, bodyW, bodyH, bodyD, stone);
  k.box(g, bodyW + 0.025, 0.03, bodyD + 0.025, stoneLight, 0, terraceY - 0.01);
  k.box(g, 0.84, 0.035, 0.84, stone, 0, terraceY + 0.02);

  // Mid-facade cornice of the two superimposed orders.
  k.box(g, bodyW + 0.03, 0.03, bodyD + 0.03, stoneLight, 0, 0.36);

  // Salient south frontispiece: stacked orders, four columns, pediment.
  const frontZ = bodyD / 2 + 0.05;
  k.box(g, 0.56, bodyH, 0.13, stone, 0, bodyH / 2, frontZ);
  k.box(g, 0.6, 0.035, 0.16, stoneLight, 0, 0.37, frontZ + 0.015);
  for (const x of [-0.19, -0.075, 0.075, 0.19]) {
    k.cylinder(g, 0.03, 0.3, stoneLight, x, 0.18, frontZ + 0.085);
    k.box(g, 0.07, 0.03, 0.07, stoneLight, x, 0.34, frontZ + 0.085);
    k.cylinder(g, 0.026, 0.28, stoneLight, x, 0.54, frontZ + 0.085);
    k.box(g, 0.06, 0.025, 0.06, stoneLight, x, 0.69, frontZ + 0.085);
  }
  gable(k, g, 0.6, 0.14, 0.16, stoneLight, 0, bodyH, frontZ + 0.03);
  arch(k, g, 0.17, 0.3, 0.045, goldDeep, 0, 0.04, frontZ + 0.085);
  k.box(g, 0.09, 0.18, 0.018, gold, 0, 0.13, frontZ + 0.09);
  k.box(g, 0.08, 0.12, 0.02, glass, 0, 0.54, frontZ + 0.1);
  k.box(g, 0.64, 0.035, 0.18, stone, 0, 0.018, frontZ + 0.05);
  k.box(g, 0.74, 0.02, 0.24, stoneLight, 0, 0.008, frontZ + 0.09);

  // Shallower east / west pedimented bays — each real facade has a porch.
  for (const side of [-1, 1]) {
    const hold = new T.Group();
    hold.rotation.y = (side * Math.PI) / 2;
    g.add(hold);
    k.box(hold, 0.5, bodyH, 0.1, stone, 0, bodyH / 2, bodyW / 2 + 0.035);
    k.box(hold, 0.54, 0.03, 0.12, stoneLight, 0, 0.37, bodyW / 2 + 0.045);
    gable(k, hold, 0.54, 0.12, 0.16, stoneLight, 0, bodyH, bodyW / 2 + 0.04);
    for (const x of [-0.12, 0.12]) {
      k.cylinder(hold, 0.022, 0.28, stoneLight, x, 0.18, bodyW / 2 + 0.07);
      k.cylinder(hold, 0.02, 0.26, stoneLight, x, 0.52, bodyW / 2 + 0.07);
    }
    k.box(hold, 0.08, 0.16, 0.02, glass, 0, 0.2, bodyW / 2 + 0.08);
    k.box(hold, 0.08, 0.14, 0.02, glass, 0, 0.52, bodyW / 2 + 0.08);
  }

  // Two-row window rhythm on all four faces; south skips the door bay.
  for (const y of [0.2, 0.54]) {
    for (const x of [-0.46, -0.34, 0.34, 0.46])
      k.box(g, 0.07, 0.13, 0.02, glass, x, y, bodyD / 2 + 0.012);
    for (const x of [-0.4, -0.22, 0.22, 0.4])
      k.box(g, 0.07, 0.13, 0.02, glass, x, y, -bodyD / 2 - 0.012);
    for (const z of [-0.46, -0.34, 0.34, 0.46]) {
      k.box(g, 0.02, 0.13, 0.07, glass, bodyW / 2 + 0.012, y, z);
      k.box(g, 0.02, 0.13, 0.07, glass, -bodyW / 2 - 0.012, y, z);
    }
  }

  // Lower drum: the taller tambour storey, paired columns, eight window bays.
  k.cylinder(g, drum1R, drum1H, stone, 0, drum1Y, 0, drum1R, 20);
  k.cylinder(g, drum1R + 0.045, 0.04, stoneLight, 0, drum1Y + drum1H / 2, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const pane = k.box(
      g,
      0.085,
      0.2,
      0.022,
      glass,
      Math.sin(a) * (drum1R + 0.01),
      drum1Y,
      Math.cos(a) * (drum1R + 0.01),
    );
    pane.rotation.y = a;
    for (const da of [-0.05, 0.05]) {
      const ang = a + Math.PI / 8 + da / drum1R;
      k.cylinder(
        g,
        0.022,
        drum1H * 0.86,
        stoneLight,
        Math.sin(ang) * (drum1R + 0.026),
        drum1Y,
        Math.cos(ang) * (drum1R + 0.026),
      );
    }
  }

  // Shorter upper attic of the tambour, set back, with small outer-dome lights.
  k.cylinder(g, drum2R, drum2H, stone, 0, drum2Y, 0, drum2R, 20);
  k.cylinder(g, drum2R + 0.03, 0.035, stoneLight, 0, drum2Y + drum2H / 2, 0);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const pane = k.box(
      g,
      0.05,
      0.07,
      0.016,
      glass,
      Math.sin(a) * (drum2R + 0.006),
      drum2Y,
      Math.cos(a) * (drum2R + 0.006),
    );
    pane.rotation.y = a;
  }

  // Gilded outer dome — twelve ribbed compartments, no trophy relief.
  k.cylinder(g, domeR + 0.015, 0.03, goldDeep, 0, domeBase + 0.01);
  dome(k, g, domeR, domeH, gold, 0, domeBase);
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    let prev: [number, number, number] | undefined;
    for (const t of [0, 0.38, 0.72, 1]) {
      const phi = (1 - t) * (Math.PI / 2);
      const next: [number, number, number] = [
        domeR * Math.sin(phi) * Math.sin(a),
        domeBase + domeH * Math.cos(phi),
        domeR * Math.sin(phi) * Math.cos(a),
      ];
      if (prev) k.beam(g, prev, next, 0.016, goldDeep);
      prev = next;
    }
  }

  // Diagonal gilt lantern, fleur-de-lis needle, orb and cross.
  const lantern = new T.Group();
  lantern.position.set(0, domeBase + domeH, 0);
  lantern.rotation.y = Math.PI / 4;
  g.add(lantern);
  k.cylinder(g, 0.055, 0.03, goldDeep, 0, domeBase + domeH + 0.01);
  k.box(lantern, 0.1, 0.12, 0.1, gold, 0, 0.075);
  for (const x of [-0.052, 0.052])
    k.box(lantern, 0.018, 0.07, 0.018, glass, x, 0.075);
  for (const z of [-0.052, 0.052])
    k.box(lantern, 0.018, 0.07, 0.018, glass, 0, 0.075, z);
  k.cylinder(g, 0.028, 0.05, gold, 0, domeBase + domeH + 0.155, 0, 0.012, 8);
  k.cylinder(g, 0.012, 0.3, gold, 0, domeBase + domeH + 0.34, 0, 0.004, 8);
  k.sphere(g, 0.02, goldDeep, 0, domeBase + domeH + 0.5, 0);
  k.box(g, 0.055, 0.012, 0.012, gold, 0, domeBase + domeH + 0.54);
  k.box(g, 0.012, 0.07, 0.012, gold, 0, domeBase + domeH + 0.57);
};
