import type { Factory } from "../../kit";

/**
 * Tokyo Skytree, 634 m. Four things carry the identity, in this order:
 *
 *  1. a tripod: three corner legs on a 68 m equilateral triangle whose plan
 *     morphs to a circle by 315 m (official structural description), so the
 *     silhouette changes as the tile is rotated — the sori/mukuri effect;
 *  2. a concave "sori" taper — the legs flare hard through the bottom third
 *     and then run almost straight into a slim waist just under the deck;
 *  3. the Tembo Deck at 350 m, a bell that *widens upward* to an overhanging
 *     brim at 1.74 x the waist and then chamfers back in hard. It is the
 *     widest point of the whole tower, and the old flat-plate reading of it
 *     was what made this model look like a generic TV mast;
 *  4. a much smaller Galleria saucer at 450 m, then a 140 m latticed antenna
 *     needle with collar rings up to the tip.
 *
 * Radii come from row-by-row silhouette measurement of a distant near-elevation
 * photograph; see artifacts/modeling/tk-skytree/references.md for the table.
 */
export const tkSkytreeFactory: Factory = (k, g) => {
  const H = 2.58; // model height standing in for 634 m, just under the 2.65 cap
  const M = H / 634; // metres -> model units
  // Widths are exaggerated, heights are not, so this factor trades slenderness for
  // legibility. Push it much past 1.4 and the crown goes squat and pagoda-like,
  // which also collapses the contrast with the stubby Tokyo Tower one tier below.
  const WIDE = 1.38;
  const y = (m: number) => m * M;
  const r = (m: number) => m * M * WIDE;

  const WHITE = "#e9eeec"; // "Skytree white", a pale blue-tinted white
  const SHADE = "#9cadb6"; // truss depth / lift shafts seen through the cage
  const GLASS = "#5f8091"; // matte blue-grey observatory glazing
  const TRIM = "#8ea3ab";

  /** Mean radius in metres: waist 19.9 m at 318 m, feet flared a touch past the
   * measured 1.95 x so the tripod stays planted on the tile. */
  const shaft = (h: number) =>
    19.9 * (1 + 1.1 * (1 - Math.min(1, h / 318)) ** 1.7);
  /** Triangularity of the plan: 68 m triangle at the feet, circular by 315 m. */
  const tri = (h: number) => 0.3 * (1 - Math.min(1, h / 315)) ** 1.1;
  /** sin(3a) peaks at 30 / 150 / 270 deg — where the three corner legs stand. */
  const at = (h: number, a: number) => {
    const rad = r(shaft(h)) * (1 + tri(h) * Math.sin(3 * a));
    return [Math.cos(a) * rad, y(h), Math.sin(a) * rad];
  };
  const frustum = (
    h0: number,
    h1: number,
    r0: number,
    r1: number,
    color: string,
    segments = 20,
  ) =>
    k.cylinder(
      g,
      r(r0),
      y(h1 - h0),
      color,
      0,
      y((h0 + h1) / 2),
      0,
      r(r1),
      segments,
    );
  /** Vertical members hugging a clad section, so it still reads as steel. */
  const ribs = (
    h0: number,
    h1: number,
    r0: number,
    r1: number,
    count: number,
    width: number,
  ) => {
    for (let j = 0; j < count; j++) {
      const a = Math.PI / 6 + (j * 2 * Math.PI) / count;
      k.beam(
        g,
        [Math.cos(a) * r(r0), y(h0), Math.sin(a) * r(r0)],
        [Math.cos(a) * r(r1), y(h1), Math.sin(a) * r(r1)],
        width,
        WHITE,
      );
    }
  };

  // Tokyo Solamachi: the low retail podium the tripod actually stands inside.
  k.box(g, 0.82, 0.05, 0.7, "#adb0ab", 0, 0.025);
  k.box(g, 0.66, 0.055, 0.54, TRIM, 0, 0.055);
  k.box(g, 0.62, 0.095, 0.5, "#c4c5bf", 0, 0.048);

  // --- latticed shaft, ground to the 318 m waist ----------------------------
  // Levels bunch up low down where the sori curve bends fastest.
  const levels = [0, 24, 54, 90, 132, 180, 232, 275, 318];
  // Shadowed core: stands in for the shimbashira and the lift shafts, and gives
  // the open cage enough mass to read as a tower at thumbnail size.
  for (let i = 0; i < levels.length - 1; i++)
    frustum(
      levels[i],
      levels[i + 1],
      shaft(levels[i]) * 0.6,
      shaft(levels[i + 1]) * 0.6,
      SHADE,
      12,
    );
  const COLS = 9; // 3 corner legs + 6 secondary; more than this moires on a tile
  for (let i = 0; i < levels.length - 1; i++)
    for (let j = 0; j < COLS; j++) {
      const a = Math.PI / 6 + (j * 2 * Math.PI) / COLS; // legs land on j = 0, 3, 6
      k.beam(
        g,
        at(levels[i], a),
        at(levels[i + 1], a),
        j % 3 ? 0.014 : 0.027,
        WHITE,
      );
      // Chevron bracing, flipped every storey, for the woven diamond mesh.
      const b = a + ((i % 2 ? -1 : 1) * 2 * Math.PI) / COLS;
      k.beam(g, at(levels[i], a), at(levels[i + 1], b), 0.011, WHITE);
    }

  // --- Tembo Deck, 340 / 345 / 350 m ---------------------------------------
  // The bell keeps widening all the way to a cornice at 362 m — 1.74 x the waist
  // and the widest point of the entire tower — then chamfers back in hard.
  frustum(318, 336, 19.9, 26.0, WHITE); // bell underside
  frustum(336, 352, 26.0, 32.0, GLASS); // the glazed observatory band
  frustum(352, 361, 32.0, 34.8, GLASS);
  frustum(360, 363, 35.3, 35.3, TRIM); // cornice
  frustum(363, 368, 34.6, 32.0, WHITE); // roof
  frustum(368, 376, 31.0, 24.6, WHITE); // chamfer
  frustum(376, 381, 24.6, 22.3, WHITE);

  // --- open shaft between the two observatories ----------------------------
  // Left as a ribbed cage over a slim core: above the deck the real tower is
  // see-through truss, and a solid cone here turns the crown into a pagoda taper.
  frustum(381, 432, 19.5, 16.4, SHADE, 10);
  ribs(381, 432, 21.6, 18.2, 8, 0.011);

  // --- Tembo Galleria, 445-451 m: a small saucer, only 1.09 x the waist -----
  // Deliberately understated: the measured galleria is barely 1.23 x the neck
  // below it, so a second big collar here reads as the wrong tower.
  frustum(432, 442, 18.2, 20.8, WHITE);
  frustum(441, 443, 21.8, 21.8, TRIM); // saucer lip
  frustum(443, 453, 21.0, 19.6, GLASS); // the sloping glass corridor
  frustum(453, 460, 19.6, 13.8, WHITE);

  // --- top of the steel shaft, then the 140 m gain tower -------------------
  frustum(460, 497, 11.4, 10.2, SHADE, 10);
  ribs(460, 497, 13.2, 11.8, 8, 0.011);
  // The gain tower is a needle, not a finial: keep it slim and let the collar
  // rings only just break its outline, the way the antenna gear does.
  frustum(497, 552, 6.4, 5.4, WHITE, 10);
  frustum(552, 606, 5.4, 4.4, WHITE, 10);
  for (const h of [518, 553, 588])
    frustum(h - 1.5, h + 1.5, 7.4, 7.4, TRIM, 10); // antenna collar rings
  frustum(606, 619, 6.2, 4.0, WHITE, 10); // top gear platform
  frustum(619, 626, 3.4, 2.0, TRIM, 8);
  frustum(626, 634, 1.3, 0.5, TRIM, 6); // lightning rod at 634 m
};
