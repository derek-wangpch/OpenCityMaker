import type { Factory } from "../../kit";
import * as T from "three";

type ProfilePoint = [z: number, y: number];

export const sgSandsFactory: Factory = (k, g) => {
  const towerY = 0.08;
  const towerHeight = 1.38;
  const towerWidth = 0.31;
  const glass = "#86aeb7";
  const frame = "#e3dcc5";
  const shadow = "#587a82";

  const smoothstep = (value: number) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * (3 - 2 * t);
  };

  // In the narrow elevation each hotel tower is a pair of asymmetric slabs.
  // The bay-facing slab stays vertical; the garden-facing slab curves outward
  // at the base and meets it around the lower third of the tower.
  const curvedCenter = (t: number) => 0.095 + 0.26 * (1 - smoothstep(t / 0.42));
  const curvedHalfDepth = 0.06;
  const straightProfile: ProfilePoint[] = [
    [-0.13, towerY],
    [0.05, towerY],
    [0.05, towerY + towerHeight],
    [-0.13, towerY + towerHeight],
  ];
  const curvedProfile: ProfilePoint[] = [
    ...Array.from({ length: 17 }, (_, i): ProfilePoint => {
      const t = i / 16;
      return [curvedCenter(t) + curvedHalfDepth, towerY + towerHeight * t];
    }),
    ...Array.from({ length: 17 }, (_, i): ProfilePoint => {
      const t = 1 - i / 16;
      return [curvedCenter(t) - curvedHalfDepth, towerY + towerHeight * t];
    }),
  ];

  const profileGeometry = (
    key: string,
    points: ProfilePoint[],
    width: number,
  ) =>
    k.geometry(key, () => {
      const shape = new T.Shape();
      shape.moveTo(points[0][0], points[0][1]);
      for (const [z, y] of points.slice(1)) shape.lineTo(z, y);
      shape.closePath();
      const geometry = new T.ExtrudeGeometry(shape, {
        depth: width,
        bevelEnabled: false,
        curveSegments: 1,
      });
      // The profile is authored in z/y and extruded along x.
      geometry.rotateY(-Math.PI / 2);
      geometry.translate(width / 2, 0, 0);
      return geometry;
    });

  const straightGlass = profileGeometry(
    "sg-sands:straight-glass",
    straightProfile,
    towerWidth,
  );
  const curvedGlass = profileGeometry(
    "sg-sands:curved-glass",
    curvedProfile,
    towerWidth,
  );
  const straightCap = profileGeometry(
    "sg-sands:straight-cap",
    straightProfile,
    0.025,
  );
  const curvedCap = profileGeometry(
    "sg-sands:curved-cap",
    curvedProfile,
    0.025,
  );

  for (const x of [-0.43, 0, 0.43]) {
    k.mesh(g, straightGlass, glass, x);
    k.mesh(g, curvedGlass, glass, x);

    // Pale stone end walls keep the paired-slab profile legible in the
    // default view without reproducing the full facade grid.
    for (const side of [-1, 1]) {
      const capX = x + side * (towerWidth / 2 - 0.0125);
      k.mesh(g, straightCap, frame, capX);
      k.mesh(g, curvedCap, frame, capX);
    }

    // Grouped floor bands follow the curved face instead of floating on a
    // single vertical plane. The opposite facade uses the same rhythm.
    for (let floor = 1; floor < 18; floor++) {
      const t = floor / 18;
      const y = towerY + towerHeight * t;
      k.box(
        g,
        towerWidth - 0.035,
        0.011,
        0.017,
        "#c8d6ce",
        x,
        y,
        curvedCenter(t) + curvedHalfDepth + 0.006,
      );
      k.box(g, towerWidth - 0.035, 0.009, 0.015, "#b8cec9", x, y, -0.136);
    }
    for (const offset of [-0.075, 0, 0.075]) {
      k.beam(
        g,
        [x + offset, towerY + 0.02, -0.141],
        [x + offset, towerY + towerHeight - 0.02, -0.141],
        0.006,
        shadow,
      );
    }
  }

  // The low glazed lobby links the towers while leaving their flared legs
  // visible from the narrow elevation.
  k.box(g, 1.06, 0.075, 0.44, "#70969b", 0, 0.055, 0.04);
  k.box(g, 1.12, 0.025, 0.48, frame, 0, 0.105, 0.04);

  const skyParkGeometry = k.geometry("sg-sands:skypark-hull", () => {
    const shape = new T.Shape();
    shape.moveTo(-0.76, -0.08);
    shape.quadraticCurveTo(-0.82, 0.015, -0.74, 0.12);
    shape.quadraticCurveTo(-0.22, 0.19, 0.5, 0.16);
    shape.quadraticCurveTo(0.79, 0.13, 0.82, 0.02);
    shape.quadraticCurveTo(0.83, -0.1, 0.69, -0.15);
    shape.quadraticCurveTo(-0.05, -0.2, -0.71, -0.14);
    shape.quadraticCurveTo(-0.78, -0.13, -0.76, -0.08);
    const geometry = new T.ExtrudeGeometry(shape, {
      depth: 0.1,
      bevelEnabled: false,
      curveSegments: 10,
    });
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  });
  // Shift the park toward its observation end: one substantial cantilever.
  const hull = k.mesh(g, skyParkGeometry, frame, 0.075, 1.49);
  hull.scale.x = 0.91;
  for (const x of [-0.43, 0, 0.43]) {
    k.box(g, 0.24, 0.03, 0.2, shadow, x, 1.475, 0.01);
    for (const z of [-0.075, 0.085])
      k.beam(g, [x - 0.09, 1.46, z], [x, 1.51, z], 0.018, frame);
  }

  // The long cyan strip and garden make the deck read as an inhabited park,
  // while its off-centre placement reinforces the asymmetric cantilever.
  k.box(g, 0.86, 0.012, 0.065, "#70b9ba", -0.13, 1.602, 0.09);
  k.box(g, 0.73, 0.014, 0.075, "#7d9c68", -0.2, 1.604, -0.045);
  k.box(g, 0.23, 0.035, 0.13, "#d8d8c6", 0.46, 1.614, -0.01);

  for (const x of [-0.49, -0.28, -0.06, 0.17]) {
    k.cylinder(g, 0.006, 0.035, "#756d55", x, 1.634, -0.045, 0.006, 6);
    k.sphere(g, 0.025, "#648258", x, 1.67, -0.045);
  }

  // Sparse V-struts are visible beneath the projecting observation end.
  for (const x of [0.62, 0.75]) {
    k.beam(g, [x - 0.06, 1.46, 0.01], [x, 1.54, 0.01], 0.012, frame);
    k.beam(g, [x + 0.06, 1.46, 0.01], [x, 1.54, 0.01], 0.012, frame);
  }
};
