import * as T from "three";
import type { ModelKit } from "../../kit";
/** Solid whose base polygon sits on y=0 and whose top vertices may differ in height. */
export function prism(
  k: ModelKit,
  g: T.Group,
  base: [number, number][],
  tops: number[],
  color: string,
) {
  const key = `prism:${base.flat().join(",")}:${tops.join(",")}`;
  const geometry = k.geometry(key, () => {
    const twice =
      (base[1][0] - base[0][0]) * (base[2][1] - base[0][1]) -
      (base[2][0] - base[0][0]) * (base[1][1] - base[0][1]);
    const order = twice > 0 ? [0, 2, 1] : [0, 1, 2];
    const low = order.map((i) => [base[i][0], 0, base[i][1]]);
    const high = order.map((i) => [base[i][0], tops[i], base[i][1]]);
    const positions: number[] = [];
    for (let i = 0; i < 3; i++) {
      const j = (i + 1) % 3;
      positions.push(
        ...low[i],
        ...low[j],
        ...high[i],
        ...low[j],
        ...high[j],
        ...high[i],
      );
    }
    positions.push(...high[0], ...high[1], ...high[2]);
    const result = new T.BufferGeometry();
    result.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    result.computeVertexNormals();
    return result;
  });
  return k.mesh(g, geometry, color);
}
