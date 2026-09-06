import type { Factory } from "../../kit";
import { arch } from "../../architecture";

/**
 * Sheikh Saeed Al Maktoum House (1896, Al Shindagha): a low, spreading four-wing
 * courtyard residence — never a tower. Wings ring an open sandy courtyard, the
 * two-story rear wing carries the courtyard loggia, and one barjeel wind tower
 * stands at each corner (front pair shorter, rear pair taller), per the 1991
 * IASTE plan ("four wind towers located on each corner of the building").
 */
export const dbSaeedFactory: Factory = (k, g) => {
  const wall = "#d2b184"; // sun-washed sand plaster of the courtyard elevations
  const trim = "#e2c69b"; // parapets, merlons and tower caps catch more light
  const sand = "#d4bd93"; // courtyard floor
  const recess = "#6f5a44"; // shaded openings: arcade bays, tower slits
  const teak = "#5a4433"; // balustrade, entrance lintel, chandal beam stubs

  // Sandy courtyard (bayt) open to the sky inside the ring of wings.
  k.box(g, 0.96, 0.012, 0.74, sand, 0, 0.006, 0);

  // Rear wing: the only two-story block, its loggia faces the courtyard.
  k.box(g, 1.36, 0.56, 0.2, wall, 0, 0.28, -0.47);
  // Entrance and side wings: one story, keeping the roofline stepped.
  k.box(g, 1.36, 0.32, 0.2, wall, 0, 0.16, 0.47);
  for (const x of [-0.58, 0.58]) k.box(g, 0.2, 0.32, 0.74, wall, x, 0.16, 0);

  // Rear-wing courtyard loggia: shaded ground-floor arcade...
  for (let i = -2; i <= 2; i++)
    k.box(g, 0.1, 0.2, 0.01, recess, i * 0.2, 0.1, -0.364);
  // ...real plaster arches above a dark teak balustrade — the house's signature.
  k.box(g, 0.92, 0.055, 0.025, teak, 0, 0.347, -0.346);
  for (let i = -2; i <= 1; i++) {
    const x = i * 0.19 + 0.095;
    k.box(g, 0.1, 0.14, 0.01, recess, x, 0.43, -0.366);
    arch(k, g, 0.13, 0.16, 0.06, wall, x, 0.36, -0.345);
  }

  // Entrance portal on the front wing: carved door under a log-end lintel,
  // flanked by the round-arched ground-floor bays of the plaza facade.
  k.box(g, 0.16, 0.22, 0.02, recess, 0, 0.11, 0.562);
  k.box(g, 0.3, 0.03, 0.05, teak, 0, 0.235, 0.575);
  for (const x of [-0.48, -0.26, 0.26, 0.48])
    arch(k, g, 0.1, 0.15, 0.03, recess, x, 0.02, 0.562);

  // Castellated parapet runs along the outer rim of every wing (street faces).
  for (let i = -4; i <= 4; i++) {
    k.box(g, 0.045, 0.05, 0.05, trim, i * 0.15, 0.345, 0.555);
    k.box(g, 0.045, 0.05, 0.05, trim, i * 0.15, 0.585, -0.555);
  }
  for (const x of [-0.655, 0.655])
    for (let i = -2; i <= 2; i++)
      k.box(g, 0.05, 0.05, 0.045, trim, x, 0.345, i * 0.12);

  // Side elevations: ground-floor arches (dark bay + round head, since the
  // arch helper only faces +z) under small square upper windows, as on the
  // west angle of the real house.
  for (const x of [-0.58, 0.58])
    for (const z of [-0.15, 0.15]) {
      const px = x + (x > 0 ? 0.096 : -0.096);
      k.box(g, 0.02, 0.1, 0.09, recess, px, 0.05, z);
      k.cylinder(g, 0.045, 0.02, recess, px, 0.15, z, 0.045, 12).rotation.z =
        Math.PI / 2;
    }
  for (const x of [-0.58, 0.58])
    for (const z of [-0.2, 0, 0.2]) {
      k.box(g, 0.02, 0.09, 0.07, recess, x + (x > 0 ? 0.091 : -0.091), 0.19, z);
      k.box(g, 0.02, 0.09, 0.07, recess, x + (x > 0 ? -0.101 : 0.101), 0.19, z);
    }
  for (const x of [-0.45, -0.15, 0.15, 0.45])
    k.box(g, 0.08, 0.1, 0.02, recess, x, 0.42, -0.562);

  // Corner barjeel: stout square shaft (never minaret-slender), two vertical
  // slit openings plus a small upper slit per face, teak chandal beam stubs,
  // projecting cap and open top.
  const tower = (x: number, z: number, base: number, top: number) => {
    k.box(g, 0.22, top - base, 0.22, wall, x, (base + top) / 2, z);
    for (const [ox, oz, sx] of [
      [0.111, 0, 1],
      [-0.111, 0, 1],
      [0, 0.111, 0],
      [0, -0.111, 0],
    ] as const) {
      const w = sx ? 0.012 : 0.036,
        d = sx ? 0.036 : 0.012;
      for (const o of [-0.048, 0.048])
        k.box(
          g,
          w,
          (top - base) * 0.62,
          d,
          recess,
          x + ox + (sx ? 0 : o),
          base + (top - base) * 0.53,
          z + oz + (sx ? o : 0),
        );
      k.box(
        g,
        sx ? 0.014 : 0.13,
        0.06,
        sx ? 0.13 : 0.014,
        recess,
        x + ox,
        top - 0.13,
        z + oz,
      );
      for (const f of [0.62, 0.84])
        k.box(
          g,
          sx ? 0.05 : 0.012,
          0.012,
          sx ? 0.012 : 0.05,
          teak,
          x + ox * 1.3,
          base + (top - base) * f,
          z + oz * 1.3,
        );
    }
    k.box(g, 0.26, 0.05, 0.26, trim, x, top + 0.025, z);
    k.box(g, 0.16, 0.02, 0.16, recess, x, top + 0.06, z);
  };
  tower(-0.57, 0.47, 0.32, 1.08);
  tower(0.57, 0.47, 0.32, 1.08);
  tower(-0.57, -0.47, 0.56, 1.3);
  tower(0.57, -0.47, 0.56, 1.3);
};
