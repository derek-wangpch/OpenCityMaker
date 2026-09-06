import type { Factory } from "../kit";
import { dbWindtowerFactory } from "./dubai/db-windtower";
import { dbCourtyardFactory } from "./dubai/db-courtyard";
import { dbSoukFactory } from "./dubai/db-souk";
import { dbFahidiFactory } from "./dubai/db-fahidi";
import { dbMosqueFactory } from "./dubai/db-mosque";
import { dbSaeedFactory } from "./dubai/db-saeed";
import { dbFutureFactory } from "./dubai/db-future";
import { dbFrameFactory } from "./dubai/db-frame";
import { dbEmiratesFactory } from "./dubai/db-emirates";
import { dbBurjAlArabFactory } from "./dubai/db-burj-al-arab";
import { dbKhalifaFactory } from "./dubai/db-khalifa";
export const dubaiModels: Record<string, Factory> = {
  "db-windtower": dbWindtowerFactory,
  "db-courtyard": dbCourtyardFactory,
  "db-souk": dbSoukFactory,
  "db-fahidi": dbFahidiFactory,
  "db-mosque": dbMosqueFactory,
  "db-saeed": dbSaeedFactory,
  "db-future": dbFutureFactory,
  "db-frame": dbFrameFactory,
  "db-emirates": dbEmiratesFactory,
  "db-burj-al-arab": dbBurjAlArabFactory,
  "db-khalifa": dbKhalifaFactory,
};
