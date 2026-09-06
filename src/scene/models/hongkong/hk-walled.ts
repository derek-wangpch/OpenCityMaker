import type { Factory } from "../../kit";
import { villageHouse } from "./vernacular";

export const hkWalledFactory: Factory = (k, g) => {
  const wall = "#969e92",
    cap = "#adb1a0";
  for (const x of [-0.66, 0.66]) k.box(g, 0.11, 0.33, 1.42, wall, x);
  k.box(g, 1.42, 0.33, 0.11, wall, 0, 0.165, -0.66);
  // Split the entrance wall: an actual passage opens onto the central lane.
  for (const x of [-0.42, 0.42])
    k.box(g, 0.58, 0.33, 0.11, wall, x, 0.165, 0.66);
  k.box(g, 0.26, 0.09, 0.11, wall, 0, 0.305, 0.66);
  for (const x of [-0.14, 0.14])
    k.box(g, 0.035, 0.26, 0.025, "#b9714e", x, 0.13, 0.723);
  k.box(g, 0.25, 0.045, 0.025, "#b9714e", 0, 0.305, 0.723);
  // Squared defensive corner towers; no invented ornate pavilion roofs.
  for (const x of [-0.63, 0.63])
    for (const z of [-0.63, 0.63]) {
      k.box(g, 0.2, 0.44, 0.2, wall, x, 0.22, z);
      k.box(g, 0.23, 0.055, 0.23, cap, x, 0.44, z);
    }
  for (const x of [-0.32, 0.32])
    for (const z of [-0.29, 0.18]) villageHouse(k, g, x, z, 0.58);
  k.box(g, 0.2, 0.018, 1.25, "#ccbea4", 0, 0.009, 0.08);
};
