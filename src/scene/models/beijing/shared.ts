import * as T from "three";
import type { CityPack } from "../../../cities/types";
import type { ModelKit } from "../../kit";

// Siheyuan palette: grey brick outside, warm timber and lattice inside. The
// contrast is the whole point of the type — a blank street wall hiding a
// bright garden — so the two families of colour stay strictly separated.
const BRICK = "#aeaa9d"; // 青砖 outer walls, seen from the street
const PLINTH = "#8d897c"; // 下碱, the darker brick base course
const PLASTER = "#e7cfaa"; // courtyard-facing plaster panels
const TIMBER = "#a34e3c"; // painted columns, lintels and doors
const LATTICE = "#dcc48f"; // 支摘窗 paper-and-wood lattice
const STONE = "#e0d5ba"; // 台基, steps and the 甬路 paving
const RIDGE = "#47585a"; // ridge tiles and roll seams, darker than the slope

/**
 * 硬山 gable roof: a straight ridge along local x, eaves overhanging only the
 * two long sides, gable ends cut flush with the brick end walls. This is the
 * defining roof of a siheyuan and the reason the compound reads as four
 * separate ranges rather than one pyramid-roofed lump.
 */
export function gable(
  k: ModelKit,
  h: T.Group,
  w: number,
  d: number,
  y: number,
  rise: number,
) {
  const key = `bj-gable:${w}:${d}:${rise}`;
  const geo = k.geometry(key, () => {
    const hw = w / 2,
      hd = d / 2;
    const A = [-hw, 0, -hd],
      B = [hw, 0, -hd],
      C = [hw, 0, hd],
      D = [-hw, 0, hd],
      E = [-hw, rise, 0],
      F = [hw, rise, 0];
    const p: number[] = [];
    const tri = (...v: number[][]) => v.forEach((q) => p.push(...q));
    tri(A, F, B, A, E, F); // back slope
    tri(D, C, F, D, F, E); // front slope
    tri(A, D, E); // gable end, -x
    tri(B, F, C); // gable end, +x
    tri(A, B, C, A, C, D); // soffit, visible under the deep eaves
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.Float32BufferAttribute(p, 3));
    geometry.computeVertexNormals();
    return geometry;
  });
  return (roof: string) => {
    k.mesh(h, geo, roof, 0, y, 0);
    k.box(h, w, 0.028, d, roof, 0, y - 0.012, 0); // eave fascia
    // 清水脊: a raised ridge tile with the two ends kicked up.
    k.box(h, w, 0.034, 0.05, RIDGE, 0, y + rise, 0);
    for (const side of [-1, 1])
      k.box(
        h,
        0.05,
        0.05,
        0.042,
        RIDGE,
        side * (w / 2 - 0.02),
        y + rise + 0.02,
      );
    // Tier 1–3: ridge and plain roof planes carry the tiled-roof identity.
  };
}

/**
 * One range (进/座) of the compound. Local +z always faces the courtyard, so
 * the caller only picks a rotation: the outward faces stay blank grey brick
 * and every door and window lands on the garden side.
 */
function range(
  k: ModelKit,
  g: T.Group,
  city: CityPack,
  o: {
    x: number;
    z: number;
    rot: number;
    len: number; // along the ridge
    depth: number;
    height: number;
    rise: number;
    bays: number; // odd bay counts put a door on the centre line
    door?: boolean;
    // Width of the courtyard elevation. Where a neighbouring range crosses in
    // front of this one's ends, the timber facade has to stop short of it —
    // otherwise a painted lintel runs straight out through the compound wall.
    face?: number;
    // Roof width, when the eave has to reach past the gable to close a corner.
    roofW?: number;
  },
) {
  const h = new T.Group();
  h.position.set(o.x, 0, o.z);
  h.rotation.y = o.rot;
  g.add(h);
  const base = 0.04; // 台基 stone platform
  const zf = o.depth / 2;
  const face = o.face ?? o.len;
  k.box(h, o.len, base, o.depth + 0.07, STONE, 0, base / 2);
  k.box(h, o.len, o.height, o.depth, BRICK, 0, base + o.height / 2);
  k.box(h, o.len + 0.012, 0.075, o.depth + 0.012, PLINTH, 0, base + 0.037);
  // Courtyard elevation: plaster infill between painted timber columns.
  k.box(
    h,
    face - 0.03,
    o.height - 0.095,
    0.02,
    PLASTER,
    0,
    base + 0.085 + (o.height - 0.095) / 2,
    zf + 0.005,
  );
  const step = face / o.bays;
  for (let i = 0; i < o.bays; i++) {
    const x = (i - (o.bays - 1) / 2) * step;
    const middle =
      o.door !== false && i === (o.bays - 1) / 2 && o.bays % 2 === 1;
    if (middle) {
      k.box(
        h,
        step * 0.46,
        o.height * 0.74,
        0.022,
        TIMBER,
        x,
        base + o.height * 0.37,
        zf + 0.012,
      );
      k.box(h, step * 0.5, 0.032, 0.1, STONE, x, base + 0.016, zf + 0.06);
    } else {
      const ww = step * 0.56,
        wh = o.height * 0.4;
      k.box(h, ww, wh, 0.022, LATTICE, x, base + o.height * 0.58, zf + 0.012);
    }
  }
  // Painted columns and the lintel they carry, the courtyard's warm accent.
  // Only the interior columns are free-standing: on a 硬山 range the end
  // columns are buried in the gable walls, so drawing them would leave red
  // posts stranded outside the compound's corners.
  for (let i = 1; i < o.bays; i++)
    k.cylinder(
      h,
      0.016,
      o.height - 0.075,
      TIMBER,
      (i - o.bays / 2) * step,
      base + 0.075 + (o.height - 0.075) / 2,
      zf + 0.018,
      0.016,
      8,
    );
  k.box(h, face, 0.028, 0.038, TIMBER, 0, base + o.height - 0.022, zf + 0.02);
  gable(
    k,
    h,
    o.roofW ?? o.len + 0.02,
    o.depth + 0.12,
    base + o.height,
    o.rise,
  )(city.palette.roof);
}

export function courtyard(k: ModelKit, g: T.Group, c: CityPack) {
  // Swept earth floor of the whole compound, so no lawn shows between ranges.
  k.box(g, 1.48, 0.02, 1.46, "#b7a988", 0, 0.01);

  // 北屋 / 正房 — the senior range: widest, deepest, highest ridge, facing
  // due south across the court. Flanked by the two low 耳房 that close the
  // north corners of the compound.
  range(k, g, c, {
    x: 0,
    z: -0.46,
    rot: 0,
    len: 0.92,
    depth: 0.4,
    height: 0.36,
    rise: 0.2,
    bays: 3,
  });
  for (const side of [-1, 1])
    range(k, g, c, {
      x: side * 0.57,
      z: -0.5,
      rot: 0,
      len: 0.22,
      roofW: 0.26,
      // The 厢房 butts straight onto this gable, so keep the timber clear of
      // the joint rather than letting it fight the wing's outer wall.
      face: 0.18,
      depth: 0.32,
      height: 0.24,
      rise: 0.13,
      bays: 1,
    });

  // 东屋 / 西屋 — the two 厢房, mid-height, ridges running north–south, both
  // turned inward. Their outer walls double as the compound's side walls, so
  // they have to run the full way from the 耳房 gable to the south range: any
  // shortfall leaves a slot you can see the lane through.
  for (const side of [-1, 1])
    range(k, g, c, {
      x: side * -0.54,
      z: 0.03,
      rot: side * (Math.PI / 2),
      len: 0.74,
      face: 0.62, // only the stretch open to the court carries timber
      depth: 0.28,
      height: 0.3,
      rise: 0.16,
      bays: 3,
    });

  // 南屋 / 倒座房 — the lowest range, its back to the lane. Windows face the
  // court only; the street elevation stays a blank brick wall, so its eave
  // line runs flush with the two 厢房 gable ends and seals the south side.
  range(k, g, c, {
    x: 0,
    z: 0.53,
    rot: Math.PI,
    len: 1.36, // flush with the outer face of both 厢房
    roofW: 1.46, // but the eave runs on to close the two south corners
    face: 0.8, // only the bay between the wings is open to the court
    depth: 0.26,
    height: 0.24,
    rise: 0.13,
    bays: 3,
  });

  // 大门 — the compound's only opening to the street, set in the corner bay
  // of the south range and stepping forward and above its roof. Everything
  // else is sealed brick, which is what makes a siheyuan a siheyuan. The bay
  // is the south-EAST corner (+x): 大门开在巽位 is the one placement rule
  // every Beijing siheyuan follows.
  const gate = new T.Group();
  gate.position.set(0.5, 0, 0.55);
  g.add(gate);
  k.box(gate, 0.38, 0.04, 0.38, STONE, 0, 0.02);
  k.box(gate, 0.32, 0.32, 0.32, BRICK, 0, 0.2);
  k.box(gate, 0.332, 0.08, 0.332, PLINTH, 0, 0.08);
  gable(k, gate, 0.36, 0.44, 0.36, 0.16)(c.palette.roof);
  k.box(gate, 0.27, 0.29, 0.02, STONE, 0, 0.195, 0.162); // stone gate frame
  k.box(gate, 0.19, 0.24, 0.024, "#a5392e", 0, 0.17, 0.17); // lacquered leaves
  k.box(gate, 0.008, 0.24, 0.028, PLINTH, 0, 0.17, 0.172); // the meeting stile
  for (const side of [-1, 1]) {
    k.box(gate, 0.032, 0.038, 0.026, TIMBER, side * 0.05, 0.315, 0.172); // 门簪
    k.box(gate, 0.045, 0.08, 0.055, STONE, side * 0.115, 0.08, 0.185); // 门墩
  }
  k.box(gate, 0.32, 0.032, 0.085, STONE, 0, 0.016, 0.212);
  k.box(gate, 0.38, 0.016, 0.05, STONE, 0, 0.008, 0.255);
  // Stone kerb of the hutong outside: the gate steps land on it and the
  // plot's own footpath joins it, so the one door has somewhere to lead.
  k.box(g, 1.46, 0.024, 0.1, "#d9d3b9", 0, 0.012, 0.76);

  // 影壁: the screen wall set at an angle just inside the gate so nobody can
  // see straight from the lane into the courtyard. Small, but it is the first
  // thing you meet after the door, and it explains the corner gate.
  const screen = new T.Group();
  screen.position.set(0.3, 0, 0.26);
  screen.rotation.y = 0.7;
  g.add(screen);
  k.box(screen, 0.24, 0.17, 0.035, BRICK, 0, 0.085);
  k.box(screen, 0.19, 0.11, 0.045, PLASTER, 0, 0.09);
  k.box(screen, 0.27, 0.022, 0.06, RIDGE, 0, 0.18);

  // 十字甬路: the raised cross of paving that every courtyard is laid out on,
  // running door-to-door between the four ranges.
  k.box(g, 0.15, 0.016, 0.62, STONE, 0, 0.028, 0.05);
  k.box(g, 0.8, 0.016, 0.13, STONE, 0, 0.028, 0.05);
  // 海棠 planted as a matched pair in front of the main hall, the standard
  // arrangement; a glazed 鱼缸 sits in one of the quarters behind them.
  for (const side of [-1, 1]) k.tree(g, side * 0.23, -0.12, 0.44);
}

/** Low-tier lane house: gable roof, door and two grouped window colors. */
export function laneHouse(
  k: ModelKit,
  g: T.Group,
  c: CityPack,
  x = 0,
  z = 0,
  scale = 1,
  rotation = 0,
) {
  const h = new T.Group();
  h.position.set(x, 0, z);
  h.rotation.y = rotation;
  h.scale.setScalar(scale);
  g.add(h);
  k.box(h, 0.76, 0.36, 0.52, BRICK);
  gable(k, h, 0.8, 0.64, 0.36, 0.2)(c.palette.roof);
  k.box(h, 0.14, 0.25, 0.022, TIMBER, 0, 0.125, 0.268);
  for (const side of [-1, 1])
    k.box(h, 0.14, 0.12, 0.022, LATTICE, side * 0.235, 0.22, 0.268);
  k.box(h, 0.21, 0.03, 0.1, STONE, 0, 0.015, 0.31);
  return h;
}
