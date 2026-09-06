import type { Factory, ModelKit } from "../../kit";
import { dome, gable } from "../../architecture";
import { LatheGeometry, Vector2, type Group } from "three";

const stone = "#e6d4b4";
const stoneLight = "#f2e4c8";
const stoneDeep = "#d0bc96";
const lead = "#9aa198";
const rib = "#ddd4bc";
const tile = "#b07852";
const voidC = "#5a5246";
const gold = "#c9a86a";

/** Smaller crossing cupola: short drum, raised cap, miniature lantern. */
function cupola(
  k: ModelKit,
  g: Group,
  r: number,
  x: number,
  y: number,
  z: number,
) {
  k.cylinder(g, r * 0.72, r * 0.7, stone, x, y + r * 0.35, z, r * 0.72, 12);
  k.cylinder(g, r * 0.8, 0.02, stoneLight, x, y + r * 0.7, z);
  dome(k, g, r, r * 1.15, lead, x, y + r * 0.7, z);
  const ly = y + r * 1.85;
  k.cylinder(g, r * 0.16, r * 0.22, stone, x, ly + r * 0.11, z, r * 0.16, 8);
  dome(k, g, r * 0.18, r * 0.16, lead, x, ly + r * 0.2, z);
  k.cylinder(g, 0.008, r * 0.16, gold, x, ly + r * 0.42, z);
}

export const rmStpetersFactory: Factory = (k, g) => {
  // +z = east facade facing the square. Church depth is compressed so the
  // colonnade and Latin cross can share the 1.6 plot; facade width is not.
  const facadeZ = 0.1;
  const crossZ = -0.3;
  const facadeW = 1.16;
  const bodyH = 0.52;
  const atticH = 0.13;
  const drumH = 0.34;
  const drumR = 0.26;
  const domeR = 0.29;
  const domeH = 0.42;
  const drumY = bodyH + 0.1;
  const domeY = drumY + drumH;
  const colH = 0.2;

  // Bernini's arms: short trapezoid from the facade corners into an
  // ellipse that is wider than the church and open toward the via.
  const zC = 0.36;
  const rx = 0.66;
  const rz = 0.28;
  const armPoint = (side: number, t: number) => {
    if (t < 0.16) {
      const u = t / 0.16;
      return [
        side * (0.56 + (rx * Math.cos(-0.55) - 0.56) * u),
        0.12 + (zC + rz * Math.sin(-0.55) - 0.12) * u,
      ] as const;
    }
    const u = (t - 0.16) / 0.84;
    const th = -0.55 + u * 1.85;
    return [side * rx * Math.cos(th), zC + rz * Math.sin(th)] as const;
  };
  for (const side of [-1, 1]) {
    let px = 0,
      pz = 0;
    for (let i = 0; i < 12; i++) {
      const t = i / 11;
      const [x, z] = armPoint(side, t);
      for (const inset of [0, 0.05])
        k.cylinder(g, 0.016, colH, stoneLight, x - side * inset, colH / 2, z);
      if (i > 0) {
        const mx = (px + x) / 2,
          mz = (pz + z) / 2;
        const yaw = Math.atan2(x - px, z - pz);
        const span = Math.hypot(x - px, z - pz) + 0.02;
        const ent = k.box(g, 0.11, 0.035, span, stoneDeep, mx, colH + 0.01, mz);
        ent.rotation.y = yaw;
        const roof = k.box(g, 0.12, 0.028, span, tile, mx, colH + 0.04, mz);
        roof.rotation.y = yaw;
        k.box(g, 0.028, 0.045, 0.028, stoneLight, x, colH + 0.07, z);
      }
      px = x;
      pz = z;
    }
  }

  // Vatican obelisk at the oval centre; fountain discs at the two foci.
  k.box(g, 0.08, 0.04, 0.08, stoneDeep, 0, 0.02, zC);
  k.cylinder(g, 0.018, 0.42, stoneDeep, 0, 0.25, zC, 0.006, 4);
  k.sphere(g, 0.016, gold, 0, 0.48, zC);
  for (const x of [-0.28, 0.28]) {
    k.cylinder(g, 0.055, 0.035, stoneLight, x, 0.018, zC);
    k.cylinder(g, 0.03, 0.05, stoneDeep, x, 0.04, zC);
  }

  // Steps up to Maderno's facade.
  for (let i = 0; i < 3; i++)
    k.box(
      g,
      facadeW - 0.08 - i * 0.06,
      0.035,
      0.08,
      stoneLight,
      0,
      0.018 + i * 0.03,
      facadeZ + 0.16 - i * 0.055,
    );

  // Latin-cross body: nave, crossing, transepts, west apse.
  k.box(g, 0.74, bodyH, 0.38, stone, 0, bodyH / 2, -0.02);
  k.box(g, 0.78, bodyH + 0.06, 0.42, stone, 0, (bodyH + 0.06) / 2, crossZ);
  k.box(g, 1.22, bodyH, 0.34, stone, 0, bodyH / 2, crossZ);
  k.box(g, 0.64, bodyH, 0.2, stone, 0, bodyH / 2, -0.54);
  k.cylinder(g, 0.18, bodyH, stone, 0, bodyH / 2, -0.62, 0.18, 14);
  k.box(g, 0.82, 0.1, 0.46, stoneDeep, 0, bodyH + 0.11, crossZ);
  k.box(g, 1.26, 0.03, 0.38, stoneLight, 0, bodyH + 0.01, crossZ);
  for (const x of [-0.38, 0.38])
    k.box(g, 0.016, 0.12, 0.1, voidC, x, 0.34, -0.02);

  // Roof ridges and rounded transept ends keep the side view church-like.
  gable(k, g, 0.48, 0.46, 0.095, tile, 0, bodyH + 0.035, -0.045);
  for (const x of [-0.49, 0.49]) {
    k.cylinder(g, 0.16, bodyH, stone, x, bodyH / 2, crossZ, 0.16, 16);
    k.cylinder(
      g,
      0.175,
      0.028,
      stoneLight,
      x,
      bodyH + 0.016,
      crossZ,
      0.175,
      16,
    );
  }

  // Windows follow the exposed arc of each rounded transept end.
  for (const side of [-1, 1]) {
    for (let i = -1; i <= 1; i++) {
      const a = (i * Math.PI) / 6;
      const nx = side * Math.cos(a),
        nz = Math.sin(a);
      const pane = k.box(
        g,
        0.044,
        0.12,
        0.012,
        voidC,
        side * 0.49 + nx * 0.162,
        0.34,
        crossZ + nz * 0.162,
      );
      pane.rotation.y = Math.atan2(nx, nz);
      const sill = k.box(
        g,
        0.06,
        0.018,
        0.02,
        stoneLight,
        side * 0.49 + nx * 0.166,
        0.273,
        crossZ + nz * 0.166,
      );
      sill.rotation.y = pane.rotation.y;
    }
  }

  // Two eastern crossing cupolas — the pair that reads from the square.
  for (const x of [-0.34, 0.34]) cupola(k, g, 0.11, x, bodyH + 0.02, -0.12);

  // Maderno facade: giant order, pediment, attic, clock ends, statue posts.
  k.box(g, facadeW, bodyH, 0.18, stone, 0, bodyH / 2, facadeZ);
  k.box(g, 0.4, bodyH, 0.08, stone, 0, bodyH / 2, facadeZ + 0.08);
  for (let i = 0; i < 8; i++) {
    const x = ((i - 3.5) * (facadeW - 0.16)) / 7;
    k.cylinder(g, 0.028, 0.42, stoneLight, x, 0.27, facadeZ + 0.12);
    k.box(g, 0.07, 0.035, 0.07, stoneLight, x, 0.49, facadeZ + 0.12);
  }
  k.box(g, facadeW + 0.04, 0.055, 0.22, stoneDeep, 0, 0.545, facadeZ + 0.02);
  gable(k, g, 0.48, 0.14, 0.13, stoneLight, 0, 0.57, facadeZ + 0.1);
  k.box(g, facadeW, atticH, 0.18, stone, 0, 0.595 + atticH / 2, facadeZ);
  for (const x of [-0.52, 0.52]) {
    k.box(g, 0.14, atticH + 0.05, 0.16, stoneDeep, x, 0.63, facadeZ + 0.02);
    const clock = k.cylinder(
      g,
      0.038,
      0.012,
      voidC,
      x,
      0.65,
      facadeZ + 0.11,
      0.038,
      16,
    );
    clock.rotation.x = Math.PI / 2;
    k.box(g, 0.006, 0.027, 0.006, gold, x, 0.661, facadeZ + 0.12);
    k.box(g, 0.022, 0.006, 0.006, gold, x + 0.008, 0.65, facadeZ + 0.12);
  }
  for (let i = 0; i < 13; i++) {
    const x = ((i - 6) * (facadeW - 0.1)) / 12;
    k.cylinder(g, 0.015, 0.07, stoneLight, x, 0.76, facadeZ);
    k.box(g, 0.028, 0.04, 0.02, stoneLight, x, 0.81, facadeZ);
  }
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 0.2;
    k.box(g, i === 2 ? 0.1 : 0.07, 0.16, 0.03, voidC, x, 0.12, facadeZ + 0.1);
  }
  for (const x of [-0.32, 0, 0.32])
    k.box(g, 0.08, 0.1, 0.02, voidC, x, 0.36, facadeZ + 0.12);

  // Michelangelo drum: paired columns as an aerial portico, 16 bays.
  k.cylinder(g, drumR, drumH, stone, 0, drumY + drumH / 2, crossZ, drumR, 20);
  k.cylinder(g, drumR + 0.03, 0.035, stoneLight, 0, drumY + drumH, crossZ);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const cx = Math.sin(a) * (drumR + 0.012);
    const cz = crossZ + Math.cos(a) * (drumR + 0.012);
    for (const s of [-1, 1]) {
      const ox = Math.cos(a) * s * 0.028;
      const oz = -Math.sin(a) * s * 0.028;
      k.cylinder(
        g,
        0.016,
        drumH * 0.82,
        stoneLight,
        cx + ox,
        drumY + drumH * 0.45,
        cz + oz,
      );
    }
    if (i % 2 === 0) {
      const pane = k.box(
        g,
        0.042,
        0.1,
        0.014,
        voidC,
        Math.sin(a) * (drumR + 0.004),
        drumY + drumH * 0.48,
        crossZ + Math.cos(a) * (drumR + 0.004),
      );
      pane.rotation.y = a;
    }
  }

  // Raised ogival Cupolone — della Porta steepened Michelangelo's hemisphere.
  // Pointed circular-arc profile shared by the shell and all sixteen ribs.
  const arcR = (domeR * domeR + domeH * domeH) / (2 * domeR);
  const profile = Array.from({ length: 13 }, (_, i) => {
    const y = (domeH * i) / 12;
    return new Vector2(
      Math.max(0, Math.sqrt(arcR * arcR - y * y) - (arcR - domeR)),
      y,
    );
  });
  k.mesh(
    g,
    k.geometry("rm-stpeters-ogival-dome", () => new LatheGeometry(profile, 32)),
    lead,
    0,
    domeY,
    crossZ,
  );
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    for (let j = 0; j < profile.length - 1; j++) {
      const p = profile[j],
        q = profile[j + 1];
      k.beam(
        g,
        [Math.sin(a) * p.x, domeY + p.y, crossZ + Math.cos(a) * p.x],
        [Math.sin(a) * q.x, domeY + q.y, crossZ + Math.cos(a) * q.x],
        0.012,
        rib,
      );
    }
  }

  // Lantern, gilt ball and cross.
  const ly = domeY + domeH;
  k.cylinder(g, 0.062, 0.18, stone, 0, ly + 0.09, crossZ, 0.062, 12);
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    k.cylinder(
      g,
      0.012,
      0.15,
      stoneLight,
      Math.sin(a) * 0.066,
      ly + 0.09,
      crossZ + Math.cos(a) * 0.066,
    );
  }
  k.cylinder(g, 0.072, 0.024, stoneLight, 0, ly + 0.18, crossZ);
  dome(k, g, 0.058, 0.065, lead, 0, ly + 0.18, crossZ);
  k.sphere(g, 0.022, gold, 0, ly + 0.27, crossZ);
  k.cylinder(g, 0.008, 0.12, gold, 0, ly + 0.34, crossZ);
  k.beam(
    g,
    [-0.038, ly + 0.32, crossZ],
    [0.038, ly + 0.32, crossZ],
    0.01,
    gold,
  );
};
