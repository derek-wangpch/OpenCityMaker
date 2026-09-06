import type { Factory } from "../../kit";
import { peranakan } from "./shared";
export const sgTerraceFactory: Factory = (k, g) => {
  for (let i = 0; i < 3; i++)
    peranakan(
      k,
      g,
      (i - 1) * 0.45,
      0,
      0.72,
      ["#bd91a1", "#7eafa2", "#d8b377"][i],
    );
};
