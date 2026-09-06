import type { Factory } from "../../kit";

export const shJinmaoFactory: Factory = (k, g) => {
  // Jin Mao is a silvery, nearly parallel-sided shaft on a notched plan — a
  // square whose corners are stepped back twice, so vertical grooves run the
  // whole height. The setbacks hold off until the upper third, then climb as
  // a staircase onto a faceted point carrying a latticed mast. The old model
  // stepped evenly from the ground and flared into a temple eave, which read
  // as a ziggurat instead of a tower.
  const glass = "#82959e",
    fin = "#dde2dd",
    podium = "#b5b1a3";
  // Low stone podium skirt around the tower base.
  k.box(g, 0.94, 0.045, 0.94, podium, 0, 0.022);
  k.box(g, 0.76, 0.04, 0.76, podium, 0, 0.062);

  // Notched plan: three concentric rectangles union into a square whose
  // corners are cut back in two steps — Jin Mao's 16-sided footprint.
  const PLAN: [number, number][] = [
    [1, 0.7],
    [0.9, 0.9],
    [0.7, 1],
  ];
  const prism = (y: number, h: number, a: number, color: string) => {
    for (const [fx, fz] of PLAN)
      k.box(g, 2 * a * fx, h, 2 * a * fz, color, 0, y + h / 2);
  };
  // Vertical fins on the convex arrises of the notched plan, drawn per
  // segment so the mullion lines step inward with the setbacks.
  const fins = (y: number, h: number, a: number) => {
    for (const [fx, fz] of PLAN)
      for (const sx of [-1, 1])
        for (const sz of [-1, 1])
          k.box(g, 0.02, h, 0.02, fin, sx * a * fx, y + h / 2, sz * a * fz);
    // Mullions down each broad face: Jin Mao's curtain wall is read almost
    // entirely as close vertical lines, so the glass never sits as a slab.
    for (const s of [-1, 1])
      for (const o of [0.18, 0.46]) {
        k.box(g, 0.014, h, 0.02, fin, s * a * o, y + h / 2, a * 1.015);
        k.box(g, 0.014, h, 0.02, fin, s * a * o, y + h / 2, -a * 1.015);
        k.box(g, 0.02, h, 0.014, fin, a * 1.015, y + h / 2, s * a * o);
        k.box(g, 0.02, h, 0.014, fin, -a * 1.015, y + h / 2, s * a * o);
      }
  };

  const base = 0.1,
    shaft = 1.72,
    a0 = 0.3;
  // Cartoon silhouette ladder: [segment height, width factor],
  // guided by the SOM completed-building photographs. Jin Mao holds essentially full
  // width for its lower two thirds, then the setbacks take over and the
  // outline climbs as a staircase to the point. The real steps accelerate
  // in the last stretch, but copying that literally rounds the top into a
  // bullet at this size, so the crown is regularised: constant step height,
  // constant step depth, each step three times taller than it is deep.
  const LADDER: [number, number][] = [
    [0.28, 1],
    [0.22, 0.99],
    [0.18, 0.965],
    ...([0, 1, 2, 3, 4, 5, 6, 7].map((i) => [0.042, 0.935 - i * 0.072]) as [
      number,
      number,
    ][]),
  ];
  const span = LADDER.reduce((sum, [dy]) => sum + dy, 0);
  let y = base,
    a = a0;
  LADDER.forEach(([dy, factor], i) => {
    const h = (dy / span) * shaft;
    a = a0 * factor;
    prism(y, h + 0.002, a, glass);
    fins(y, h, a);
    // Silver setback ledge at every step, but only a whisper of one on the
    // long lower runs, so the shaft stays a shaft instead of a corn cob.
    if (i > 2) prism(y + h, 0.011, a + 0.002, fin);
    else if (i > 0) prism(y + h, 0.008, a + 0.001, fin);
    y += h;
  });

  // The corner ribs close over the last step into a short faceted point —
  // the spearhead — and the latticed mast rises out of it.
  k.cylinder(g, a * 1.06, 0.14, fin, 0, y + 0.07, 0, 0.006, 8).rotation.y =
    Math.PI / 8;
  const mast = y + 0.14;
  for (let i = 0; i < 4; i++) {
    const t = (i * Math.PI) / 2 + Math.PI / 4;
    k.beam(
      g,
      [0, mast + 0.01, 0],
      [Math.cos(t) * 0.045, mast + 0.075, Math.sin(t) * 0.045],
      0.012,
      fin,
    );
  }
  k.cylinder(g, 0.011, 0.3, fin, 0, mast + 0.15, 0, 0.003, 8);
};
