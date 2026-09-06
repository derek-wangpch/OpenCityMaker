import type { Factory } from "../kit";
import { shShikumenFactory } from "./shanghai/sh-shikumen";
import { shLilongFactory } from "./shanghai/sh-lilong";
import { shLongtangFactory } from "./shanghai/sh-longtang";
import { shYuyuanFactory } from "./shanghai/sh-yuyuan";
import { shYangfangFactory } from "./shanghai/sh-yangfang";
import { shBundFactory } from "./shanghai/sh-bund";
import { shPeaceFactory } from "./shanghai/sh-peace";
import { shPearlFactory } from "./shanghai/sh-pearl";
import { shJinmaoFactory } from "./shanghai/sh-jinmao";
import { shSwfcFactory } from "./shanghai/sh-swfc";
import { shTowerFactory } from "./shanghai/sh-tower";

export const shanghaiModels: Record<string, Factory> = {
  "sh-shikumen": shShikumenFactory,
  "sh-lilong": shLilongFactory,
  "sh-longtang": shLongtangFactory,
  "sh-yuyuan": shYuyuanFactory,
  "sh-yangfang": shYangfangFactory,
  "sh-bund": shBundFactory,
  "sh-peace": shPeaceFactory,
  "sh-pearl": shPearlFactory,
  "sh-jinmao": shJinmaoFactory,
  "sh-swfc": shSwfcFactory,
  "sh-tower": shTowerFactory,
};
