import * as T from "three";
import type { ModelKit } from "../../kit";
import { gable } from "../../architecture";
export function brickhome(k: ModelKit, g: T.Group, x = 0, s = 1) {
  const a = new T.Group();
  a.position.x = x;
  a.scale.setScalar(s);
  g.add(a);
  k.box(a, 0.5, 0.74, 0.66, "#a8775d");
  gable(k, a, 0.7, 0.5, 0.15, "#6d777b", 0, 0.75).rotation.y = Math.PI / 2;
  for (const z of [-0.34, 0.34])
    for (const y of [0.29, 0.61])
      for (const xx of [-0.125, 0.125]) {
        if (z > 0 && y === 0.29 && xx < 0) continue; // Entrance bay.
        k.box(a, 0.1, 0.16, 0.018, "#516d78", xx, y, z);
      }
  k.box(a, 0.5, 0.045, 0.055, "#d5c4a6", 0, 0.76, 0.33);
  k.box(a, 0.1, 0.25, 0.018, "#64776e", -0.12, 0.125, 0.346);
  k.box(a, 0.085, 0.21, 0.1, "#966f57", -0.2, 0.91, -0.12);
}
export function clock(
  k: ModelKit,
  g: T.Group,
  x: number,
  y: number,
  z: number,
  r: number,
  angle = 0,
) {
  const a = new T.Group();
  a.position.set(x, y, z);
  a.rotation.y = angle;
  g.add(a);
  const face = k.cylinder(a, r, 0.027, "#e8dec2", 0, 0, 0, r, 20);
  face.rotation.x = Math.PI / 2;
  ringFace(k, a, r);
  k.box(a, 0.012, r * 0.65, 0.015, "#315879", 0, r * 0.22, 0.025);
  const hand = k.box(a, r * 0.62, 0.014, 0.015, "#315879", r * 0.22, 0, 0.025);
  hand.rotation.z = -0.25;
}
function ringFace(k: ModelKit, g: T.Group, r: number) {
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    k.box(
      g,
      0.014,
      0.017,
      0.017,
      "#7d795f",
      Math.sin(a) * r * 0.82,
      Math.cos(a) * r * 0.82,
      0.025,
    );
  }
}
