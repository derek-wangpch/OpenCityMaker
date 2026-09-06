import { beijing } from "./beijing";
import { hongkong } from "./hongkong";
import { shanghai } from "./shanghai";
import { shenzhen } from "./shenzhen";
import { tokyo } from "./tokyo";
import { singapore } from "./singapore";
import { dubai } from "./dubai";
import { sydney } from "./sydney";
import { newyork } from "./newyork";
import { paris } from "./paris";
import { london } from "./london";
import { rome } from "./rome";
import type { CityPack } from "./types";
/**
 * Order is public API. The chapter number, the two-digit switcher badge, and
 * `readSave`'s default city all derive from array position, so new cities are
 * appended and never inserted. A shipped city ID is never renamed or removed
 * without a save migration.
 */
export const cities: CityPack[] = [
  beijing,
  hongkong,
  shanghai,
  shenzhen,
  tokyo,
  singapore,
  dubai,
  sydney,
  newyork,
  paris,
  london,
  rome,
];
export { validatePacks } from "./validate";
