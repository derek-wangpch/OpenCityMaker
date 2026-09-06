import * as T from "three";
import type { Factory, ModelKit } from "../../kit";
import { arch } from "../../architecture";
import { teeth } from "./shared";

/** Open crescent silhouette, simplified for the tier-5 thumbnail. */
function crescent(
  k: ModelKit,
  g: T.Group,
  r: number,
  tube: number,
  color: string,
  x = 0,
  y = 0,
  z = 0,
) {
  const m = k.mesh(
    g,
    k.geometry(
      `db-mosque:crescent:${r}:${tube}`,
      () => new T.TorusGeometry(r, tube, 4, 16, Math.PI * 1.45),
    ),
    color,
    x,
    y,
    z,
  );
  m.rotation.z = Math.PI * 0.27;
  return m;
}

/**
 * Onion dome: a neck over the drum, a low bulge, then a taper to a point —
 * the Fatimid profile. A hemisphere would read as a picnic shelter; every
 * dome on this mosque (and the minaret caps) is an onion.
 */
function onion(
  k: ModelKit,
  g: T.Group,
  r: number,
  h: number,
  color: string,
  x = 0,
  y = 0,
  z = 0,
) {
  const geo = k.geometry(`onion:${r}:${h}`, () => {
    // (radius fraction, sampled bottom→top): neck, low bulge, ogee shoulder, fine point
    const profile = [0.56, 0.84, 1, 1, 0.94, 0.82, 0.62, 0.36, 0.12, 0];
    const pts = profile.map(
      (f, i) => new T.Vector2(r * f, (h * i) / (profile.length - 1)),
    );
    return new T.LatheGeometry(pts, 12);
  });
  return k.mesh(g, geo, color, x, y, z);
}

/**
 * Jumeirah Mosque (1979): Dubai's Fatimid/Mamluk landmark in yellow-pink
 * sandstone. A wide, low prayer hall under a quincunx of onion domes — one
 * large on a windowed drum, four small at the diagonals, each with a gold
 * crescent. Twin square minarets rise from the front corners; a projecting
 * three-arch portal and dense triangular crenellation finish the facade.
 */
export const dbMosqueFactory: Factory = (k, g) => {
  const wall = "#ecdbc4"; // yellow-pink sandstone, lighter than the pack's earth tones
  const trim = "#f6ead2"; // sunlit parapets, frieze band, arch surrounds
  const domeC = "#f3e6ca"; // domes catch a little more light than the walls
  const recess = "#7d6850"; // shaded arcade, blind arches, drum windows
  const gold = "#cfa640"; // crescent finials

  const roofY = 0.46; // hall parapet; every other height scales off it
  // Prayer hall: a wide low block, width:parapet ≈ 2.9:1 as measured.
  k.box(g, 1.36, roofY, 0.94, wall, 0, roofY / 2, 0);

  // Projecting entrance portal, crowned higher than the wing parapet, with
  // three tall arches opening into the deep arcade behind them.
  k.box(g, 0.66, 0.54, 0.12, wall, 0, 0.27, 0.47);
  for (const x of [-0.2, 0, 0.2]) {
    arch(k, g, 0.155, 0.34, 0.04, trim, x, 0.03, 0.535);
    k.box(g, 0.11, 0.29, 0.02, recess, x, 0.175, 0.528); // dark fills the arch curve
  }
  k.box(g, 0.66, 0.035, 0.03, trim, 0, 0.4175, 0.545); // carved frieze band

  // Side wings: one tall blind arch each, round grille window above.
  for (const x of [-0.47, 0.47]) {
    arch(k, g, 0.15, 0.3, 0.04, trim, x, 0.03, 0.472);
    k.box(g, 0.1, 0.27, 0.02, recess, x, 0.165, 0.465);
    k.cylinder(g, 0.03, 0.015, trim, x, 0.42, 0.472).rotation.x = Math.PI / 2;
  }
  // Arched bays keep the side elevations alive (rear entrance stays plain).
  for (const x of [-0.681, 0.681])
    for (const z of [-0.18, 0.18]) {
      k.box(g, 0.015, 0.17, 0.09, recess, x, 0.225, z);
      k.cylinder(g, 0.045, 0.015, recess, x, 0.31, z).rotation.z = Math.PI / 2;
    }

  // Crenellation on every roofline — the Fatimid crown of the silhouette.
  teeth(k, g, -0.31, 0.53, 0.31, 0.53, 0.54, trim, 0.12); // portal crown
  for (const s of [-1, 1]) {
    teeth(k, g, s * 0.35, 0.47, s * 0.68, 0.47, roofY, trim, 0.12); // front wings
    teeth(k, g, s * 0.68, -0.47, s * 0.68, 0.47, roofY, trim, 0.12); // sides
  }
  teeth(k, g, -0.68, -0.47, 0.68, -0.47, roofY, trim, 0.12); // back

  // Big central onion dome on a drum pierced by little arched windows.
  k.cylinder(g, 0.125, 0.16, wall, 0, roofY + 0.08, 0.02);
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    k.box(
      g,
      0.03,
      0.075,
      0.012,
      recess,
      Math.sin(a) * 0.125,
      0.565,
      0.02 + Math.cos(a) * 0.125,
    ).rotation.y = a;
  }
  onion(k, g, 0.23, 0.32, domeC, 0, roofY + 0.16, 0.02);
  k.cylinder(g, 0.009, 0.07, gold, 0, 0.975, 0.02); // finial rod
  crescent(k, g, 0.024, 0.007, gold, 0, 1.015, 0.02); // crescent

  // Four small onion domes at the diagonals of the roof (quincunx cluster).
  for (const [sx, sz] of [
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
  ] as const) {
    const x = sx * 0.42,
      z = sz > 0 ? 0.18 : -0.2;
    k.cylinder(g, 0.05, 0.08, wall, x, roofY + 0.04, z);
    onion(k, g, 0.09, 0.16, domeC, x, roofY + 0.08, z);
    k.cylinder(g, 0.005, 0.045, gold, x, 0.72, z);
    crescent(k, g, 0.013, 0.0045, gold, x, 0.755, z);
  }

  // Twin minarets at the front corners: square shaft, lancet panel, two
  // balcony rings, tapering cap under a small onion and a crescent.
  for (const sx of [-1, 1]) {
    const x = sx * 0.6,
      z = 0.4;
    k.box(g, 0.17, 0.5, 0.17, wall, x, 0.25, z); // base merged into the corner
    k.box(g, 0.145, 0.62, 0.145, wall, x, 0.31, z);
    k.box(g, 0.03, 0.1, 0.012, recess, x, 0.45, z + 0.073); // lancet panel
    k.box(g, 0.21, 0.028, 0.21, trim, x, 0.634, z); // first balcony
    k.cylinder(g, 0.072, 0.34, wall, x, 0.818, z, 0.066, 10); // lattice-carved upper shaft
    k.cylinder(g, 0.097, 0.035, trim, x, 1.006, z, 0.097, 10); // belvedere balcony
    k.cylinder(g, 0.055, 0.09, wall, x, 1.069, z, 0.032, 10);
    onion(k, g, 0.05, 0.065, domeC, x, 1.114, z);
    k.cylinder(g, 0.005, 0.05, gold, x, 1.204, z);
    crescent(k, g, 0.011, 0.004, gold, x, 1.236, z);
  }
};
