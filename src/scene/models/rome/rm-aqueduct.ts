import type { Factory } from "../../kit";
import { ExtrudeGeometry, Shape } from "three";
export const rmAqueductFactory: Factory = (k, g) => {
  // Aqua Claudia-inspired section: one tall arcade and the conduit above it.
  // x runs along the aqueduct; its narrow cross section is visible from +x.
  const stone = "#baa180",
    trim = "#d1ba92";
  const bay = k.geometry("rome-aqueduct-solid-bay", () => {
    const s = new Shape();
    s.moveTo(-0.14, 0);
    s.lineTo(-0.14, 0.72);
    s.lineTo(0.14, 0.72);
    s.lineTo(0.14, 0);
    s.lineTo(0.087, 0);
    s.lineTo(0.087, 0.56);
    s.absarc(0, 0.56, 0.087, 0, Math.PI, false);
    s.lineTo(-0.087, 0);
    s.closePath();
    const geo = new ExtrudeGeometry(s, {
      depth: 0.23,
      bevelEnabled: false,
      curveSegments: 8,
    });
    geo.translate(0, 0, -0.115);
    return geo;
  });
  for (let i = -2; i <= 2; i++) {
    const x = i * 0.275;
    k.mesh(g, bay, stone, x, 0.045);
    k.box(g, 0.082, 0.08, 0.27, trim, x - 0.12, 0.04, 0);
    for (const z of [-0.13, 0.13])
      k.box(g, 0.082, 0.035, 0.027, trim, x - 0.12, 0.595, z);
  }
  k.box(g, 1.43, 0.055, 0.29, trim, 0, 0.787);
  // Dark channel end communicates the water conduit without bright open water.
  k.box(g, 1.43, 0.11, 0.26, stone, 0, 0.86);
  k.box(g, 1.46, 0.045, 0.3, trim, 0, 0.938);
  for (const x of [-0.72, 0.72])
    k.box(g, 0.008, 0.06, 0.125, "#756b56", x, 0.86, 0);
};
