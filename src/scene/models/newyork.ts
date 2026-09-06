import type { Factory } from "../kit";
import { nyBrownstoneFactory } from "./newyork/ny-brownstone";
import { nyRowFactory } from "./newyork/ny-row";
import { nyTenementFactory } from "./newyork/ny-tenement";
import { nyWatertankFactory } from "./newyork/ny-watertank";
import { nyFlatironFactory } from "./newyork/ny-flatiron";
import { nyGrandcentralFactory } from "./newyork/ny-grandcentral";
import { nyBrooklynFactory } from "./newyork/ny-brooklyn";
import { nyChryslerFactory } from "./newyork/ny-chrysler";
import { nyLibertyFactory } from "./newyork/ny-liberty";
import { nyEmpireFactory } from "./newyork/ny-empire";
import { nyOnewtcFactory } from "./newyork/ny-onewtc";
export const newyorkModels: Record<string, Factory> = {
  "ny-brownstone": nyBrownstoneFactory,
  "ny-row": nyRowFactory,
  "ny-tenement": nyTenementFactory,
  "ny-watertank": nyWatertankFactory,
  "ny-flatiron": nyFlatironFactory,
  "ny-grandcentral": nyGrandcentralFactory,
  "ny-brooklyn": nyBrooklynFactory,
  "ny-chrysler": nyChryslerFactory,
  "ny-liberty": nyLibertyFactory,
  "ny-empire": nyEmpireFactory,
  "ny-onewtc": nyOnewtcFactory,
};
