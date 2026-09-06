import type { Factory } from "../../kit";

// HSBC Main Building, Hong Kong (Foster + Partners, 1985).
// Stepped trio of towers — 29 | 44 | 36 storeys, east to west — hung from
// exposed paired masts, with white hanger trusses crossing the dark
// glazed north/south facades. The building floats above an open public
// plaza; an oval roof-plant drum with the HSBC hexagon and little crane
// jibs ("cannons") crown the tallest block.

const GLASS = "#6e838a"; // dark blue-grey reflective glazing
const BAND = "#c9d3cf"; // fine horizontal sunshade bands on the glass
const ALU = "#d8dcd5"; // silver aluminium: mast cladding, side panels, drum
const BRACE = "#eceee8"; // white suspension-truss diagonals
const SLOT = "#41505a"; // dark recess between each mast pair
const RED = "#c74a3c"; // HSBC hexagon accent on the drum

export const hkHsbcFactory: Factory = (k, g) => {
  const y0 = 0.22; // elevated ground floor: open plaza underneath
  const bay = 0.44; // one structural bay = one tower width
  const depth = 0.9;
  const zf = depth / 2;

  // Stepped profile: low east block, tallest centre, medium west block.
  const blocks = [
    { x: -bay, h: 1.42, trusses: 2 },
    { x: 0, h: 2.18, trusses: 4 },
    { x: bay, h: 1.74, trusses: 3 },
  ];

  for (const { x, h, trusses } of blocks) {
    // Glass shaft floating over the plaza.
    k.box(g, bay, h - y0, depth, GLASS, x, (h + y0) / 2);
    // Dark underbelly (banking-hall soffit) above the open ground floor.
    k.box(g, bay, 0.05, depth, SLOT, x, y0 + 0.025);
    // Silver aluminium cladding on the east/west side faces.
    for (const s of [-1, 1])
      k.box(
        g,
        0.016,
        h - y0,
        depth - 0.04,
        ALU,
        x + s * (bay / 2 + 0.004),
        (h + y0) / 2,
      );
    // Horizontal floor bands on the glazed facades only.
    const rows = Math.round((h - y0) / 0.16);
    for (let i = 1; i < rows; i++) {
      const yy = y0 + ((h - y0) * i) / rows;
      for (const s of [-1, 1])
        k.box(g, bay + 0.014, 0.018, 0.014, BAND, x, yy, s * (zf + 0.004));
    }
    // Shallow V hangers and their lower ties, as seen on the glazed elevation.
    for (let t = 1; t <= trusses; t++) {
      const yy = y0 + ((h - y0) * t) / (trusses + 1);
      for (const s of [-1, 1]) {
        const z = s * (zf + 0.022);
        k.beam(g, [x - bay / 2, yy + 0.08, z], [x, yy - 0.08, z], 0.028, BRACE);
        k.beam(g, [x + bay / 2, yy + 0.08, z], [x, yy - 0.08, z], 0.028, BRACE);
        k.beam(
          g,
          [x - bay / 2, yy - 0.08, z],
          [x + bay / 2, yy - 0.08, z],
          0.022,
          BRACE,
        );
      }
    }
  }

  // Four mast lines bound the three towers; each carries the taller neighbour.
  const masts = [
    { mx: -1.5 * bay, h: 1.42 },
    { mx: -bay / 2, h: 2.18 },
    { mx: bay / 2, h: 2.18 },
    { mx: 1.5 * bay, h: 1.74 },
  ];
  for (const { mx, h } of masts) {
    const mh = h + 0.08; // masts rise a little past the roof
    // Paired silver-clad cylinders, front and back, down to the ground.
    for (const s of [-1, 1])
      k.cylinder(g, 0.05, mh, ALU, mx, mh / 2, s * (zf - 0.01), 0.05, 10);
  }
  // Dark X-braced notches between each mast pair at the truss levels —
  // the signature of the side elevations. Inner lines show only above the
  // lower neighbour's roof; their lower notches sit hidden inside the blocks.
  const sideTrusses = [
    { mx: -1.5 * bay, face: -1.5 * bay - 0.055, block: blocks[0], above: y0 },
    { mx: 1.5 * bay, face: 1.5 * bay + 0.055, block: blocks[2], above: y0 },
    {
      mx: -bay / 2,
      face: -bay / 2 - 0.055,
      block: blocks[1],
      above: blocks[0].h,
    },
    {
      mx: bay / 2,
      face: bay / 2 + 0.055,
      block: blocks[1],
      above: blocks[2].h,
    },
  ];
  for (const { mx, face, block, above } of sideTrusses)
    for (let t = 1; t <= block.trusses; t++) {
      const yy = y0 + ((block.h - y0) * t) / (block.trusses + 1);
      k.box(g, 0.09, 0.2, depth - 0.1, SLOT, mx, yy);
      if (yy - 0.1 < above - 0.01) continue;
      k.beam(g, [face, yy - 0.1, -0.34], [face, yy + 0.1, 0.34], 0.026, BRACE);
      k.beam(g, [face, yy - 0.1, 0.34], [face, yy + 0.1, -0.34], 0.026, BRACE);
    }

  // Crown: white gantry caps and crane jibs on the two centre mast lines,
  // plus a small crane on each lower block's roof (the feng shui "cannons").
  const top = 2.18;
  for (const mx of [-bay / 2, bay / 2]) {
    const dir = mx < 0 ? -1 : 1;
    k.box(g, 0.15, 0.1, 0.22, ALU, mx, top + 0.1);
    k.beam(g, [mx, top + 0.19, 0], [mx + dir * 0.3, top + 0.19, 0], 0.032, ALU);
    k.box(g, 0.07, 0.05, 0.07, ALU, mx - dir * 0.07, top + 0.19);
  }
  for (const { mx, h, dir } of [
    { mx: -1.5 * bay, h: 1.42, dir: -1 },
    { mx: 1.5 * bay, h: 1.74, dir: 1 },
  ]) {
    k.box(g, 0.11, 0.08, 0.16, ALU, mx, h + 0.1);
    k.beam(g, [mx, h + 0.16, 0], [mx + dir * 0.13, h + 0.16, 0], 0.028, ALU);
  }

  // Oval silver roof-plant drum with the HSBC hexagon, slightly west of
  // centre, riding above the gantry caps on a small plant pedestal.
  k.box(g, 0.24, 0.1, 0.14, ALU, 0.14, top + 0.04);
  const drum = k.cylinder(g, 0.17, 0.12, ALU, 0.14, top + 0.14, 0, 0.17, 20);
  drum.scale.z = 0.5;
  k.box(g, 0.045, 0.045, 0.02, RED, 0.11, top + 0.14, 0.09);
  k.box(g, 0.045, 0.045, 0.02, "#f0f0ea", 0.17, top + 0.14, 0.09);
};
