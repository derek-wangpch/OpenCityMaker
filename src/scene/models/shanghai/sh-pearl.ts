import * as T from "three";
import type { Factory } from "../../kit";

export const shPearlFactory: Factory = (k, g) => {
  const concrete = "#b9c4c3",
    rose = "#aa667e",
    silver = "#e0dddd";
  k.cylinder(g, 0.53, 0.07, "#9aa79f", 0, 0.035, 0, 0.53, 24);
  // Three separate vertical tubes remain visible between the large spheres.
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + Math.PI / 6;
    const x = Math.cos(a),
      z = Math.sin(a);
    k.cylinder(g, 0.043, 1.61, concrete, x * 0.09, 0.875, z * 0.09, 0.043, 12);
    k.beam(
      g,
      [x * 0.43, 0.07, z * 0.43],
      [x * 0.12, 0.67, z * 0.12],
      0.085,
      concrete,
    );
    k.sphere(g, 0.074, silver, x * 0.3, 0.33, z * 0.3);
  }
  // Shared spherical profile keeps the coloured glazing flush with the shell.
  const pearl = (r: number, y: number) => {
    const shell = k.mesh(
      g,
      k.geometry("sh-pearl-shell", () => new T.SphereGeometry(1, 20, 12)),
      concrete,
      0,
      y,
    );
    shell.scale.setScalar(r);
    const belt = k.mesh(
      g,
      k.geometry(
        "sh-pearl-belt",
        () =>
          new T.SphereGeometry(
            1,
            20,
            4,
            0,
            Math.PI * 2,
            Math.PI * 0.34,
            Math.PI * 0.32,
          ),
      ),
      rose,
      0,
      y,
    );
    belt.scale.setScalar(r * 1.006);
    k.cylinder(g, r * 1.013, 0.018, silver, 0, y, 0, r * 1.013, 20);
  };
  pearl(0.29, 0.73);
  pearl(0.25, 1.69);
  k.cylinder(g, 0.047, 0.44, concrete, 0, 1.98, 0, 0.037, 12);
  pearl(0.09, 2.13);
  // Five small hotel pods are grouped in the open span, without tiny windows.
  for (let i = 0; i < 5; i++) {
    k.sphere(g, 0.051, rose, 0, 1.08 + i * 0.09, 0);
  }
  k.cylinder(g, 0.023, 0.23, silver, 0, 2.31, 0, 0.015, 10);
  k.cylinder(g, 0.012, 0.21, concrete, 0, 2.53, 0, 0.003, 8);
};
