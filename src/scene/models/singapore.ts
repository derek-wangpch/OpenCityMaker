import type { Factory } from "../kit";
import { sgShophouseFactory } from "./singapore/sg-shophouse";
import { sgTerraceFactory } from "./singapore/sg-terrace";
import { sgBungalowFactory } from "./singapore/sg-bungalow";
import { sgHdbFactory } from "./singapore/sg-hdb";
import { sgRafflesFactory } from "./singapore/sg-raffles";
import { sgGalleryFactory } from "./singapore/sg-gallery";
import { sgEsplanadeFactory } from "./singapore/sg-esplanade";
import { sgMerlionFactory } from "./singapore/sg-merlion";
import { sgArtscienceFactory } from "./singapore/sg-artscience";
import { sgSupertreesFactory } from "./singapore/sg-supertrees";
import { sgSandsFactory } from "./singapore/sg-sands";
export const singaporeModels: Record<string, Factory> = {
  "sg-shophouse": sgShophouseFactory,
  "sg-terrace": sgTerraceFactory,
  "sg-bungalow": sgBungalowFactory,
  "sg-hdb": sgHdbFactory,
  "sg-raffles": sgRafflesFactory,
  "sg-gallery": sgGalleryFactory,
  "sg-esplanade": sgEsplanadeFactory,
  "sg-merlion": sgMerlionFactory,
  "sg-artscience": sgArtscienceFactory,
  "sg-supertrees": sgSupertreesFactory,
  "sg-sands": sgSandsFactory,
};
