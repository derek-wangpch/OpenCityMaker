import type { Factory } from "../kit";
import { tkMachiyaFactory } from "./tokyo/tk-machiya";
import { tkNagayaFactory } from "./tokyo/tk-nagaya";
import { tkShotengaiFactory } from "./tokyo/tk-shotengai";
import { tkSentoFactory } from "./tokyo/tk-sento";
import { tkKaminarimonFactory } from "./tokyo/tk-kaminarimon";
import { tkSensojiFactory } from "./tokyo/tk-sensoji";
import { tkStationFactory } from "./tokyo/tk-station";
import { tkDietFactory } from "./tokyo/tk-diet";
import { tkTochoFactory } from "./tokyo/tk-tocho";
import { tkTowerFactory } from "./tokyo/tk-tower";
import { tkSkytreeFactory } from "./tokyo/tk-skytree";
export const tokyoModels: Record<string, Factory> = {
  "tk-machiya": tkMachiyaFactory,
  "tk-nagaya": tkNagayaFactory,
  "tk-shotengai": tkShotengaiFactory,
  "tk-sento": tkSentoFactory,
  "tk-kaminarimon": tkKaminarimonFactory,
  "tk-sensoji": tkSensojiFactory,
  "tk-station": tkStationFactory,
  "tk-diet": tkDietFactory,
  "tk-tocho": tkTochoFactory,
  "tk-tower": tkTowerFactory,
  "tk-skytree": tkSkytreeFactory,
};
