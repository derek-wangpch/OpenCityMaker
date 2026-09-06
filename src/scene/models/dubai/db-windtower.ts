import type { Factory } from "../../kit";
import { windhouse } from "./shared";
export const dbWindtowerFactory: Factory = (k, g) => {
  windhouse(k, g);
};
