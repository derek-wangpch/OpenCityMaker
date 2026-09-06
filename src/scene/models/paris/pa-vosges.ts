import type { Factory } from "../../kit";
import * as T from "three";
import { mansard } from "./shared";
import { arch } from "../../architecture";
export const paVosgesFactory: Factory = (k, g) => {
  for (const x of [-0.44, 0, 0.44]) {
    k.box(g, 0.41, 0.57, 0.58, "#b07d66", x, 0.4);
    for (const xx of [-0.13, 0.13])
      arch(k, g, 0.18, 0.3, 0.08, "#e5d6b6", x + xx, 0, 0.34);
    const a = new T.Group();
    a.position.x = x;
    g.add(a);
    mansard(k, a, "pa-vosges-roof", 0.47, 0.67, 0.7);
    for (const dx of [-0.17, 0.17])
      k.box(g, 0.025, 0.58, 0.03, "#eedcbc", x + dx, 0.43, 0.31);
  }
};
