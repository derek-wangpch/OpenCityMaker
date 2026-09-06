import type { Factory } from "../../kit";
import { gable } from "../../architecture";
export const syTerraceFactory: Factory = (k, g) => {
  const iron = "#586963";
  for (const [i, x] of [-0.4, 0, 0.4].entries()) {
    k.box(g, 0.4, 0.69, 0.59, ["#c7ae89", "#d4c4a6", "#bdac91"][i], x, 0.345);
    const r = gable(k, g, 0.64, 0.4, 0.19, "#76807b", x, 0.69);
    r.rotation.y = Math.PI / 2;
    k.box(g, 0.11, 0.26, 0.018, iron, x - 0.08, 0.13, 0.303);
    k.box(g, 0.11, 0.16, 0.018, iron, x + 0.09, 0.18, 0.303);
    k.box(g, 0.19, 0.2, 0.018, iron, x, 0.53, 0.303);
    k.box(g, 0.4, 0.03, 0.19, "#ded0af", x, 0.37, 0.385);
    k.box(g, 0.4, 0.035, 0.19, "#76807b", x, 0.7, 0.385);
    for (const dx of [-0.17, 0, 0.17])
      k.box(g, 0.023, 0.15, 0.025, iron, x + dx, 0.46, 0.47);
    k.box(g, 0.4, 0.025, 0.025, iron, x, 0.54, 0.47);
    for (const dx of [-0.185, 0.185])
      k.box(g, 0.025, 0.69, 0.025, iron, x + dx, 0.345, 0.46);
    k.box(g, 0.08, 0.2, 0.1, "#c7ae89", x - 0.15, 0.85, -0.12);
    k.box(g, 0.16, 0.16, 0.018, iron, x, 0.51, -0.303);
  }
};
