import type { Factory } from "../../kit";
import { loft } from "../../architecture";

export const hkIfcFactory: Factory = (k, g) => {
  const glass = "#91b0b9",
    silver = "#d9e1d8",
    recess = "#66838f";
  // Four broad elevations with recessed corners; the shallow setbacks belong
  // to the shaft, not to an outward-swelling cap. Slightly stout for board size.
  const plan = (r: number): [number, number][] => {
    const a = r * 0.73;
    return [
      [-a, -r],
      [a, -r],
      [a, -a],
      [r, -a],
      [r, a],
      [a, a],
      [a, r],
      [-a, r],
      [-a, a],
      [-r, a],
      [-r, -a],
      [-a, -a],
    ];
  };
  const sections = [
    [0.07, 0.83, 0.29, 0.283],
    [0.83, 1.48, 0.276, 0.264],
    [1.48, 1.92, 0.252, 0.241],
    [1.92, 2.17, 0.228, 0.214],
  ];
  k.box(g, 0.8, 0.07, 0.74, "#c7cec0", 0, 0.035);
  for (const [y0, y1, r0, r1] of sections) {
    loft(
      k,
      g,
      `hk-ifc:shaft:${y0}`,
      [
        { y: y0, points: plan(r0) },
        { y: y1, points: plan(r1) },
      ],
      glass,
    );
    const at = (y: number) => r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
    for (let side = 0; side < 4; side++) {
      const p = (u: number, y: number, offset = 0.003) => {
        const r = at(y),
          x = u * r * 0.73,
          z = r + offset;
        return side === 0
          ? [x, y, z]
          : side === 1
            ? [z, y, -x]
            : side === 2
              ? [-x, y, -z]
              : [-z, y, x];
      };
      // Seven grouped bays per elevation retain the silver fluting without
      // reproducing every real window. Every side uses the same surface math.
      for (let i = -3; i <= 3; i++)
        k.beam(
          g,
          p(i / 3, y0),
          p(i / 3, y1),
          i === -3 || i === 3 ? 0.012 : 0.007,
          silver,
        );
      const rows = Math.round((y1 - y0) / 0.115);
      for (let i = 1; i < rows; i++) {
        const y = y0 + ((y1 - y0) * i) / rows;
        k.beam(g, p(-1, y), p(1, y), 0.005, "#bdd0d0");
      }
      // Narrow equipment strips and ledges stop at each corner recess.
      k.beam(g, p(-1, y1 - 0.022), p(1, y1 - 0.022), 0.025, recess);
      k.beam(g, p(-1, y1), p(1, y1), 0.008, silver);
    }
    const corners = plan(r0),
      ends = plan(r1);
    for (const i of [2, 5, 8, 11])
      k.beam(
        g,
        [corners[i][0], y0, corners[i][1]],
        [ends[i][0], y1, ends[i][1]],
        0.009,
        recess,
      );
  }
  // A low inner service core leaves the upper silver crown visibly open.
  loft(
    k,
    g,
    "hk-ifc:inner-crown",
    [
      { y: 2.17, points: plan(0.202) },
      { y: 2.29, points: plan(0.173) },
    ],
    recess,
  );
  // Four comb-like banks rise and curl inward. Their free tips and corner
  // gaps replace the old solid bulbous lantern and flat lid.
  for (let side = 0; side < 4; side++) {
    const rotate = (x: number, y: number, z: number) =>
      side === 0
        ? [x, y, z]
        : side === 1
          ? [z, y, -x]
          : side === 2
            ? [-x, y, -z]
            : [-z, y, x];
    for (let i = -4; i <= 4; i++) {
      const u = i / 4;
      const tip = 2.48 - 0.055 * Math.pow(Math.abs(u), 2);
      const points = [
        rotate(u * 0.153, 2.16, 0.217),
        rotate(u * 0.15, 2.27, 0.204),
        rotate(u * 0.14, 2.38 - 0.02 * Math.abs(u), 0.172),
        rotate(u * 0.125, tip, 0.128),
      ];
      for (let j = 0; j < points.length - 1; j++)
        k.beam(g, points[j], points[j + 1], 0.013, silver);
    }
    for (const [y, r] of [
      [2.2, 0.212],
      [2.25, 0.206],
    ])
      k.beam(g, rotate(-0.151, y, r), rotate(0.151, y, r), 0.009, silver);
  }
};
