import type { Factory } from "../kit";
import { syCottageFactory } from "./sydney/sy-cottage";
import { syTerraceFactory } from "./sydney/sy-terrace";
import { syWarehouseFactory } from "./sydney/sy-warehouse";
import { syWharfFactory } from "./sydney/sy-wharf";
import { syQvbFactory } from "./sydney/sy-qvb";
import { syTownhallFactory } from "./sydney/sy-townhall";
import { syStmarysFactory } from "./sydney/sy-stmarys";
import { syUniversityFactory } from "./sydney/sy-university";
import { syCentralparkFactory } from "./sydney/sy-centralpark";
import { syHarbourbridgeFactory } from "./sydney/sy-harbourbridge";
import { syOperaFactory } from "./sydney/sy-opera";
export const sydneyModels: Record<string, Factory> = {
  "sy-cottage": syCottageFactory,
  "sy-terrace": syTerraceFactory,
  "sy-warehouse": syWarehouseFactory,
  "sy-wharf": syWharfFactory,
  "sy-qvb": syQvbFactory,
  "sy-townhall": syTownhallFactory,
  "sy-stmarys": syStmarysFactory,
  "sy-university": syUniversityFactory,
  "sy-centralpark": syCentralparkFactory,
  "sy-harbourbridge": syHarbourbridgeFactory,
  "sy-opera": syOperaFactory,
};
