import type { Factory } from "../kit";
import { ldTerraceFactory } from "./london/ld-terrace";
import { ldTelephoneFactory } from "./london/ld-telephone";
import { ldMewsFactory } from "./london/ld-mews";
import { ldCoventFactory } from "./london/ld-covent";
import { ldBatterseaFactory } from "./london/ld-battersea";
import { ldBuckinghamFactory } from "./london/ld-buckingham";
import { ldStpaulsFactory } from "./london/ld-stpauls";
import { ldTowerbridgeFactory } from "./london/ld-towerbridge";
import { ldBigbenFactory } from "./london/ld-bigben";
import { ldEyeFactory } from "./london/ld-eye";
import { ldShardFactory } from "./london/ld-shard";
export const londonModels: Record<string, Factory> = {
  "ld-terrace": ldTerraceFactory,
  "ld-telephone": ldTelephoneFactory,
  "ld-mews": ldMewsFactory,
  "ld-covent": ldCoventFactory,
  "ld-battersea": ldBatterseaFactory,
  "ld-buckingham": ldBuckinghamFactory,
  "ld-stpauls": ldStpaulsFactory,
  "ld-towerbridge": ldTowerbridgeFactory,
  "ld-bigben": ldBigbenFactory,
  "ld-eye": ldEyeFactory,
  "ld-shard": ldShardFactory,
};
