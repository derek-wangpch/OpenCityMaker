import * as T from "three";
import type { Factory } from "../../kit";

export const bjHeavenFactory: Factory = (k, g) => {
  const stone = "#e6e1ce",
    blue = "#345e82",
    trim = "#6b9492",
    red = "#a94e3c";
  for (let i = 0; i < 3; i++) {
    const r = 0.72 - i * 0.09,
      y = 0.08 * (i + 1);
    k.cylinder(g, r, 0.08, stone, 0, y - 0.04, 0, r, 32);
    // Sparse posts and rail segments with four clear stair breaks.
    for (let j = 0; j < 24; j++) {
      if (j % 6 === 0) continue;
      const a = (j * Math.PI) / 12,
        b = ((j + 1) * Math.PI) / 12;
      k.cylinder(
        g,
        0.012,
        0.07,
        stone,
        Math.sin(a) * (r - 0.024),
        y + 0.035,
        Math.cos(a) * (r - 0.024),
        0.012,
        6,
      );
      if ((j + 1) % 6 !== 0)
        k.beam(
          g,
          [Math.sin(a) * (r - 0.024), y + 0.065, Math.cos(a) * (r - 0.024)],
          [Math.sin(b) * (r - 0.024), y + 0.065, Math.cos(b) * (r - 0.024)],
          0.015,
          stone,
        );
    }
  }
  for (let j = 0; j < 4; j++) {
    const stair = new T.Group();
    stair.rotation.y = (j * Math.PI) / 2;
    g.add(stair);
    for (let i = 0; i < 6; i++)
      k.box(
        stair,
        0.16,
        0.04 * (i + 1),
        0.07,
        stone,
        0,
        0.02 * (i + 1),
        0.73 - i * 0.044,
      );
  }
  // A continuous circular hall with enclosed painted drums between the eaves.
  k.cylinder(g, 0.405, 0.4, red, 0, 0.44, 0, 0.405, 32);
  for (let j = 0; j < 12; j++) {
    const a = (j * Math.PI) / 6;
    const panel = k.box(
      g,
      0.1,
      0.24,
      0.017,
      "#70453a",
      Math.sin(a) * 0.405,
      0.405,
      Math.cos(a) * 0.405,
    );
    panel.rotation.y = a;
  }
  const roofs = [
    { y: 0.63, r: 0.62, h: 0.18, neck: 0.38 },
    { y: 0.94, r: 0.5, h: 0.18, neck: 0.28 },
    { y: 1.25, r: 0.38, h: 0.26, neck: 0.025 },
  ];
  for (let i = 0; i < 3; i++) {
    const { y, r, h, neck } = roofs[i];
    if (i > 0)
      k.cylinder(
        g,
        roofs[i - 1].neck,
        0.2,
        trim,
        0,
        y - 0.08,
        0,
        roofs[i - 1].neck,
        32,
      );
    k.cylinder(g, r, 0.034, trim, 0, y, 0, r, 32);
    const points = [
      new T.Vector2(r, y + 0.015),
      new T.Vector2(r * 0.9, y + 0.035),
      new T.Vector2((r + neck) * 0.5, y + h * 0.42),
      new T.Vector2(neck, y + h),
    ];
    const roof = k.geometry(
      `bj-heaven:roof:${i}`,
      () => new T.LatheGeometry(points, 32),
    );
    k.mesh(g, roof, blue);
    k.cylinder(g, r * 0.86, 0.045, "#d2af71", 0, y - 0.035, 0, r * 0.86, 32);
  }
  // Name plaque is a color block at toy scale; tiny characters are omitted.
  k.box(g, 0.082, 0.15, 0.02, "#d6b261", 0, 1.205, 0.304);
  k.box(g, 0.058, 0.123, 0.023, blue, 0, 1.205, 0.308);
  k.cylinder(g, 0.022, 0.08, "#dfb15c", 0, 1.53, 0, 0.03, 12);
  k.sphere(g, 0.038, "#dfb15c", 0, 1.585, 0);
};
