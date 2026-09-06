import type { Factory } from "../../kit";
import { barjeel, teeth } from "./shared";

/**
 * Al Fahidi (Bastakiya): a dense neighbourhood of 1–2 story coral-stone masses
 * split by narrow winding sikkas, flat roofs at uneven heights, square-tooth
 * parapets on the street-facing edges, and barjeel wind towers rising well
 * above the roofline at clearly different heights. One courtyard tree marks
 * the little square where the alleys meet.
 */
export const dbFahidiFactory: Factory = (k, g) => {
  // Back-left two-story mass, tallest block of the quarter.
  k.box(g, 0.58, 0.56, 0.56, "#c4a37c", -0.4, 0.28, -0.4);
  // Stair enclosure on its roof (every rooftop keeps a small access hut).
  k.box(g, 0.16, 0.11, 0.15, "#ddc29a", -0.58, 0.615, -0.5);
  // Back-right single-story mass, set back to open a winding sikka.
  k.box(g, 0.5, 0.34, 0.4, "#d3b88f", 0.32, 0.17, -0.46);
  // Front-left mass with its own lower barjeel.
  k.box(g, 0.56, 0.4, 0.56, "#ddc29a", -0.42, 0.2, 0.34);
  // Front row: mid mass in a deeper ochre, plus a small annex.
  k.box(g, 0.44, 0.5, 0.48, "#b99a70", 0.16, 0.25, 0.4);
  k.box(g, 0.26, 0.3, 0.44, "#d3b88f", 0.62, 0.15, 0.36);
  // Dark paving strips follow the jog of the alleys between the masses.
  k.box(g, 0.17, 0.012, 0.72, "#a98d68", -0.02, 0.006, -0.34);
  k.box(g, 0.13, 0.012, 0.62, "#a98d68", -0.1, 0.006, 0.33);
  // Roof-edge crenellation on the street-facing edges of the front and back rows.
  teeth(k, g, -0.04, 0.64, 0.36, 0.64, 0.5);
  teeth(k, g, 0.51, 0.58, 0.73, 0.58, 0.3);
  teeth(k, g, 0.09, -0.26, 0.55, -0.26, 0.34);
  // Barjeels at staggered heights: tall on the back mass, lower toward the front.
  barjeel(k, g, -0.24, 0.56, -0.3, 0.24, 0.74);
  barjeel(k, g, -0.56, 0.4, 0.46, 0.21, 0.55);
  barjeel(k, g, 0.26, 0.5, 0.48, 0.2, 0.6);
  // Small deep-set window slits facing the alleys.
  for (const [x, y, z, w, d] of [
    [-0.52, 0.24, -0.11, 0.055, 0.02],
    [-0.28, 0.42, -0.11, 0.055, 0.02],
    [-0.24, 0.18, 0.05, 0.055, 0.02],
    [0.16, 0.2, -0.25, 0.02, 0.055],
    [0.48, 0.18, -0.25, 0.02, 0.055],
    [-0.13, 0.24, 0.34, 0.02, 0.055],
    [0.02, 0.38, 0.65, 0.055, 0.02],
    [0.3, 0.36, 0.65, 0.055, 0.02],
    [0.74, 0.2, 0.36, 0.02, 0.055],
  ] as const)
    k.box(g, w, 0.1, d, "#725e49", x, y, z);
  // A few full-height doors make the lanes read as inhabited passages.
  k.box(g, 0.1, 0.23, 0.016, "#725e49", -0.42, 0.115, 0.627);
  k.box(g, 0.1, 0.24, 0.016, "#725e49", 0.16, 0.12, 0.647);
  k.box(g, 0.016, 0.2, 0.1, "#725e49", -0.123, 0.1, 0.23);
  // Courtyard tree in the little square where the sikkas meet.
  k.tree(g, -0.02, 0.02, 0.6);
};
