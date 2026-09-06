import * as T from "three";
import type { Factory, ModelKit } from "../../kit";

// 国家大剧院 / National Centre for the Performing Arts (Paul Andreu, 2007) —
// "The Egg" west of Tiananmen: a titanium-and-glass half-ellipsoid
// 212.2 × 143.6 m at the waterline and only 46.3 m high, rising straight out
// of an artificial lake. A glass lune crosses the crown along the short axis:
// its boundaries are meridians through the apex, so the band is widest at the
// water (≈0.56 of the long semi-axis) and tapers to the top. The titanium
// skin carries horizontal panel seams that continue across the glass as
// mullions. Entry is an 80 m underwater corridor on the north (+z) side.
// Reference record: docs/references/bj-ncpa.md.
//
// The factory this replaces scaled a hemisphere to (0.68, 0.53, 0.52) —
// nearly half-spherical in the short view where the real shell is distinctly
// squashed — and faked the glass with a wedge on one side only.

const A = 0.68; // long semi-axis (x), 212.2 m
const B = 0.47; // short semi-axis (z), 143.6 m
const C = 0.55; // height — real squash is 0.65 of B, deliberately fattened
// (user direction: the egg must hold its own on the board between 祈年殿 and
// 央视大楼, both >1 tall). The 1.36-wide footprint and the lake keep the
// "low wide egg" read even at this height.
const LUNE = Math.asin(0.56); // glass half-angle from the ±z meridian plane
const BASE_Y = 0.02; // shell sits slightly in the water slab

const TITANIUM = "#c9cfc9"; // light silver skin, faintly warm
const SEAM = "#8e9894"; // panel seams / glass mullions
const GLASS = "#46626d"; // ultra-white glass reads dark blue-grey in photos
const WATER = "#6fa3ad"; // the lake
const STONE = "#ddd5c0"; // entrance corridor deck

/** Point on the ellipsoid at polar angle th (0 = apex) and azimuth ph
 * (0 = +x), pushed `out` along the approximate normal. Seams and fins sample
 * this so they hug the skin; the glass patches are the same shell scaled. */
const skin = (th: number, ph: number, out: number): number[] => {
  const s = Math.sin(th);
  const x = A * s * Math.cos(ph),
    y = C * Math.cos(th),
    z = B * s * Math.sin(ph);
  const n: [number, number, number] = [x / (A * A), y / (C * C), z / (B * B)];
  const l = Math.hypot(...n) || 1;
  return [
    x + (n[0] / l) * out,
    BASE_Y + y + (n[1] / l) * out,
    z + (n[2] / l) * out,
  ];
};

export const bjNcpaFactory: Factory = (k: ModelKit, g: T.Group) => {
  // The lake the egg floats in; the real water ring is modest compared to the
  // shell, and the entrance corridor crosses it on the north side.
  k.box(g, 1.5, 0.035, 1.5, WATER, 0, 0.0175);

  // Titanium shell: half-ellipsoid at its equator — the base meets the water
  // nearly vertically, as in the photos.
  const shell = k.mesh(
    g,
    k.geometry(
      "bj-ncpa:shell",
      () => new T.SphereGeometry(1, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    ),
    TITANIUM,
    0,
    BASE_Y,
  );
  shell.scale.set(A, C, B);

  // Glass lune: two patches centred on the +z / -z meridian planes, a touch
  // proud of the titanium. Constant-φ boundaries are meridians through the
  // apex — the band closes over the crown by itself.
  for (const center of [Math.PI / 2, (3 * Math.PI) / 2]) {
    const patch = k.mesh(
      g,
      k.geometry(
        `bj-ncpa:glass:${center}`,
        () =>
          new T.SphereGeometry(
            1,
            16,
            20,
            center - LUNE,
            LUNE * 2,
            0,
            Math.PI / 2,
          ),
      ),
      GLASS,
      0,
      BASE_Y,
    );
    patch.scale.set(A + 0.004, C + 0.004, B + 0.004);
  }

  // Panel seams: thin flat rings hugging the ellipsoid parallels, proud
  // enough to cross the glass — the horizontal rhythm continues over the
  // whole shell. ~30 real panel rows grouped to eight readable rings. Flat
  // quads, not beams: struts stick out past the silhouette and read as a
  // floating cage.
  const RINGS = [
    0.34, 0.48, 0.62, 0.75, 0.87, 0.98, 1.08, 1.17, 1.26, 1.35, 1.44,
  ]; // polar th
  const SEGS = 40;
  const seams = k.geometry("bj-ncpa:seams", () => {
    const p: number[] = [];
    for (const th of RINGS) {
      const th1 = th + 0.018;
      for (let i = 0; i < SEGS; i++) {
        const p0 = (i * 2 * Math.PI) / SEGS,
          p1 = ((i + 1) * 2 * Math.PI) / SEGS;
        const a = skin(th, p0, 0.006),
          b = skin(th, p1, 0.006),
          c = skin(th1, p1, 0.006),
          d = skin(th1, p0, 0.006);
        p.push(...a, ...b, ...c, ...a, ...c, ...d); // wound outward (up/+z)
      }
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
  });
  k.mesh(g, seams, SEAM);

  // Vertical fins on the glass lune (the detail photo's grid), sparse so the
  // glass stays glass at board size; they run base to near-apex.
  const FINS = 7; // per side, including the two boundary meridians
  for (const center of [Math.PI / 2, (3 * Math.PI) / 2])
    for (let i = 0; i < FINS; i++) {
      const ph = center - LUNE + (2 * LUNE * i) / (FINS - 1);
      const THS = Array.from({ length: 25 }, (_, j) => (j * Math.PI) / 48);
      for (let j = 0; j < THS.length - 1; j++)
        k.beam(
          g,
          skin(THS[j], ph, 0.007),
          skin(THS[j + 1], ph, 0.007),
          0.0035,
          SEAM,
        );
    }

  // North entrance: the underwater corridor's deck crossing the lake to the
  // shell's base — low and pale, it should not read as a podium.
  k.box(g, 0.3, 0.02, 0.32, STONE, 0, 0.04, B + 0.14);
};
