import type { Factory } from "../../kit";

/**
 * Tour Eiffel, Champ-de-Mars. Four things carry the identity:
 *
 *  1. four square lattice piles at the corners of a 125 m square, straight
 *     from the masonry pedestals to the first platform (published face
 *     inclination 65°48′) and then gathering;
 *  2. three decks at 57.63 / 115.73 / 276.13 m — the first sits low, about
 *     1/5.7 of the 330 m antenna height, which is what the old factory missed;
 *  3. four decorative arches that crown at 39 m, well below the first deck;
 *  4. a long nearly-vertical shaft above the second deck, ending in a small
 *     lantern and the current broadcast needle.
 *
 * Metres are true on the vertical; plan widths are opened by WIDE so the
 * piles still read at board size. See docs/references/pa-eiffel.md.
 */
export const paEiffelFactory: Factory = (k, g) => {
  const H = 2.62;
  const M = H / 330;
  const WIDE = 1.18;
  const y = (m: number) => m * M;
  const s = (m: number) => m * M * WIDE;

  const P1 = 57.63;
  const P2 = 115.73;
  const P3 = 276.13;
  const IRON_TOP = 301;
  const ARCH = 39;
  const SPRING = 16;

  const IRON = "#c4a574";
  const IRON_LT = "#d4b888";
  const IRON_DK = "#6a5338";
  const STONE = "#c8b79a";
  const GLASS = "#6a8490";

  /** Outer-face half-width in real metres. Straight to P1, then concave. */
  const face = (h: number) => {
    if (h <= P1) return 62.5 + (35.345 - 62.5) * (h / P1);
    if (h <= P2) {
      const t = (h - P1) / (P2 - P1);
      return 35.345 + (20.48 - 35.345) * (1 - (1 - t) ** 1.35);
    }
    if (h <= P3) return 20.48 + (9.325 - 20.48) * ((h - P2) / (P3 - P2));
    const t = Math.min(1, (h - P3) / (IRON_TOP - P3));
    return 9.325 + (5.4 - 9.325) * t;
  };

  /** Half the pile's own face. 15 m to P1, then shrinks; piles stay distinct. */
  const pile = (h: number) => {
    if (h <= P1) return 7.5;
    if (h <= P2) return 7.5 - 1.8 * ((h - P1) / (P2 - P1));
    return face(h);
  };

  const corners: [number, number][] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  const at = (
    h: number,
    sx: number,
    sz: number,
    ox: number,
    oz: number,
  ): [number, number, number] => {
    const f = s(face(h));
    // The unified shaft starts at the outer corners of the second deck,
    // not at the half-width of an individual lower pile.
    if (sx === 0 && sz === 0) return [ox * f, y(h), oz * f];
    const p = s(pile(h));
    return [sx * (f - p) + ox * p, y(h), sz * (f - p) + oz * p];
  };

  const strut = (
    a: [number, number, number],
    b: [number, number, number],
    w: number,
    color: string,
  ) => k.beam(g, a, b, w, color);

  // Masonry pedestals — Sauvestre's stone shoes under each pile.
  for (const [sx, sz] of corners) {
    const [x, , z] = at(3, sx, sz, 0, 0);
    k.box(g, s(20), y(6), s(20), STONE, x, y(3), z);
    k.box(g, s(17), y(1.3), s(17), "#e6d8b8", x, y(6), z);
  }

  const ring: [number, number][] = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
  ];

  // Four hollow piles to P2, then one shaft. Panel counts are grouped, not the
  // real 29, so the X-bracing still reads at thumbnail size.
  const bays = [
    { h0: 6, h1: P1, n: 3, posts: 0.032, brace: 0.015 },
    { h0: P1, h1: P2, n: 3, posts: 0.028, brace: 0.013 },
    { h0: P2, h1: P3, n: 6, posts: 0.022, brace: 0.01 },
    { h0: P3, h1: IRON_TOP, n: 2, posts: 0.016, brace: 0.008 },
  ];

  for (const { h0, h1, n, posts, brace } of bays) {
    const piles = h0 >= P2 ? ([[0, 0]] as [number, number][]) : corners;
    for (const [sx, sz] of piles) {
      for (let i = 0; i < n; i++) {
        const a = h0 + ((h1 - h0) * i) / n;
        const b = h0 + ((h1 - h0) * (i + 1)) / n;
        for (const [ox, oz] of ring)
          strut(at(a, sx, sz, ox, oz), at(b, sx, sz, ox, oz), posts, IRON);
        for (let r = 0; r < 4; r++) {
          const [ox0, oz0] = ring[r];
          const [ox1, oz1] = ring[(r + 1) % 4];
          strut(
            at(b, sx, sz, ox0, oz0),
            at(b, sx, sz, ox1, oz1),
            brace,
            IRON_DK,
          );
          // X-brace only the outward faces so the four piles stay hollow.
          const mx = ox0 + ox1;
          const mz = oz0 + oz1;
          const outer = (sx === 0 && sz === 0) || mx * sx > 0 || mz * sz > 0;
          if (!outer) continue;
          strut(
            at(a, sx, sz, ox0, oz0),
            at(b, sx, sz, ox1, oz1),
            brace,
            IRON_DK,
          );
          strut(
            at(a, sx, sz, ox1, oz1),
            at(b, sx, sz, ox0, oz0),
            brace,
            IRON_DK,
          );
        }
      }
    }
  }

  // Decorative arches — 39 m crown, ~74 m published diameter, not structural.
  const archR = (74 ** 2 / 4 + (ARCH - SPRING) ** 2) / (2 * (ARCH - SPRING));
  const archCy = ARCH - archR;
  const faces: [number, number, number, number][] = [
    [0, 1, 1, 0],
    [0, 1, -1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, -1],
  ];
  for (const [tx, tz, nx, nz] of faces) {
    for (const inset of [0, 3.2]) {
      let prev: [number, number, number] | null = null;
      for (let i = 0; i <= 8; i++) {
        const x = -37 + (74 * i) / 8;
        const yy = archCy + Math.sqrt(Math.max(0, archR ** 2 - x ** 2));
        const out = s(face(yy) - inset);
        const p: [number, number, number] = [
          tx * s(x) + nx * out,
          y(yy),
          tz * s(x) + nz * out,
        ];
        if (prev) strut(prev, p, 0.042, IRON_LT);
        // Open spandrel links visually join the arch to the first gallery.
        if (inset === 0 && i > 0 && i < 8) {
          strut(
            p,
            [tx * s(x) + nx * s(face(P1)), y(P1), tz * s(x) + nz * s(face(P1))],
            0.012,
            IRON,
          );
        }
        prev = p;
      }
    }
  }

  // Three observation decks. First is the broad restaurant gallery.
  const deck = (h: number, side: number, thick: number, lip: number) => {
    const w = s(side);
    const frame = (
      width: number,
      height: number,
      yy: number,
      color: string,
    ) => {
      if (h === P3) {
        k.box(g, width, height, width, color, 0, yy);
        return;
      }
      const band = s(h === P1 ? 12 : 8);
      for (const sign of [-1, 1]) {
        k.box(
          g,
          width,
          height,
          band,
          color,
          0,
          yy,
          (sign * (width - band)) / 2,
        );
        k.box(
          g,
          band,
          height,
          width - 2 * band,
          color,
          (sign * (width - band)) / 2,
          yy,
        );
      }
    };
    frame(w, y(thick), y(h + thick / 2), IRON_LT);
    frame(w + s(lip), y(1.6), y(h + thick + 0.8), IRON_DK);
  };
  deck(P1, 70.69, 5.2, 4);
  deck(P2, 40.96, 3.6, 2.8);
  deck(P3, 28, 3.6, 3);

  // First-floor glass halls in the openings between the piles.
  for (const [sx, sz] of [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as [number, number][]) {
    k.box(
      g,
      sx === 0 ? s(26) : s(5.5),
      y(3.2),
      sz === 0 ? s(26) : s(5.5),
      GLASS,
      sx * s(29),
      y(P1 + 8.4),
      sz * s(29),
    );
  }

  // Lantern house + current broadcast needle (not the 1889 flagpole).
  k.box(g, s(16), y(14), s(16), GLASS, 0, y(P3 + 9));
  k.box(g, s(11), y(4.5), s(11), IRON_LT, 0, y(P3 + 18));
  k.cylinder(g, s(1.1), y(18), IRON, 0, y(IRON_TOP + 9));
  k.cylinder(g, s(0.45), y(12), IRON_LT, 0, y(IRON_TOP + 24));
  for (const h of [308, 318]) k.cylinder(g, s(1.6), y(1.1), IRON_DK, 0, y(h));
};
