import * as T from "three";
import type { Factory } from "../../kit";
import { gable, ring } from "../../architecture";

export const syStmarysFactory: Factory = (k, g) => {
  const stone = "#c6a577",
    trim = "#e0c394",
    roof = "#717a79",
    glass = "#506969";
  // +Z: southern twin-tower entrance. Long nave and square-ended chancel.
  k.box(g, 0.94, 0.07, 1.48, trim, 0, 0.035);
  k.box(g, 0.44, 0.69, 1.34, stone, 0, 0.415, -0.02).name = "long-nave";
  gable(k, g, 0.49, 1.38, 0.24, roof, 0, 0.76, -0.02);
  for (const x of [-0.32, 0.32]) {
    k.box(g, 0.22, 0.4, 1.34, stone, x, 0.27, -0.02);
    // Half of each gable is buried in the nave: one outward shed slope.
    gable(k, g, 0.46, 1.36, 0.17, roof, x * 0.6875, 0.47, -0.02);
  }
  k.box(g, 1.17, 0.62, 0.33, stone, 0, 0.38, -0.23).name = "transept";
  const crossRoof = gable(k, g, 0.37, 1.22, 0.24, roof, 0, 0.69, -0.23);
  crossRoof.rotation.y = Math.PI / 2;
  k.box(g, 0.32, 0.39, 0.32, stone, 0, 0.97, -0.23).name = "crossing-tower";
  k.box(g, 0.37, 0.045, 0.37, trim, 0, 1.1775, -0.23);
  for (const x of [-0.15, 0.15])
    for (const z of [-0.38, -0.08])
      k.cylinder(g, 0.026, 0.13, stone, x, 1.245, z, 0, 6);
  for (const x of [-0.34, 0.34]) {
    k.box(g, 0.23, 0.92, 0.25, stone, x, 0.53, 0.53).name = "front-tower";
    k.box(g, 0.27, 0.045, 0.29, trim, x, 1.005, 0.53);
    k.cylinder(g, 0.126, 0.51, stone, x, 1.28, 0.53, 0, 8).name =
      "needle-spire";
  }
  // Stone front gable masks the slate roof end.
  k.box(g, 0.45, 0.68, 0.055, stone, 0, 0.41, 0.653);
  gable(k, g, 0.48, 0.065, 0.24, stone, 0, 0.75, 0.653);

  k.box(g, 1.2, 0.07, 0.37, trim, 0, 0.035, -0.23);
  k.box(g, 0.92, 0.035, 0.13, trim, 0, 0.0175, 0.735);

  // Shared pointed glazing silhouette, scaled into sparse grouped openings.
  const lancet = k.geometry("sy-stmarys:lancet", () => {
    const shape = new T.Shape();
    shape.moveTo(-0.5, 0);
    shape.lineTo(0.5, 0);
    shape.lineTo(0.5, 0.65);
    shape.quadraticCurveTo(0.5, 0.82, 0, 1);
    shape.quadraticCurveTo(-0.5, 0.82, -0.5, 0.65);
    shape.closePath();
    return new T.ShapeGeometry(shape, 6);
  });
  const pointed = (
    parent: T.Group,
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    color = glass,
  ) => {
    const mesh = k.mesh(parent, lancet, color, x, y, z);
    mesh.scale.set(w, h, 1);
    return mesh;
  };
  const rose = (parent: T.Group, radius: number, y: number, z: number) => {
    const disk = k.cylinder(parent, radius, 0.012, glass, 0, y, z, radius, 24);
    disk.rotation.x = Math.PI / 2;
    ring(k, parent, radius, 0.016, trim, 0, y, z + 0.008);
    ring(k, parent, radius * 0.3, 0.009, trim, 0, y, z + 0.014);
    for (let n = 0; n < 6; n++) {
      const a = (n * Math.PI) / 3;
      k.beam(
        parent,
        [Math.cos(a) * radius * 0.3, y + Math.sin(a) * radius * 0.3, z + 0.016],
        [Math.cos(a) * radius * 0.9, y + Math.sin(a) * radius * 0.9, z + 0.016],
        0.012,
        trim,
      );
    }
  };
  rose(g, 0.125, 0.62, 0.69);
  for (const [x, width, height] of [
    [0, 0.22, 0.29],
    [-0.34, 0.115, 0.21],
    [0.34, 0.115, 0.21],
  ]) {
    pointed(g, width + 0.055, height + 0.05, x, 0.075, 0.69, trim);
    pointed(g, width, height, x, 0.075, 0.694, "#615747");
    k.box(g, 0.014, height * 0.7, 0.012, trim, x, 0.075 + height * 0.35, 0.705);
  }
  for (const x of [-0.34, 0.34]) {
    for (const y of [0.4, 0.7]) k.box(g, 0.25, 0.026, 0.27, trim, x, y, 0.53);
    for (const offset of [-0.047, 0.047])
      pointed(g, 0.065, 0.21, x + offset, 0.75, 0.661);
    pointed(g, 0.075, 0.17, x, 0.47, 0.661);
    for (const dx of [-0.102, 0.102]) {
      k.box(g, 0.025, 0.92, 0.035, trim, x + dx, 0.53, 0.653);
      k.cylinder(g, 0.023, 0.15, stone, x + dx, 1.102, 0.653, 0, 6);
    }
  }
  // Side windows and solid buttresses repeat only four times per side.
  for (const sign of [-1, 1]) {
    const face = new T.Group();
    face.rotation.y = (sign * Math.PI) / 2;
    face.position.x = sign * 0.436;
    g.add(face);
    for (const z of [-0.56, 0.04, 0.3]) {
      pointed(face, 0.105, 0.25, -sign * z, 0.14, 0);
      pointed(face, 0.085, 0.14, -sign * z, 0.6, -0.212);
    }
    for (const z of [-0.62, -0.02, 0.4]) {
      k.box(g, 0.055, 0.43, 0.055, trim, sign * 0.435, 0.285, z);
      k.beam(g, [sign * 0.43, 0.5, z], [sign * 0.245, 0.72, z], 0.035, trim);
    }
    const end = new T.Group();
    end.position.set(sign * 0.59, 0, -0.23);
    end.rotation.y = (sign * Math.PI) / 2;
    g.add(end);
    gable(k, end, 0.36, 0.03, 0.24, stone, 0, 0.69);
    rose(end, 0.095, 0.55, 0.018);
    pointed(end, 0.16, 0.25, 0, 0.07, 0.021, trim);
    pointed(end, 0.115, 0.21, 0, 0.07, 0.024, "#615747");
    for (const x of [-0.145, 0.145])
      k.box(end, 0.03, 0.66, 0.035, trim, x, 0.4, 0.02);
    // Two large belfry openings on the visible crossing-tower sides.
    for (const offset of [-0.058, 0.058]) {
      const win = pointed(g, 0.07, 0.18, sign * 0.164, 0.94, -0.23 + offset);
      win.rotation.y = (sign * Math.PI) / 2;
    }
  }
  for (const z of [-0.394, -0.066]) {
    const back = new T.Group();
    back.position.set(0, 0, z);
    if (z < -0.23) back.rotation.y = Math.PI;
    g.add(back);
    for (const x of [-0.058, 0.058]) pointed(back, 0.07, 0.18, x, 0.94, 0);
  }
};
