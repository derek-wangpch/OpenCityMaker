import type { Factory } from "../kit";
import { rmTrastevereFactory } from "./rome/rm-trastevere";
import { rmDomusFactory } from "./rome/rm-domus";
import { rmInsulaFactory } from "./rome/rm-insula";
import { rmAqueductFactory } from "./rome/rm-aqueduct";
import { rmForumFactory } from "./rome/rm-forum";
import { rmPantheonFactory } from "./rome/rm-pantheon";
import { rmCastelFactory } from "./rome/rm-castel";
import { rmTreviFactory } from "./rome/rm-trevi";
import { rmVittorianoFactory } from "./rome/rm-vittoriano";
import { rmColosseumFactory } from "./rome/rm-colosseum";
import { rmStpetersFactory } from "./rome/rm-stpeters";
export const romeModels: Record<string, Factory> = {
  "rm-trastevere": rmTrastevereFactory,
  "rm-domus": rmDomusFactory,
  "rm-insula": rmInsulaFactory,
  "rm-aqueduct": rmAqueductFactory,
  "rm-forum": rmForumFactory,
  "rm-pantheon": rmPantheonFactory,
  "rm-castel": rmCastelFactory,
  "rm-trevi": rmTreviFactory,
  "rm-vittoriano": rmVittorianoFactory,
  "rm-colosseum": rmColosseumFactory,
  "rm-stpeters": rmStpetersFactory,
};
