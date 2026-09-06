import type { Factory } from "../../kit";
import { shikumenUnit } from "./shared";

export const shShikumenFactory: Factory = (k, g) => {
  shikumenUnit(k, g, 0, -0.04, 1.02);
};
