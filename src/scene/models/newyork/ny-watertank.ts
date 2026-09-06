import type { Factory } from "../../kit";
import { openings } from "../../architecture";
export const nyWatertankFactory: Factory = (k, g) => {
  k.box(g, 0.84, 1.1, 0.72, "#a28b76");
  openings(k, g, 0.84, 1.1, 0.72, 4, 3, "#566e75");
  for (const side of [-1, 1])
    for (const y of [0.22, 0.48, 0.74, 1])
      for (const z of [-0.19, 0.19])
        k.box(g, 0.016, 0.13, 0.095, "#566e75", side * 0.428, y, z);
  k.box(g, 0.14, 0.18, 0.022, "#566e75", 0, 0.09, 0.37);
  k.box(g, 0.93, 0.055, 0.81, "#d1c4a9", 0, 1.12);
  for (const x of [-0.13, 0.13])
    for (const z of [-0.13, 0.13])
      k.beam(g, [x, 1.15, z], [x, 1.44, z], 0.028, "#67706b");
  for (const z of [-0.13, 0.13])
    k.beam(g, [-0.13, 1.17, z], [0.13, 1.41, z], 0.025, "#67706b");
  k.cylinder(g, 0.22, 0.4, "#9d805b", 0, 1.58);
  for (const y of [1.42, 1.7]) k.cylinder(g, 0.225, 0.025, "#576766", 0, y);
  k.cylinder(g, 0.24, 0.16, "#69756e", 0, 1.86, 0, 0, 12);
};
