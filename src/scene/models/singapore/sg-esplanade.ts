import * as T from "three";
import type { Factory } from "../../kit";
import { dome } from "../../architecture";
export const sgEsplanadeFactory: Factory = (k, g) => {
  k.box(g, 1.45, 0.1, 1.22, "#cbc6ae");
  k.box(g, 1.3, 0.105, 0.18, "#6f9293", 0, 0.13, 0.52);
  for (const [x, z, rx, rz, h] of [
    [-0.36, -0.045, 0.335, 0.5, 0.43],
    [0.36, 0.015, 0.31, 0.46, 0.39],
  ]) {
    dome(k, g, rx, h, "#789797", x, 0.15, z).scale.z = rz / rx;
    // Champagne triangular folded sunshades sit on the ellipsoid, not vertical spikes.
    const positions: number[] = [];
    const surface = (t: number, a: number) =>
      new T.Vector3(
        x + rx * Math.sin(t) * Math.cos(a),
        0.15 + h * Math.cos(t),
        z + rz * Math.sin(t) * Math.sin(a),
      );
    const tri = (a: T.Vector3, b: T.Vector3, c: T.Vector3) =>
      positions.push(...a.toArray(), ...b.toArray(), ...c.toArray());
    for (let j = 0; j < 5; j++) {
      const t = 0.2 + j * 0.27,
        count = 10 + j * 3;
      for (let i = 0; i < count; i++) {
        const a = ((i + (j % 2) * 0.5) * Math.PI * 2) / count,
          da = (Math.PI / count) * 0.87;
        const left = surface(t + 0.11, a - da),
          right = surface(t + 0.11, a + da),
          tip = surface(Math.max(0.02, t - 0.115), a);
        const mid = surface(t, a);
        const normal = new T.Vector3(
          (Math.sin(t) * Math.cos(a)) / rx,
          Math.cos(t) / h,
          (Math.sin(t) * Math.sin(a)) / rz,
        ).normalize();
        mid.addScaledVector(normal, 0.043);
        tri(left, mid, right);
        tri(right, mid, tip);
        tri(tip, mid, left);
      }
    }
    const geo = k.geometry(`sg-esplanade:shades:${x}`, () => {
      const mesh = new T.BufferGeometry();
      mesh.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
      mesh.computeVertexNormals();
      return mesh;
    });
    k.mesh(g, geo, "#d1c9a9");
  }
  for (const x of [-0.52, -0.26, 0, 0.26, 0.52])
    k.box(g, 0.018, 0.105, 0.024, "#e0d9bc", x, 0.13, 0.615);
};
