import * as T from "three";
import type { Factory } from "../../kit";
import { gable } from "../../architecture";

export const syUniversityFactory: Factory = (k, g) => {
  const stone = "#c8ac81",
    trim = "#e0c69a",
    roof = "#68716d";
  // +Z is the entrance elevation. Compressed wings enclose a real open quad.
  k.box(g, 1.42, 0.025, 1.4, trim, 0, 0.0125);
  k.box(g, 0.94, 0.012, 0.83, "#91a875", 0, 0.031, -0.1).name = "quad-lawn";
  k.box(g, 0.13, 0.015, 1.18, trim, 0, 0.04, 0.02);
  k.box(g, 0.96, 0.015, 0.11, trim, 0, 0.04, -0.1);
  for (const x of [-0.6, 0.6]) {
    const h = x > 0 ? 0.56 : 0.44;
    k.box(g, 0.24, h, 1.18, stone, x, h / 2, -0.04).name = "side-wing";
    gable(k, g, 0.28, 1.22, 0.16, roof, x, h, -0.04);
  }
  k.box(g, 1.2, 0.43, 0.23, stone, 0, 0.215, -0.61);
  const rearRoof = gable(k, g, 0.27, 1.22, 0.14, roof, 0, 0.43, -0.61);
  rearRoof.rotation.y = Math.PI / 2;
  for (const x of [-0.47, 0.47]) {
    k.box(g, 0.5, 0.5, 0.28, stone, x, 0.25, 0.5);
    const r = gable(k, g, 0.32, 0.5, 0.16, roof, x, 0.5, 0.5);
    r.rotation.y = Math.PI / 2;
  }
  // Extruded stone around a pointed opening; no box behind the passage.
  const tower = k.geometry("sy-university:open-tower", () => {
    const s = new T.Shape();
    s.moveTo(-0.23, 0);
    s.lineTo(-0.23, 1.22);
    s.lineTo(0.23, 1.22);
    s.lineTo(0.23, 0);
    s.lineTo(0.12, 0);
    s.lineTo(0.12, 0.24);
    s.quadraticCurveTo(0.12, 0.33, 0, 0.4);
    s.quadraticCurveTo(-0.12, 0.33, -0.12, 0.24);
    s.lineTo(-0.12, 0);
    s.closePath();
    const geo = new T.ExtrudeGeometry(s, {
      depth: 0.34,
      bevelEnabled: false,
      curveSegments: 6,
    });
    geo.translate(0, 0, -0.17);
    return geo;
  });
  k.mesh(g, tower, stone, 0, 0, 0.5).name = "open-clock-tower";
  for (const x of [-0.22, 0.22])
    for (const z of [0.34, 0.66]) {
      k.cylinder(g, 0.053, 1.25, stone, x, 0.625, z, 0.053, 8);
      k.cylinder(g, 0.043, 0.22, trim, x, 1.36, z, 0.037, 8);
      k.cylinder(g, 0.055, 0.13, roof, x, 1.535, z, 0, 8);
    }
  for (const z of [0.33, 0.67]) {
    k.box(g, 0.47, 0.065, 0.04, trim, 0, 1.23, z);
    for (const x of [-0.16, 0, 0.16])
      k.box(g, 0.075, 0.055, 0.04, trim, x, 1.285, z);
  }
  for (const x of [-0.23, 0.23]) {
    k.box(g, 0.04, 0.065, 0.34, trim, x, 1.23, 0.5);
    k.box(g, 0.04, 0.055, 0.08, trim, x, 1.285, 0.5);
  }
  const glass = "#566d69";
  // Broad stone courses and bay windows, not a tiled texture.
  for (const y of [0.46, 0.76, 1.02]) {
    k.box(g, 0.49, 0.025, 0.37, trim, 0, y, 0.5);
  }
  for (const z of [0.322, 0.678])
    for (const y of [0.59, 0.88, 1.12]) {
      k.box(g, 0.19, 0.18, 0.024, trim, 0, y, z);
      k.box(g, 0.15, 0.15, 0.028, glass, 0, y, z);
      for (const x of [0]) k.box(g, 0.012, 0.16, 0.032, trim, x, y, z);
    }
  for (const x of [-0.237, 0.237])
    for (const y of [0.87, 1.12]) {
      k.box(g, 0.018, 0.14, 0.11, glass, x, y, 0.5);
      k.box(g, 0.025, 0.15, 0.014, trim, x, y, 0.5);
    }
  // The clock sits in a square crest at the front parapet, above the windows.
  k.box(g, 0.16, 0.18, 0.045, stone, 0, 1.29, 0.683);
  const clock = k.cylinder(
    g,
    0.066,
    0.016,
    "#f4e9cc",
    0,
    1.295,
    0.715,
    0.066,
    24,
  );
  clock.rotation.x = Math.PI / 2;
  clock.name = "clock-face";
  k.box(g, 0.012, 0.045, 0.012, glass, 0, 1.312, 0.727);
  k.beam(g, [0, 1.295, 0.727], [0.034, 1.278, 0.727], 0.012, glass);
  for (const [x, y] of [
    [0, 1.347],
    [0, 1.243],
    [-0.052, 1.295],
    [0.052, 1.295],
  ])
    k.box(g, 0.01, 0.01, 0.009, glass, x, y, 0.727);
  // Pointed stone reveal follows the same opening, leaving its centre empty.
  for (const z of [0.318, 0.682]) {
    for (const x of [-0.137, 0.137])
      k.box(g, 0.034, 0.24, 0.028, trim, x, 0.12, z);
    const shape = k.geometry("sy-university:pointed-reveal", () => {
      const s = new T.Shape();
      s.moveTo(-0.154, 0.24);
      s.quadraticCurveTo(-0.154, 0.35, 0, 0.437);
      s.quadraticCurveTo(0.154, 0.35, 0.154, 0.24);
      s.lineTo(0.12, 0.24);
      s.quadraticCurveTo(0.12, 0.33, 0, 0.4);
      s.quadraticCurveTo(-0.12, 0.33, -0.12, 0.24);
      s.closePath();
      const geo = new T.ExtrudeGeometry(s, {
        depth: 0.028,
        bevelEnabled: false,
        curveSegments: 6,
      });
      geo.translate(0, 0, -0.014);
      return geo;
    });
    k.mesh(g, shape, trim, 0, 0, z);
  }
  for (const x of [-0.6, -0.37, 0.37, 0.6]) {
    for (const y of [0.16, 0.37]) {
      k.box(g, 0.13, 0.14, 0.018, trim, x, y, 0.649);
      k.box(g, 0.095, 0.11, 0.023, glass, x, y, 0.652);
      k.box(g, 0.013, 0.12, 0.028, trim, x, y, 0.657);
    }
    k.box(g, 0.06, 0.05, 0.05, trim, x, 0.542, 0.63);
  }
  for (const x of [-0.47, 0.47])
    k.box(g, 0.49, 0.025, 0.035, trim, x, 0.507, 0.643);
  for (const x of [-0.6, 0.6]) {
    const h = x > 0 ? 0.56 : 0.44;
    for (const z of [-0.4, -0.04, 0.32]) {
      for (const face of [-1, 1]) {
        const xx = x + face * 0.125;
        for (const y of [0.15, h - 0.1]) {
          k.box(g, 0.018, 0.12, 0.13, trim, xx, y, z);
          k.box(g, 0.024, 0.095, 0.095, glass, xx, y, z);
        }
      }
    }
  }
  for (const x of [-0.36, -0.12, 0.12, 0.36]) {
    k.box(g, 0.12, 0.14, 0.018, glass, x, 0.24, -0.487);
    k.box(g, 0.014, 0.15, 0.024, trim, x, 0.24, -0.482);
  }
};
