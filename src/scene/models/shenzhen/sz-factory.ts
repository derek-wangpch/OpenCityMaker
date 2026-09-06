import * as T from "three";
import type { Factory } from "../../kit";
import { GREY, TRIM, GLASS } from "./shared";

export const szFactoryFactory: Factory = (k, g) => {
  // Sawtooth shed: clerestory glazing beside each sloping roof.
  k.box(g, 1.42, 0.44, 0.66, "#d5cdb8", 0, 0.22, -0.24);
  // Closed sawtooth sections: slopes meet the clerestories without gaps.
  const pos: number[] = [];
  for (let i = 0; i < 4; i++) {
    const x = -0.71 + i * 0.355;
    const a = [x, 0.445, 0.09],
      b = [x + 0.355, 0.62, 0.09],
      c = [x + 0.355, 0.445, 0.09];
    const back = (p: number[]) => [p[0], p[1], -0.57];
    pos.push(
      ...a,
      ...c,
      ...b,
      ...back(a),
      ...back(b),
      ...back(c),
      ...a,
      ...b,
      ...back(b),
      ...a,
      ...back(b),
      ...back(a),
    );
    k.box(g, 0.016, 0.175, 0.66, GLASS, x + 0.35, 0.5325, -0.24);
  }
  k.mesh(
    g,
    k.geometry("sz-factory:sawtooth", () => {
      const geo = new T.BufferGeometry();
      geo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
      geo.computeVertexNormals();
      return geo;
    }),
    GREY,
  );
  k.box(g, 0.29, 0.27, 0.018, "#708e93", -0.35, 0.135, 0.099);
  // Dormitory slab with its open access corridor.
  k.box(g, 1.34, 0.66, 0.24, "#c9bfa8", 0, 0.33, 0.44);
  for (let r = 0; r < 3; r++) {
    k.box(g, 1.36, 0.02, 0.03, TRIM, 0, 0.14 + r * 0.21, 0.57);
    k.box(g, 1.36, 0.015, 0.02, GREY, 0, 0.2 + r * 0.21, 0.57);
    for (let c = 0; c < 5; c++)
      k.box(
        g,
        0.11,
        0.09,
        0.014,
        "#5e7480",
        -0.52 + c * 0.26,
        0.08 + r * 0.21,
        0.56,
      );
  }
};
