import type { Factory } from "../../kit";
import * as T from "three";
export const ldCoventFactory: Factory = (k, g) => {
  const green = "#5c7c70",
    stone = "#bdab89";
  k.box(g, 1.46, 0.035, 0.95, "#c6bda5", 0, 0.018);
  for (const z of [-0.38, 0.38]) {
    for (let i = -3; i <= 3; i++) {
      k.box(g, 0.067, 0.4, 0.07, stone, i * 0.2, 0.23, z);
      k.box(g, 0.09, 0.038, 0.1, "#d1bd97", i * 0.2, 0.445, z);
    }
    k.box(g, 1.43, 0.075, 0.13, stone, 0, 0.5, z);
  }
  // Continuous barrel canopy, its ridge running along X.
  const shape = new T.Shape();
  for (let i = 0; i <= 16; i++) {
    const a = (i * Math.PI) / 16,
      x = -0.37 * Math.cos(a),
      y = 0.2 * Math.sin(a);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  for (let i = 16; i >= 0; i--) {
    const a = (i * Math.PI) / 16;
    shape.lineTo(-0.35 * Math.cos(a), 0.18 * Math.sin(a));
  }
  shape.closePath();
  const roof = k.mesh(
    g,
    k.geometry("ld-covent-barrel", () => {
      const geo = new T.ExtrudeGeometry(shape, {
        depth: 1.42,
        bevelEnabled: false,
      });
      geo.translate(0, 0, -0.71);
      return geo;
    }),
    "#94aead",
    0,
    0.55,
  );
  roof.rotation.y = Math.PI / 2;
  for (const x of [-0.6, -0.3, 0, 0.3, 0.6])
    for (let j = 0; j < 8; j++) {
      const point = (n: number) => [
        x,
        0.55 + 0.204 * Math.sin((n * Math.PI) / 8),
        -0.374 * Math.cos((n * Math.PI) / 8),
      ];
      k.beam(g, point(j), point(j + 1), 0.018, green);
    }
  for (const x of [-0.71, 0.71])
    for (const z of [-0.3, 0.3]) k.box(g, 0.085, 0.52, 0.13, stone, x, 0.29, z);
};
