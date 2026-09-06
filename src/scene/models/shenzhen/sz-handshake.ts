import type { Factory } from "../../kit";
import { TRIM } from "./shared";

export const szHandshakeFactory: Factory = (k, g) => {
  // Individually extended houses crowd a kinked alley. Fixed variations keep
  // thumbnails and the board identical, without making a tidy housing estate.
  const blocks = [
    {
      x: -0.43,
      z: -0.25,
      w: 0.33,
      d: 0.34,
      h: 0.83,
      tone: "#cfbfaa",
      floors: 4,
    },
    {
      x: -0.04,
      z: -0.29,
      w: 0.32,
      d: 0.39,
      h: 1.12,
      tone: "#b9c6bb",
      floors: 4,
    },
    {
      x: 0.35,
      z: -0.22,
      w: 0.35,
      d: 0.34,
      h: 0.94,
      tone: "#d0b3a1",
      floors: 4,
    },
    {
      x: -0.37,
      z: 0.25,
      w: 0.36,
      d: 0.33,
      h: 0.65,
      tone: "#d7caaa",
      floors: 3,
    },
    { x: 0.05, z: 0.23, w: 0.3, d: 0.37, h: 0.87, tone: "#c3bdba", floors: 4 },
    { x: 0.43, z: 0.28, w: 0.3, d: 0.32, h: 0.72, tone: "#b8c8c9", floors: 4 },
  ];
  const window = "#5f7880",
    roof = "#b7b3a4";
  k.box(g, 1.32, 0.025, 1.08, "#b6ad99", 0, 0.0125);
  blocks.forEach((b, index) => {
    k.box(g, b.w, b.h, b.d, b.tone, b.x, b.h / 2 + 0.025, b.z);
    for (const side of [-1, 1]) {
      for (let floor = 0; floor < b.floors; floor++) {
        const y = 0.12 + floor * ((b.h - 0.12) / b.floors);
        for (const column of [-1, 1]) {
          const x = b.x + column * b.w * 0.24;
          const z = b.z + side * (b.d / 2 + 0.008);
          k.box(g, 0.07, 0.078, 0.012, window, x, y, z);
          // Uneven additions: projecting balcony trays and AC units on
          // selected windows rather than identical details on every floor.
          if ((index + floor + column + 1) % 4 === 0 && floor > 0) {
            k.box(g, 0.1, 0.018, 0.052, TRIM, x, y - 0.042, z + side * 0.018);
            k.box(
              g,
              0.1,
              0.027,
              0.01,
              "#8e9d99",
              x,
              y - 0.025,
              z + side * 0.04,
            );
          }
        }
        // End-wall openings keep the cluster legible after rotation.
        for (const end of [-1, 1])
          k.box(
            g,
            0.012,
            0.073,
            0.065,
            window,
            b.x + end * (b.w / 2 + 0.006),
            y,
            b.z + side * b.d * 0.23,
          );
      }
    }
    const top = b.h + 0.035;
    k.box(g, b.w + 0.015, 0.025, b.d + 0.015, roof, b.x, top, b.z);
    // Mixed rooftop stair rooms, corrugated extensions and exposed tanks.
    if (index % 2 === 0) {
      k.box(
        g,
        b.w * 0.48,
        0.1,
        b.d * 0.48,
        b.tone,
        b.x - 0.05,
        top + 0.06,
        b.z - 0.03,
      );
      k.box(
        g,
        b.w * 0.54,
        0.02,
        b.d * 0.55,
        "#7d9eaa",
        b.x - 0.05,
        top + 0.12,
        b.z - 0.03,
      ).rotation.z = 0.08;
    }
    if (index === 1 || index === 4)
      k.cylinder(
        g,
        0.039,
        0.065,
        "#90a6ac",
        b.x + 0.08,
        top + 0.045,
        b.z + 0.065,
        0.039,
        10,
      );
    const outward = b.z > 0 ? 1 : -1;
    k.box(
      g,
      b.w * 0.66,
      0.018,
      0.08,
      index % 2 ? "#819f9b" : "#bd826c",
      b.x + 0.02,
      0.17,
      b.z + outward * (b.d / 2 + 0.025),
    ).rotation.x = outward * 0.12;
  });
};
