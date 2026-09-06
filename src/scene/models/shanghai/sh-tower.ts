import * as T from "three";
import type { Factory } from "../../kit";

export const shTowerFactory: Factory = (k, g) => {
  // Shanghai Tower: a rounded triangle turning 120° as it climbs. A circle
  // has no facing, so the twist must live in the plan itself — the rotating
  // corners are what draw the spiral, crossed by pale sky-lobby rings,
  // closing over a rounded shoulder onto a short mast.
  const glass = "#8aa9bf",
    fin = "#dfe7e0";
  const total = 2.34,
    n = 24,
    turn = -(Math.PI * 2) / 3;
  // One shared section: a rounded triangle of unit circumradius, extruded
  // a unit tall and stood upright, so slabs scale (r, h, r) and spin.
  const section = k.geometry("sh-tower-section", () => {
    const corners = [0, 1, 2].map((i) => {
      const a = Math.PI / 2 + (i * Math.PI * 2) / 3;
      return new T.Vector2(Math.cos(a), Math.sin(a));
    });
    const mids = corners.map((c, i) =>
      corners[(i + 1) % 3].clone().add(c).multiplyScalar(0.5),
    );
    const shape = new T.Shape();
    shape.moveTo(mids[2].x, mids[2].y);
    for (let i = 0; i < 3; i++)
      shape.quadraticCurveTo(corners[i].x, corners[i].y, mids[i].x, mids[i].y);
    const geo = new T.ExtrudeGeometry(shape, {
      depth: 1,
      bevelEnabled: false,
      curveSegments: 5,
    });
    geo.translate(0, 0, -0.5);
    geo.rotateX(-Math.PI / 2);
    return geo;
  });
  const slab = (
    t: number,
    r: number,
    h: number,
    color: string,
    spin: number,
  ) => {
    const m = k.mesh(g, section, color, 0, t * total + h / 2, 0);
    m.scale.set(r, h, r);
    m.rotation.y = spin;
    return m;
  };
  // Slightly convex taper: falls slowly past the base, then closes in.
  const at = (t: number) => 0.46 - 0.16 * t ** 1.4;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    slab(t, at(t), total / n + 0.005, glass, t * turn);
    // Sky-lobby rings: the pale bands that divide the facade into zones.
    if (i > 0 && i % 4 === 0) slab(t, at(t) + 0.008, 0.02, fin, t * turn);
  }
  // Rounded shoulder closing onto the mast, still turning as it lands.
  let y = total;
  for (const [r, h] of [
    [0.27, 0.05],
    [0.2, 0.045],
    [0.13, 0.04],
  ]) {
    slab(y / total, r, h, glass, turn);
    y += h;
  }
  k.cylinder(g, 0.05, 0.02, fin, 0, y + 0.01, 0, 0.025, 12);
  k.cylinder(g, 0.007, 0.1, fin, 0, y + 0.07);
};
