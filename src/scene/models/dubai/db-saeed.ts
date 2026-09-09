import * as T from "three";
import type { Factory } from "../../kit";
import { arch } from "../../architecture";
import { barjeel } from "./shared";

/** Tier 6: a substantial courtyard residence with a two-level shaded loggia.
 * Four barjeels and flat-roofed wings retain the house's identity. The enlarged
 * arcades and tower proportions are a board-scale abstraction, not a survey.
 */
export const dbSaeedFactory: Factory = (k, g) => {
  const wall = "#dbc19b",
    trim = "#f0dfbf",
    recess = "#80664c",
    teak = "#76563b";
  k.box(g, 1.48, 0.035, 1.34, "#d9c7a4", 0, 0.0175);
  // A taller rear gallery and broad side rooms surround a clear sky court.
  k.box(g, 1.44, 0.78, 0.17, wall, 0, 0.39, -0.565);
  k.box(g, 1.46, 0.05, 0.19, trim, 0, 0.805, -0.565);
  for (const x of [-0.57, 0.57]) {
    k.box(g, 0.3, 0.48, 1.06, wall, x, 0.24, 0.05);
    k.box(g, 0.32, 0.055, 1.06, trim, x, 0.5075, 0.05);
  }
  // Front rooms leave a real opening under the large central entrance arch.
  for (const x of [-0.455, 0.455])
    k.box(g, 0.53, 0.44, 0.28, wall, x, 0.22, 0.51);
  arch(k, g, 0.38, 0.44, 0.28, trim, 0, 0, 0.51);
  k.box(g, 1.46, 0.065, 0.32, trim, 0, 0.4725, 0.51);
  // Deep two-level loggia: open arches stand in front of a recessed rear wall.
  for (const y of [0.04, 0.42]) {
    for (const x of [-0.29, 0, 0.29]) {
      k.box(g, 0.19, 0.25, 0.014, recess, x, y + 0.135, -0.472);
      arch(k, g, 0.28, 0.32, 0.07, trim, x, y, -0.32);
    }
  }
  for (const y of [0.38, 0.78]) k.box(g, 0.94, 0.08, 0.31, trim, 0, y, -0.435);
  k.box(g, 0.87, 0.04, 0.025, teak, 0, 0.49, -0.276);
  for (const x of [-0.38, -0.19, 0, 0.19, 0.38])
    k.box(g, 0.025, 0.09, 0.025, teak, x, 0.445, -0.276);
  // Broad shallow steps into the courtyard gallery, kept clear of the entrance.
  for (let i = 0; i < 3; i++)
    k.box(
      g,
      0.42,
      0.025 * (i + 1),
      0.065,
      trim,
      0,
      0.0125 * (i + 1),
      -0.12 - i * 0.065,
    );
  // Framed facade recesses on both side elevations and the front rooms.
  for (const side of [-1, 1]) {
    const facade = new T.Group();
    facade.position.x = side * 0.724;
    facade.rotation.y = (side * Math.PI) / 2;
    g.add(facade);
    for (const x of [-0.18, 0.18]) {
      k.box(facade, 0.14, 0.23, 0.012, recess, x, 0.205, 0);
      arch(k, facade, 0.21, 0.3, 0.035, trim, x, 0.07, 0.014);
    }
  }
  for (const x of [-0.47, 0.47]) {
    k.box(g, 0.16, 0.23, 0.014, recess, x, 0.185, 0.655);
    arch(k, g, 0.23, 0.3, 0.035, trim, x, 0.05, 0.672);
  }
  // Four broad, bright barjeels have real recessed dark panels and timber poles.
  // Rear pair rises above the gallery; front pair keeps the court visible.
  for (const z of [-0.49, 0.49]) {
    const base = z < 0 ? 0.805 : 0.535;
    for (const x of [-0.56, 0.56]) {
      k.box(g, 0.34, 0.035, 0.34, trim, x, base - 0.0175, z);
      barjeel(k, g, x, base, z, 0.3, z < 0 ? 0.78 : 0.66, trim);
      // Recessed lower-shaft panels emphasize the plaster frame in every view.
      for (const side of [-1, 1]) {
        k.box(g, 0.2, 0.14, 0.012, wall, x, base + 0.13, z + side * 0.151);
        k.box(g, 0.012, 0.14, 0.2, wall, x + side * 0.151, base + 0.13, z);
      }
    }
  }
  // Sparse broad parapet accents, instead of a fringe of tiny castle teeth.
  for (const x of [-0.31, 0, 0.31]) {
    k.box(g, 0.065, 0.065, 0.065, trim, x, 0.5375, 0.615);
    k.box(g, 0.065, 0.065, 0.065, trim, x, 0.8375, -0.62);
  }
  for (const x of [-0.71, 0.71])
    for (const z of [-0.16, 0.16])
      k.box(g, 0.045, 0.065, 0.07, trim, x, 0.5675, z);
  // Rear elevation still has a readable rhythm when the board is rotated.
  for (const x of [-0.28, 0, 0.28])
    for (const y of [0.21, 0.58])
      k.box(g, 0.12, 0.18, 0.016, recess, x, y, -0.658);
};
