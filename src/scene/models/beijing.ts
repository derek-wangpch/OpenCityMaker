import type { Factory } from "../kit";
import { bjHouseFactory } from "./beijing/bj-house";
import { bjCourtyardFactory } from "./beijing/bj-courtyard";
import { bjHutongFactory } from "./beijing/bj-hutong";
import { bjGateFactory } from "./beijing/bj-gate";
import { bjDrumFactory } from "./beijing/bj-drum";
import { bjPalaceFactory } from "./beijing/bj-palace";
import { bjHeavenFactory } from "./beijing/bj-heaven";
import { bjNcpaFactory } from "./beijing/bj-ncpa";
import { bjCctvFactory } from "./beijing/bj-cctv";
import { bjCwtFactory } from "./beijing/bj-cwt";
import { bjZunFactory } from "./beijing/bj-zun";

export const beijingModels: Record<string, Factory> = {
  "bj-house": bjHouseFactory,
  "bj-courtyard": bjCourtyardFactory,
  "bj-hutong": bjHutongFactory,
  "bj-gate": bjGateFactory,
  "bj-drum": bjDrumFactory,
  "bj-palace": bjPalaceFactory,
  "bj-heaven": bjHeavenFactory,
  "bj-ncpa": bjNcpaFactory,
  "bj-cctv": bjCctvFactory,
  "bj-cwt": bjCwtFactory,
  "bj-zun": bjZunFactory,
};
