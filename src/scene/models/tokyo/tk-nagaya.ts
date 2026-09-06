import type { Factory } from "../../kit";
import { gable } from "../../architecture";
export const tkNagayaFactory: Factory = (k, g) => {
  k.box(g, 1.3, 0.4, 0.56, "#c7b394", 0, 0.2, -0.1);
  const roof = gable(k, g, 0.68, 1.4, 0.2, "#575d62", 0, 0.4, -0.1);
  roof.rotation.y = Math.PI / 2;
  k.box(g, 1.36, 0.035, 0.15, "#575d62", 0, 0.31, 0.22);
  for (const x of [-0.43, 0, 0.43]) {
    k.box(g, 0.12, 0.27, 0.025, "#715c49", x + 0.08, 0.135, 0.19);
    k.box(g, 0.16, 0.14, 0.025, "#8a947f", x - 0.1, 0.23, 0.19);
  }
  k.box(g, 1.5, 0.02, 0.34, "#aaa393", 0, 0.01, 0.43);
};
