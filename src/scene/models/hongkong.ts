import type { Factory } from "../kit";
import { hkHouseFactory } from "./hongkong/hk-house";
import { hkClusterFactory } from "./hongkong/hk-cluster";
import { hkWalledFactory } from "./hongkong/hk-walled";
import { hkTempleFactory } from "./hongkong/hk-temple";
import { hkBlueFactory } from "./hongkong/hk-blue";
import { hkClockFactory } from "./hongkong/hk-clock";
import { hkTonglauFactory } from "./hongkong/hk-tonglau";
import { hkHsbcFactory } from "./hongkong/hk-hsbc";
import { hkBocFactory } from "./hongkong/hk-boc";
import { hkIfcFactory } from "./hongkong/hk-ifc";
import { hkIccFactory } from "./hongkong/hk-icc";

export const hongkongModels: Record<string, Factory> = {
  "hk-house": hkHouseFactory,
  "hk-cluster": hkClusterFactory,
  "hk-walled": hkWalledFactory,
  "hk-temple": hkTempleFactory,
  "hk-blue": hkBlueFactory,
  "hk-clock": hkClockFactory,
  "hk-tonglau": hkTonglauFactory,
  "hk-hsbc": hkHsbcFactory,
  "hk-boc": hkBocFactory,
  "hk-ifc": hkIfcFactory,
  "hk-icc": hkIccFactory,
};
