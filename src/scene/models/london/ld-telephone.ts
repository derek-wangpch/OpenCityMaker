import type { Factory } from "../../kit";
import * as T from "three";
import { loft } from "../../architecture";
export const ldTelephoneFactory: Factory = (k, g) => {
  k.box(g, 0.94, 0.035, 0.81, "#b9b7a5", 0, 0.018);
  k.box(g, 0.34, 0.71, 0.34, "#b74739", 0, 0.39);
  // K6: glazed door and two sides, solid back; grouped low-tier panes.
  for (const angle of [0, Math.PI / 2, -Math.PI / 2]) {
    const face = new T.Group();
    face.rotation.y = angle;
    g.add(face);
    k.box(face, 0.265, 0.46, 0.014, "#a4b7b4", 0, 0.37, 0.177);
    for (const x of [-0.084, 0.084])
      k.box(face, 0.012, 0.46, 0.018, "#b74739", x, 0.37, 0.188);
    for (const y of [0.23, 0.37, 0.51])
      k.box(face, 0.27, 0.012, 0.018, "#b74739", 0, y, 0.188);
    k.box(face, 0.255, 0.048, 0.014, "#e3d9b8", 0, 0.677, 0.177);
  }
  const square = (r: number): [number, number][] => [
    [-r, -r],
    [r, -r],
    [r, r],
    [-r, r],
  ];
  loft(
    k,
    g,
    "ld-k6-cap",
    [
      { y: 0.735, points: square(0.185) },
      { y: 0.79, points: square(0.155) },
      { y: 0.82, points: square(0.065) },
    ],
    "#b74739",
  );
  k.cylinder(g, 0.017, 0.86, "#4d625c", 0.36, 0.465, -0.2);
  k.box(g, 0.085, 0.11, 0.085, "#d7cba5", 0.36, 0.925, -0.2);
};
