import type { Factory } from "../../kit";
import * as T from "three";
import { gable } from "../../architecture";
export const ldMewsFactory: Factory = (k, g) => {
  k.box(g, 1.35, 0.025, 1.3, "#bdb7a7", 0, 0.0125);
  // Doors face a continuous lane with both ends open.
  for (const side of [-1, 1])
    for (let i = 0; i < 2; i++) {
      const row = new T.Group();
      row.position.set(side * 0.43, 0, (i - 0.5) * 0.58);
      row.rotation.y = (-side * Math.PI) / 2;
      g.add(row);
      k.box(row, 0.56, 0.48, 0.38, ["#b8bca4", "#cfb5a0"][i], 0, 0.265);
      gable(k, row, 0.58, 0.42, 0.12, "#737d7e", 0, 0.505);
      k.box(row, 0.32, 0.22, 0.014, "#63786c", 0, 0.16, 0.197);
      k.box(row, 0.013, 0.22, 0.018, "#94a18d", 0, 0.16, 0.21);
      for (const x of [-0.14, 0.14])
        k.box(row, 0.11, 0.1, 0.014, "#65808a", x, 0.4, 0.197);
    }
};
