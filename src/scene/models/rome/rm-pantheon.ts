import type { Factory } from "../../kit";
import * as T from "three";
import { gable } from "../../architecture";
export const rmPantheonFactory: Factory = (k, g) => {
  const brick = "#b39a7e",
    stone = "#d8c8a7",
    roof = "#b7b2a0";
  // Broad, low exterior dome behind the deep eight-column porch; +z is front.
  const wall = k.geometry(
    "pantheon-thick-drum",
    () =>
      new T.LatheGeometry(
        [
          new T.Vector2(0.43, 0.03),
          new T.Vector2(0.5, 0.03),
          new T.Vector2(0.5, 0.61),
          new T.Vector2(0.43, 0.61),
          new T.Vector2(0.43, 0.03),
        ],
        32,
      ),
  );
  k.mesh(g, wall, brick, 0, 0, -0.17);
  k.cylinder(g, 0.43, 0.018, "#736c5a", 0, 0.02, -0.17, 0.43, 32);
  // Annular masonry belts leave the rotunda and oculus genuinely open.
  for (const y of [0.23, 0.5]) {
    const geo = k.geometry(
      "pantheon-belt",
      () =>
        new T.LatheGeometry(
          [
            new T.Vector2(0.493, 0),
            new T.Vector2(0.514, 0),
            new T.Vector2(0.514, 0.024),
            new T.Vector2(0.493, 0.024),
            new T.Vector2(0.493, 0),
          ],
          32,
        ),
    );
    k.mesh(g, geo, stone, 0, y, -0.17);
  }
  const outer = [
    [0.51, 0.59],
    [0.51, 0.62],
    [0.49, 0.62],
    [0.49, 0.65],
    [0.46, 0.65],
    [0.44, 0.69],
    [0.39, 0.74],
    [0.32, 0.78],
    [0.24, 0.81],
    [0.16, 0.83],
    [0.085, 0.84],
  ];
  const cap = k.geometry("pantheon-low-dome", () => {
    const profile = [
      ...outer,
      ...[...outer].reverse().map(([r, y]) => [r, y - 0.024]),
      outer[0],
    ];
    return new T.LatheGeometry(
      profile.map(([r, y]) => new T.Vector2(r, y)),
      40,
    );
  });
  k.mesh(g, cap, roof, 0, 0, -0.17);
  k.box(g, 0.77, 0.62, 0.16, brick, 0, 0.31, 0.25);
  k.box(g, 0.19, 0.34, 0.02, "#665f4e", 0, 0.21, 0.34);
  k.box(g, 0.9, 0.055, 0.48, stone, 0, 0.045, 0.44);
  // Eight front columns and four pairs behind them frame the central entrance.
  for (let row = 0; row < 3; row++) {
    const xs =
      row === 0
        ? [-0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25, 0.35]
        : [-0.35, -0.15, 0.15, 0.35];
    for (const x of xs) {
      const z = 0.63 - row * 0.135;
      k.cylinder(g, 0.023, 0.44, stone, x, 0.292, z, 0.02, 10);
      k.box(g, 0.062, 0.034, 0.062, stone, x, 0.53, z);
    }
  }
  k.box(g, 0.91, 0.055, 0.47, stone, 0, 0.565, 0.44);
  gable(k, g, 0.95, 0.49, 0.18, roof, 0, 0.595, 0.44);
  gable(k, g, 0.91, 0.025, 0.16, stone, 0, 0.595, 0.695);
};
