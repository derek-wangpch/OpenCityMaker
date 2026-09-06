import type { Factory } from "../kit";
import { szHakkaFactory } from "./shenzhen/sz-hakka";
import { szWeiwuFactory } from "./shenzhen/sz-weiwu";
import { szDapengFactory } from "./shenzhen/sz-dapeng";
import { szHandshakeFactory } from "./shenzhen/sz-handshake";
import { szFactoryFactory } from "./shenzhen/sz-factory";
import { szItcFactory } from "./shenzhen/sz-itc";
import { szCivicFactory } from "./shenzhen/sz-civic";
import { szDiwangFactory } from "./shenzhen/sz-diwang";
import { szKk100Factory } from "./shenzhen/sz-kk100";
import { szPinganFactory } from "./shenzhen/sz-pingan";
import { szBambooFactory } from "./shenzhen/sz-bamboo";

export const shenzhenModels: Record<string, Factory> = {
  "sz-hakka": szHakkaFactory,
  "sz-weiwu": szWeiwuFactory,
  "sz-dapeng": szDapengFactory,
  "sz-handshake": szHandshakeFactory,
  "sz-factory": szFactoryFactory,
  "sz-itc": szItcFactory,
  "sz-civic": szCivicFactory,
  "sz-diwang": szDiwangFactory,
  "sz-kk100": szKk100Factory,
  "sz-pingan": szPinganFactory,
  "sz-bamboo": szBambooFactory,
};
