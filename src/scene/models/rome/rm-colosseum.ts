import type { Factory, ModelKit } from "../../kit";
import * as T from "three";

const stone = "#d4bc94";
const trim = "#ebd5af";
const brick = "#b69a77";

/** Closed masonry bay with an open, round-headed passage and solid spandrels. */
function arcade(k: ModelKit, g: T.Group, width: number, height: number) {
  const r = width * 0.32;
  const spring = height - r - 0.025;
  const geo = k.geometry(`colosseum-bay:${width}:${height}`, () => {
    const s = new T.Shape();
    s.moveTo(-width / 2, 0);
    s.lineTo(-width / 2, height);
    s.lineTo(width / 2, height);
    s.lineTo(width / 2, 0);
    s.lineTo(r, 0);
    s.lineTo(r, spring);
    s.absarc(0, spring, r, 0, Math.PI, false);
    s.lineTo(-r, 0);
    s.closePath();
    const geometry = new T.ExtrudeGeometry(s, {
      depth: 0.065,
      bevelEnabled: false,
      curveSegments: 5,
    });
    geometry.translate(0, 0, -0.0325);
    return geometry;
  });
  k.mesh(g, geo, stone);
}

export const rmColosseumFactory: Factory = (k, g) => {
  // x = long axis, z = short axis. The high surviving outer wall is at -z.
  // Build circular bays first, then apply ONE ellipse to walls and cornices.
  const oval = new T.Group();
  oval.scale.z = 0.76;
  g.add(oval);
  const count = 32;
  const step = (Math.PI * 2) / count;
  const floor = 0.035;
  const storey = 0.195;
  k.cylinder(oval, 0.73, floor, "#c6b18d", 0, floor / 2, 0, 0.73, 48);

  const band = (
    r: number,
    y: number,
    thickness: number,
    start = 0,
    arc = Math.PI * 2,
  ) => {
    const geo = k.geometry(
      `colosseum-ring:${r}:${thickness}:${start}:${arc}`,
      () => {
        const s = new T.Shape();
        s.absarc(0, 0, r + 0.045, start, start + arc, false);
        s.absarc(0, 0, r - 0.045, start + arc, start, true);
        s.closePath();
        const a = new T.ExtrudeGeometry(s, {
          depth: thickness,
          bevelEnabled: false,
          curveSegments: 32,
        });
        a.rotateX(Math.PI / 2);
        return a;
      },
    );
    k.mesh(oval, geo, trim, 0, y + thickness, 0);
  };

  // Lower exposed inner circuit; the lost outer half leaves a visible setback.
  for (const [r, first, last, levels] of [
    [0.575, 0, 32, 2],
    [0.68, 16, 32, 3],
  ]) {
    const width = 2 * r * Math.tan(step / 2) + 0.003;
    for (let j = 0; j < levels; j++) {
      for (let i = first; i < last; i++) {
        const a = (i + 0.5) * step;
        const bay = new T.Group();
        bay.position.set(r * Math.cos(a), floor + j * storey, r * Math.sin(a));
        bay.rotation.y = Math.PI / 2 - a;
        oval.add(bay);
        arcade(k, bay, width, storey - 0.02);
        // Attached order on the outer circuit only, simplified at board scale.
        if (r > 0.6) {
          k.cylinder(
            bay,
            0.011,
            0.145,
            trim,
            -width / 2 + 0.009,
            0.078,
            0.037,
            0.011,
            8,
          );
          k.box(
            bay,
            0.033,
            0.018,
            0.028,
            trim,
            -width / 2 + 0.009,
            0.156,
            0.04,
          );
        }
      }
      // Rotation maps positive shape-y to positive world-z.
      band(
        r,
        floor + (j + 1) * storey - 0.022,
        0.022,
        r > 0.6 ? Math.PI : 0,
        r > 0.6 ? Math.PI : Math.PI * 2,
      );
    }
  }

  // The fourth storey is an attic with small rectangular windows, not arches.
  for (let i = 16; i < 32; i++) {
    const a = (i + 0.5) * step;
    const bay = new T.Group();
    bay.position.set(
      0.68 * Math.cos(a),
      floor + 3 * storey,
      0.68 * Math.sin(a),
    );
    bay.rotation.y = Math.PI / 2 - a;
    oval.add(bay);
    const h = i === 16 || i === 31 ? 0.105 : 0.16;
    k.box(bay, 0.138, h, 0.065, stone, 0, h / 2, 0);
    k.box(bay, 0.018, h, 0.018, trim, -0.06, h / 2, 0.042);
    if (i % 2 === 0)
      k.box(bay, 0.033, 0.052, 0.008, "#706353", 0, 0.075, 0.036);
    k.box(bay, 0.145, 0.025, 0.084, trim, 0, h, 0);
  }

  // Simplified masonry buttresses at the two ends of the surviving wall.
  for (const side of [-1, 1]) {
    for (let j = 0; j < 3; j++) {
      const h = 0.57 - j * 0.095;
      k.box(
        oval,
        0.075,
        h,
        0.044,
        brick,
        side * 0.676,
        floor + h / 2,
        0.015 + j * 0.037,
      );
    }
  }

  // A few broad cavea terraces and radial walls retain the excavated character.
  for (let j = 0; j < 3; j++) band(0.39 + j * 0.053, 0.1 + j * 0.07, 0.035);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    const wall = k.box(
      oval,
      0.024,
      0.15,
      0.16,
      brick,
      0.47 * Math.cos(a),
      0.14,
      0.47 * Math.sin(a),
    );
    wall.rotation.y = Math.PI / 2 - a;
  }
  const pit = k.cylinder(oval, 0.34, 0.012, "#8c795f", 0, 0.046, 0, 0.34, 32);
  pit.scale.z = 0.8;
  // Hypogeum: long central passage, parallel galleries and cross partitions.
  for (const z of [-0.18, -0.09, 0.09, 0.18]) {
    const length = Math.abs(z) > 0.1 ? 0.46 : 0.61;
    k.box(oval, length, 0.06, 0.019, brick, 0, 0.081, z);
    for (const x of [-0.18, -0.06, 0.06, 0.18])
      k.box(
        oval,
        0.018,
        0.055,
        0.065,
        stone,
        x,
        0.078,
        z - Math.sign(z) * 0.036,
      );
  }
};
