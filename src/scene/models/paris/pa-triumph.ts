import * as T from "three";
import type { Factory, ModelKit } from "../../kit";
import { arch } from "../../architecture";

const stone = "#d8c7a5";
const stoneLight = "#ead9b7";
const stoneShadow = "#b8a583";
const reliefStone = "#c9b28b";

function facadeGeometry(
  k: ModelKit,
  key: string,
  width: number,
  height: number,
  openingWidth: number,
  openingHeight: number,
  depth: number,
) {
  return k.geometry(key, () => {
    const radius = openingWidth / 2;
    const spring = openingHeight - radius;
    const shape = new T.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(-radius, 0);
    shape.lineTo(-radius, spring);
    shape.absarc(0, spring, radius, Math.PI, 0, true);
    shape.lineTo(radius, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, height);
    shape.lineTo(-width / 2, height);
    shape.closePath();
    const geometry = new T.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
      curveSegments: 10,
    });
    geometry.translate(0, 0, -depth / 2);
    return geometry;
  });
}

function raisedArch(
  k: ModelKit,
  g: T.Group,
  openingWidth: number,
  openingHeight: number,
  y: number,
  z: number,
) {
  // architecture.arch uses a band 14% of its outer width. Work backwards so
  // its inner edge follows the actual opening rather than narrowing it.
  const outerWidth = openingWidth / 0.72;
  const band = outerWidth * 0.14;
  arch(k, g, outerWidth, openingHeight + band, 0.026, stoneLight, 0, y, z);
}

function addSculptureGroup(
  k: ModelKit,
  g: T.Group,
  x: number,
  z: number,
  facing: number,
) {
  const face = z + facing * 0.025;
  k.box(g, 0.25, 0.31, 0.018, stoneShadow, x, 0.38, z);
  k.box(g, 0.2, 0.025, 0.028, stoneLight, x, 0.225, face);
  k.beam(
    g,
    [x - 0.065, 0.25, face],
    [x + 0.045, 0.49, face],
    0.027,
    reliefStone,
  );
  for (const [dx, y, radius] of [
    [-0.06, 0.32, 0.045],
    [0.055, 0.3, 0.04],
    [0, 0.4, 0.052],
    [0.07, 0.47, 0.035],
  ] as const)
    k.sphere(g, radius, reliefStone, x + dx, y, face);
}

export const paTriumphFactory: Factory = (k, g) => {
  // x = broad ceremonial facades, z = narrow side facades, y = height.
  // The real monument is about 45 × 22 × 50 m; width and depth stay separate.
  const width = 1.28;
  const depth = 0.66;
  const bodyBottom = 0.1;
  const bodyTop = 1.16;
  const mainOpeningWidth = 0.46;
  const mainOpeningHeight = 0.91;
  const sideOpeningWidth = 0.25;
  const sideOpeningHeight = 0.58;
  const mainOpeningTop = bodyBottom + mainOpeningHeight;
  const sideOpeningTop = bodyBottom + sideOpeningHeight;
  const mainPierWidth = (width - mainOpeningWidth) / 2;
  const sidePierDepth = (depth - sideOpeningWidth) / 2;

  // A stepped stone footing grounds the four piers.
  k.box(g, 1.39, 0.055, 0.77, stoneShadow, 0, 0.028);
  k.box(g, 1.34, 0.05, 0.72, stoneLight, 0, 0.078);

  // Four true corner piers leave both the main axis and transverse axis open.
  for (const x of [
    -(mainOpeningWidth + mainPierWidth) / 2,
    (mainOpeningWidth + mainPierWidth) / 2,
  ])
    for (const z of [
      -(sideOpeningWidth + sidePierDepth) / 2,
      (sideOpeningWidth + sidePierDepth) / 2,
    ])
      k.box(
        g,
        mainPierWidth,
        sideOpeningHeight,
        sidePierDepth,
        stone,
        x,
        bodyBottom + sideOpeningHeight / 2,
        z,
      );

  // The smaller cross arches pass independently through the two main piers.
  for (const x of [
    -(mainOpeningWidth + mainPierWidth) / 2,
    (mainOpeningWidth + mainPierWidth) / 2,
  ])
    k.box(
      g,
      mainPierWidth,
      mainOpeningTop - sideOpeningTop,
      depth,
      stone,
      x,
      (sideOpeningTop + mainOpeningTop) / 2,
    );
  k.box(
    g,
    width,
    bodyTop - mainOpeningTop,
    depth,
    stone,
    0,
    (mainOpeningTop + bodyTop) / 2,
  );

  // Thin exterior skins describe the curved openings without blocking the
  // perpendicular passages in the low-poly core.
  const frontFacade = facadeGeometry(
    k,
    "pa-triumph:front-facade",
    width,
    bodyTop - bodyBottom,
    mainOpeningWidth,
    mainOpeningHeight,
    0.045,
  );
  for (const facing of [-1, 1]) {
    const z = facing * (depth / 2 + 0.012);
    k.mesh(g, frontFacade, stone, 0, bodyBottom, z);
    raisedArch(
      k,
      g,
      mainOpeningWidth,
      mainOpeningHeight,
      bodyBottom,
      z + facing * 0.03,
    );
  }

  const sideFacade = facadeGeometry(
    k,
    "pa-triumph:side-facade",
    depth,
    bodyTop - bodyBottom,
    sideOpeningWidth,
    sideOpeningHeight,
    0.045,
  );
  for (const facing of [-1, 1]) {
    const side = k.mesh(
      g,
      sideFacade,
      stone,
      facing * (width / 2 + 0.012),
      bodyBottom,
    );
    side.rotation.y = Math.PI / 2;
    const trim = new T.Group();
    trim.position.x = facing * (width / 2 + 0.042);
    trim.rotation.y = Math.PI / 2;
    g.add(trim);
    raisedArch(k, trim, sideOpeningWidth, sideOpeningHeight, bodyBottom, 0);
  }

  // The four large sculptural groups and upper battle reliefs are simplified
  // into chunky, readable relief silhouettes for board-scale rendering.
  for (const facing of [-1, 1]) {
    const z = facing * (depth / 2 + 0.045);
    for (const x of [-0.44, 0.44]) {
      addSculptureGroup(k, g, x, z, facing);
      k.box(g, 0.25, 0.13, 0.02, stoneShadow, x, 0.9, z);
      k.box(g, 0.19, 0.075, 0.026, reliefStone, x, 0.9, z + facing * 0.014);
    }
  }
  for (const facing of [-1, 1]) {
    const x = facing * (width / 2 + 0.045);
    k.box(g, 0.02, 0.14, 0.36, stoneShadow, x, 0.88, 0);
    k.box(g, 0.026, 0.085, 0.29, reliefStone, x + facing * 0.014, 0.88, 0);
  }

  // Frieze, projecting cornices and the medal-lined attic establish the
  // characteristic heavy, horizontal crown.
  k.box(g, 1.31, 0.08, 0.69, stoneShadow, 0, 1.2);
  k.box(g, 1.39, 0.045, 0.75, stoneLight, 0, 1.26);
  k.box(g, 1.3, 0.18, 0.66, stone, 0, 1.37);
  for (const facing of [-1, 1]) {
    const z = facing * 0.343;
    for (let i = -4; i <= 4; i++)
      k.box(g, 0.075, 0.035, 0.025, reliefStone, i * 0.135, 1.205, z);
    for (let i = -3; i <= 3; i++) {
      const medallion = k.cylinder(
        g,
        0.032,
        0.024,
        stoneLight,
        i * 0.17,
        1.38,
        facing * 0.344,
        0,
        10,
      );
      medallion.rotation.x = Math.PI / 2;
    }
  }
  for (const facing of [-1, 1]) {
    const x = facing * 0.663;
    for (const z of [-0.2, 0, 0.2]) {
      const medallion = k.cylinder(
        g,
        0.031,
        0.024,
        stoneLight,
        x,
        1.38,
        z,
        0,
        10,
      );
      medallion.rotation.z = Math.PI / 2;
    }
  }
  k.box(g, 1.37, 0.05, 0.72, stoneLight, 0, 1.485);
  k.box(g, 1.29, 0.045, 0.64, stoneShadow, 0, 1.53);
  k.box(g, 1.18, 0.035, 0.54, stoneLight, 0, 1.57);
};
