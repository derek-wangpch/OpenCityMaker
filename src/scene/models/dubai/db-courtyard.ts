import type { Factory } from "../../kit";
import { barjeel } from "./shared";
export const dbCourtyardFactory: Factory = (k, g) => {
  const wall = "#ccb08b",
    trim = "#e1c8a1";
  k.box(g, 1.14, 0.025, 1.04, "#c1a17c");
  k.box(g, 1.12, 0.4, 0.2, wall, 0, 0.2, -0.42);
  for (const x of [-0.46, 0.46]) k.box(g, 0.2, 0.4, 0.84, wall, x, 0.2);
  // Front entrance opens through the wall into the courtyard.
  for (const x of [-0.34, 0.34]) k.box(g, 0.44, 0.4, 0.18, wall, x, 0.2, 0.43);
  k.box(g, 0.25, 0.09, 0.19, wall, 0, 0.355, 0.43);
  k.box(g, 1.16, 0.035, 0.23, trim, 0, 0.417, -0.42);
  for (const x of [-0.46, 0.46]) k.box(g, 0.23, 0.035, 0.84, trim, x, 0.417);
  barjeel(k, g, -0.35, 0.435, -0.42, 0.22, 0.38, trim, true);
  k.cylinder(g, 0.025, 0.45, "#8c7251", 0.12, 0.24);
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5;
    k.beam(
      g,
      [0.12, 0.49, 0],
      [0.12 + Math.cos(a) * 0.22, 0.39, Math.sin(a) * 0.22],
      0.045,
      "#789264",
    );
  }
};
