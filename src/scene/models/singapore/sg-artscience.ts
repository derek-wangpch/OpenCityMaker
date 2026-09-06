import * as T from "three";
import type { Factory } from "../../kit";
import { loft } from "../../architecture";
import { petal, type PetalSpec } from "./shared";

const SHELL = "#f1eee4"; // white fibre-reinforced polymer skin
const METAL = "#d0d2cc"; // bead-blasted stainless flanks of the dish
const GLASS = "#7ba69a"; // green-tinted tip skylights
const DARK = "#6b8288"; // glazed ground-floor drum under the flower
const STRUT = "#8b9799";
const WATER = "#8fb4b6";

// Ten blades of very different lengths: two tall ones reaching the 60 m
// skylight, then a graded run down to the short outer ones that splay almost
// flat and form the bowl of the flower. Lengths run around the dish rather
// than alternating, which is what gives the building its "welcoming hand".
const LENGTHS = [1, 0.95, 0.78, 0.4, 0.18, 0.08, 0.05, 0.12, 0.3, 0.6];

// Turns the tall-fin cluster toward the board's default camera, so the model
// presents the Marina Bay elevation — fins fanning out over an open bowl —
// rather than the back of the flower. Found by sweeping orientations.
const FACING = 3.7;

const SHORTEST = Math.min(...LENGTHS);

const spec = (i: number): PetalSpec => {
  const n = (LENGTHS[i] - SHORTEST) / (1 - SHORTEST);
  return {
    angle: (i * Math.PI) / 5 + FACING,
    // Every blade starts at the oculus ring, which sits at the *bottom* of the
    // hull — so each one sweeps outward and up, and their undersides together
    // are the bowl. Starting them at rim height instead makes a flat collar.
    base: [0.18, 0.27],
    // In plan the roof is very nearly circular — every blade reaches about the
    // same radius. What differs is how far each one climbs on the way there:
    // the short ones stop at the rim of the bowl, the long ones carry on up to
    // the 60 m skylight.
    tip: [0.74 - n * 0.12, 0.54 + n * 1.14],
    // Shallow departure across the dish, curling upright further out.
    launch: 0.5,
    bend: 0.4,
    wBase: 0.1,
    // The low outer blades are the widest — side by side they close up into
    // the continuous hull of the bowl.
    wTip: 0.26 - n * 0.04,
    thick: 0.035,
    // Trough turned toward the flower axis — enough to round the blades into
    // one hull, but not so much that their edges curl the bowl shut.
    cup: 0.3,
    // A light pinwheel across the bowl, matching the roof plan. Kept small:
    // more twist than this turns the low blades into a windmill of flat vanes.
    roll: 0.12 * (1 - n),
  };
};

export const sgArtscienceFactory: Factory = (k, g) => {
  // Lily pond the whole building floats in.
  k.cylinder(g, 0.6, 0.04, WATER, 0, 0.02, 0, 0.6, 24);
  for (const [x, z, r] of [
    [-0.42, 0.3, 0.06],
    [-0.3, 0.44, 0.045],
    [0.44, 0.26, 0.05],
    [0.3, -0.44, 0.055],
    [-0.46, -0.2, 0.04],
  ])
    k.cylinder(g, r, 0.012, "#7f9f68", x, 0.046, z, r, 8);

  k.cylinder(g, 0.32, 0.03, "#b9b7a6", 0, 0.055, 0, 0.32, 20); // entrance deck

  // Glazed ground floor: a dark drum the white flower sits clear of.
  k.cylinder(g, 0.17, 0.11, DARK, 0, 0.115, 0, 0.15, 16);
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5;
    k.box(
      g,
      0.016,
      0.11,
      0.016,
      STRUT,
      Math.sin(a) * 0.16,
      0.115,
      Math.cos(a) * 0.16,
    );
  }

  // Slender splayed legs that carry the dish clear of the drum, so the white
  // hull reads as floating over the pond the way it does from the bay.
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + 0.2;
    k.beam(
      g,
      [Math.sin(a) * 0.05, 0.14, Math.cos(a) * 0.05],
      [Math.sin(a) * 0.15, 0.24, Math.cos(a) * 0.15],
      0.018,
      STRUT,
    );
  }

  // Central dish: a rounded hull underneath, dipping on top to the oculus that
  // drains the rainwater the roof collects.
  const circle = (r: number, n = 20): [number, number][] =>
    Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n;
      return [Math.sin(a) * r, Math.cos(a) * r] as [number, number];
    });
  loft(
    k,
    g,
    "sg-artscience-dish",
    [
      { y: 0.14, points: circle(0.07) },
      { y: 0.18, points: circle(0.15) },
      { y: 0.24, points: circle(0.2) },
      { y: 0.29, points: circle(0.22) },
      { y: 0.27, points: circle(0.13) },
      { y: 0.26, points: circle(0.08) },
    ],
    METAL,
  );
  k.cylinder(g, 0.065, 0.02, DARK, 0, 0.26, 0, 0.065, 16); // oculus

  for (let i = 0; i < 10; i++) {
    const p = spec(i);
    const cut = petal(k, g, p, SHELL);
    // Every blade is capped by a skylight — the green band across the blunt
    // cut end that daylights the gallery below it.
    const light = k.box(g, p.wTip * 1.15, 0.01, p.thick * 0.9, GLASS);
    light.position.copy(cut.tip.addScaledVector(cut.frame.tangent, -0.008));
    light.setRotationFromMatrix(
      new T.Matrix4().makeBasis(
        cut.frame.side,
        cut.frame.tangent,
        cut.frame.normal,
      ),
    );
  }
};
