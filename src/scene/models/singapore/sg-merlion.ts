import * as T from "three";
import type { Factory } from "../../kit";
import { loft, ring } from "../../architecture";

export const sgMerlionFactory: Factory = (k, g) => {
  const ivory = "#eee9da",
    relief = "#d8d3c3",
    water = "#a9d5d7";
  k.box(g, 0.92, 0.045, 1.26, "#7daeb6", 0, 0.023, 0.1);
  k.cylinder(g, 0.34, 0.12, "#b9b7a4", 0, 0.105, -0.2, 0.34, 16);
  for (let i = 0; i < 3; i++) {
    const wave = ring(
      k,
      g,
      0.27 - i * 0.03,
      0.023,
      i % 2 ? ivory : "#6eaaa9",
      0,
      0.18 + i * 0.033,
      -0.2,
    );
    wave.rotation.x = Math.PI / 2;
  }
  // Continuous fish body; broad curl at the base, a waist, then lion chest.
  const sections = [
    [0.23, 0.23, 0.17, -0.22],
    [0.37, 0.22, 0.17, -0.24],
    [0.56, 0.16, 0.14, -0.2],
    [0.76, 0.145, 0.14, -0.14],
    [0.92, 0.2, 0.17, -0.14],
  ];
  loft(
    k,
    g,
    "sg-merlion:body",
    sections.map(([y, w, d, z]) => ({
      y,
      points: Array.from({ length: 16 }, (_, i): [number, number] => [
        Math.cos((i * Math.PI) / 8) * w,
        z + Math.sin((i * Math.PI) / 8) * d,
      ]),
    })),
    ivory,
  );
  // Grouped scale relief rather than a stack of cylinders.
  for (let row = 0; row < 4; row++) {
    const y = 0.34 + row * 0.115,
      w = 0.215 - row * 0.02,
      z = -0.23 + row * 0.023;
    for (let i = 0; i < 7; i++) {
      const a = ((i + (row % 2) * 0.5) * Math.PI * 2) / 7;
      const scale = k.sphere(
        g,
        0.044,
        relief,
        Math.cos(a) * w,
        y,
        z + Math.sin(a) * 0.145,
      );
      scale.scale.set(0.048, 0.031, 0.024);
      scale.rotation.y = -a + Math.PI / 2;
    }
  }
  const head = k.sphere(g, 0.235, ivory, 0, 1.065, -0.12);
  head.scale.set(0.22, 0.25, 0.23);
  // Flowing mane sheets down both sides and the back, kept legible at tile size.
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * 0.12 + i * Math.PI * 0.095;
    for (const side of [-1, 1]) {
      const x = Math.sin(a) * 0.19 * side,
        z = -0.12 - Math.cos(a) * 0.16;
      const lock = k.geometry(
        `sg-merlion:mane:${i}:${side}`,
        () =>
          new T.TubeGeometry(
            new T.CatmullRomCurve3([
              new T.Vector3(x * 0.65, 1.245 - i * 0.01, z),
              new T.Vector3(x, 1.08, z - 0.035),
              new T.Vector3(x * 1.12, 0.83 - i * 0.008, z - 0.08),
            ]),
            5,
            0.03,
            4,
            false,
          ),
      );
      k.mesh(g, lock, i % 2 ? relief : ivory);
    }
  }
  for (const side of [-1, 1]) {
    k.sphere(g, 0.065, ivory, side * 0.18, 1.24, -0.095);
    k.sphere(g, 0.018, "#5b615b", side * 0.125, 1.13, 0.068);
    const fin = k.sphere(g, 0.1, ivory, side * 0.1, 0.78, 0.01);
    fin.scale.set(0.065, 0.18, 0.055);
    fin.rotation.z = side * 0.35;
  }
  k.box(g, 0.18, 0.09, 0.17, ivory, 0, 1.055, 0.125);
  k.sphere(g, 0.038, relief, 0, 1.11, 0.196);
  k.box(g, 0.09, 0.039, 0.01, "#59605b", 0, 1.045, 0.215);
  k.box(g, 0.14, 0.035, 0.13, ivory, 0, 1.01, 0.145);
  const jet = k.geometry(
    "sg-merlion:water",
    () =>
      new T.TubeGeometry(
        new T.QuadraticBezierCurve3(
          new T.Vector3(0, 1.045, 0.22),
          new T.Vector3(0, 1.045, 0.64),
          new T.Vector3(0, 0.07, 0.69),
        ),
        20,
        0.018,
        6,
        false,
      ),
  );
  k.mesh(g, jet, water);
  const splash = k.sphere(g, 0.08, water, 0, 0.055, 0.69);
  splash.scale.y = 0.025;
};
