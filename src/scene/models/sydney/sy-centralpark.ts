import type { Factory } from "../../kit";

export const syCentralparkFactory: Factory = (k, g) => {
  const glass = "#78989a",
    trim = "#d0d0bd",
    steel = "#596d70";
  k.box(g, 1.3, 0.2, 0.86, glass, 0, 0.1).name = "podium";
  k.box(g, 1.34, 0.035, 0.9, trim, 0, 0.2175);
  k.box(g, 0.2, 0.14, 0.02, steel, -0.05, 0.07, 0.438);
  for (const x of [-0.5, -0.28, 0.2, 0.44])
    k.box(g, 0.018, 0.18, 0.018, trim, x, 0.1, 0.44);
  for (const [x, roof, width] of [
    [-0.39, 1.04, 0.46],
    [0.33, 1.72, 0.5],
  ]) {
    k.box(g, width, roof - 0.23, 0.64, glass, x, (roof + 0.23) / 2).name =
      "tower";
    k.box(g, width + 0.04, 0.025, 0.7, trim, x, roof);
  }
  // Group floors into broad balcony rhythms instead of apartment-sized grids.
  for (const [x, roof, width, rows] of [
    [-0.39, 1.04, 0.46, 4],
    [0.33, 1.72, 0.5, 7],
  ]) {
    for (let row = 0; row < rows; row++) {
      const y = 0.29 + (row * (roof - 0.29)) / rows;
      k.box(g, width + 0.045, 0.02, 0.69, trim, x, y);
      for (const side of [-1, 1]) {
        // Rear is staggered balcony planting, front has larger planted curtains.
        const bx = x + (row % 2 ? -1 : 1) * width * 0.23;
        k.box(g, width * 0.47, 0.022, 0.075, trim, bx, y, side * 0.36);
        k.box(
          g,
          width * 0.35,
          0.039,
          0.045,
          row % 3 ? "#729452" : "#8fa866",
          bx,
          y + 0.028,
          side * 0.367,
        ).name = "planter";
      }
      // Side planting climbs in broader, interrupted vertical swathes.
      if (row % 3 !== 2)
        k.box(
          g,
          0.045,
          0.13,
          0.15,
          "#62834e",
          x + width / 2 + 0.02,
          y + 0.06,
          row % 4 < 2 ? -0.16 : 0.16,
        ).name = "side-green";
    }
    for (const [dx, base, height] of [
      [-0.16, 0.25, (roof - 0.25) * 0.74],
      [0.12, roof * 0.4, roof * 0.56],
    ]) {
      k.box(
        g,
        0.075,
        height,
        0.045,
        "#62834e",
        x + dx,
        base + height / 2,
        0.37,
      ).name = "green-curtain";
      k.box(
        g,
        0.035,
        height * 0.65,
        0.055,
        "#729452",
        x + dx + 0.036,
        base + height * 0.4,
        0.374,
      );
    }
  }
  // Upper residences step back above the projecting sky garden.
  k.box(g, 0.16, 0.18, 0.64, glass, 0, 1.48);
  k.box(g, 0.2, 0.025, 0.7, trim, 0, 1.58);
  k.box(g, 0.11, 0.13, 0.64, glass, 0.025, 1.625);
  k.box(g, 0.15, 0.025, 0.7, trim, 0.025, 1.7);
  k.box(g, 0.33, 0.045, 0.69, trim, -0.075, 1.395).name = "sky-garden";
  k.box(g, 0.28, 0.035, 0.065, "#729452", -0.075, 1.435, 0.285);
  k.box(g, 0.28, 0.035, 0.065, "#729452", -0.075, 1.435, -0.285);
  // Open reflector frame, attached to the high tower, below its crown.
  for (const z of [-0.31, 0.31]) {
    k.box(g, 0.65, 0.035, 0.025, steel, -0.235, 1.365, z);
    k.beam(g, [-0.22, 1.405, z], [0.075, 1.575, z], 0.022, steel);
  }
  for (const x of [-0.55, -0.39, -0.23])
    k.box(g, 0.022, 0.025, 0.64, steel, x, 1.365);
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 4; j++) {
      const panel = k.box(
        g,
        0.105,
        0.018,
        0.125,
        "#bed4d8",
        -0.49 + i * 0.12,
        1.35,
        -0.225 + j * 0.15,
      );
      panel.rotation.z = -0.12;
      panel.name = "reflector";
    }
  for (let i = 0; i < 2; i++)
    for (let j = 0; j < 3; j++) {
      const mirror = k.box(
        g,
        0.13,
        0.018,
        0.14,
        "#bed4d8",
        -0.49 + i * 0.19,
        1.09,
        -0.2 + j * 0.2,
      );
      mirror.rotation.z = 0.3;
      mirror.name = "roof-heliostat";
    }
};
