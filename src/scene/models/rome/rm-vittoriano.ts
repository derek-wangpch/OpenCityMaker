import * as T from "three";
import type { Factory, ModelKit } from "../../kit";
import { gable } from "../../architecture";
const marble = "#e4dfcd",
  light = "#f0ebdb",
  shade = "#c9c4b1",
  bronze = "#688c7d";

// Toy-scale bronze silhouette; four horses remain distinct on each quadriga.
function horse(
  k: ModelKit,
  g: T.Group,
  x: number,
  y: number,
  z: number,
  s: number,
) {
  k.box(g, 0.07 * s, 0.075 * s, 0.17 * s, bronze, x, y + 0.1 * s, z);
  for (const dz of [-0.055, 0.055])
    k.box(
      g,
      0.055 * s,
      0.09 * s,
      0.025 * s,
      bronze,
      x,
      y + 0.045 * s,
      z + dz * s,
    );
  k.beam(
    g,
    [x, y + 0.12 * s, z + 0.045 * s],
    [x, y + 0.21 * s, z + 0.078 * s],
    0.043 * s,
    bronze,
  );
  k.box(
    g,
    0.045 * s,
    0.038 * s,
    0.077 * s,
    bronze,
    x,
    y + 0.21 * s,
    z + 0.099 * s,
  );
}
export const rmVittorianoFactory: Factory = (k, g) => {
  // +z faces the piazza; compressed terraces lead back to a curved portico.
  k.box(g, 1.44, 0.13, 1.18, shade, 0, 0.065, 0);
  k.box(g, 1.3, 0.26, 0.78, marble, 0, 0.23, -0.16);
  k.box(g, 1.35, 0.045, 0.82, light, 0, 0.38, -0.16);
  k.box(g, 1.15, 0.17, 0.52, marble, 0, 0.48, -0.28);
  k.box(g, 1.22, 0.04, 0.58, light, 0, 0.585, -0.28);
  for (let i = 0; i < 6; i++)
    k.box(g, 0.54, 0.04, 0.09, light, 0, 0.15 + i * 0.037, 0.56 - i * 0.056);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++)
      k.box(
        g,
        0.22,
        0.045,
        0.095,
        light,
        side * 0.42,
        0.405 + i * 0.045,
        0.12 - i * 0.055,
      );
    k.box(g, 0.27, 0.22, 0.28, marble, side * 0.565, 0.255, 0.31);
    const pool = k.cylinder(
      g,
      0.135,
      0.026,
      "#94b6aa",
      side * 0.56,
      0.16,
      0.46,
      0.135,
      16,
    );
    pool.scale.z = 0.6;
    k.box(g, 0.075, 0.12, 0.075, light, side * 0.6, 0.45, 0.31);
    k.sphere(g, 0.028, light, side * 0.6, 0.532, 0.31);
  }
  // A continuous shallow arc, shared by floor, rear wall and entablature.
  const point = (t: number) => new T.Vector2(0.48 * t, -0.37 + 0.1 * t * t);
  const curved = (depth: number, height: number, y: number, color: string) => {
    const geo = k.geometry(`vittoriano-arc:${depth}:${height}`, () => {
      const s = new T.Shape();
      for (let i = 0; i <= 20; i++) {
        const p = point(-1 + i / 10);
        if (i === 0) s.moveTo(p.x, p.y - depth / 2);
        else s.lineTo(p.x, p.y - depth / 2);
      }
      for (let i = 20; i >= 0; i--) {
        const p = point(-1 + i / 10);
        s.lineTo(p.x, p.y + depth / 2);
      }
      s.closePath();
      const a = new T.ExtrudeGeometry(s, {
        depth: height,
        bevelEnabled: false,
      });
      a.rotateX(Math.PI / 2);
      return a;
    });
    k.mesh(g, geo, color, 0, y + height, 0);
  };
  curved(0.26, 0.055, 0.6, light);
  curved(0.28, 0.065, 1.025, light);
  for (let i = 0; i < 12; i++) {
    const p = point(-1 + (2 * i) / 11);
    k.cylinder(g, 0.022, 0.38, light, p.x, 0.84, p.y + 0.07, 0.019, 10);
    k.box(g, 0.058, 0.034, 0.06, marble, p.x, 1.018, p.y + 0.07);
    k.box(g, 0.042, 0.055, 0.045, marble, p.x, 1.116, p.y + 0.05);
    k.box(g, 0.09, 0.38, 0.065, shade, p.x, 0.84, p.y - 0.1);
  }
  for (const x of [-0.58, 0.58]) {
    k.box(g, 0.27, 0.44, 0.37, marble, x, 0.82, -0.3);
    k.box(g, 0.17, 0.3, 0.016, "#807f72", x, 0.84, -0.106);
    for (const dx of [-0.1, 0, 0.1])
      k.cylinder(g, 0.023, 0.34, light, x + dx, 0.85, -0.084, 0.02, 10);
    k.box(g, 0.31, 0.065, 0.42, light, x, 1.055, -0.3);
    gable(k, g, 0.28, 0.065, 0.075, marble, x, 1.09, -0.095);
    k.box(g, 0.28, 0.04, 0.31, marble, x, 1.165, -0.3);
    for (let i = 0; i < 4; i++)
      horse(k, g, x + (i - 1.5) * 0.055, 1.185, -0.21, 0.6);
    k.cylinder(g, 0.021, 0.15, bronze, x, 1.3, -0.38, 0.015, 8);
    k.sphere(g, 0.025, bronze, x, 1.4, -0.38);
    for (const side of [-1, 1])
      k.beam(g, [x, 1.34, -0.38], [x + side * 0.08, 1.43, -0.4], 0.026, bronze);
  }
  // Central equestrian monument stands in front of the portico, not on its roof.
  k.box(g, 0.24, 0.22, 0.23, shade, 0, 0.49, 0.15);
  k.box(g, 0.28, 0.035, 0.26, light, 0, 0.62, 0.15);
  const rider = new T.Group();
  rider.position.set(0, 0.64, 0.15);
  rider.rotation.y = Math.PI / 2;
  g.add(rider);
  horse(k, rider, 0, 0, 0, 1.05);
  k.cylinder(rider, 0.028, 0.12, bronze, 0, 0.22, -0.015, 0.021, 8);
  k.sphere(rider, 0.029, bronze, 0, 0.302, -0.015);
};
