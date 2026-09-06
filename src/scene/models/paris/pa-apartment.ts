import type { Factory } from "../../kit";
import { haussmann } from "./shared";
export const paApartmentFactory: Factory = (k, g) => {
  haussmann(k, g);
};
