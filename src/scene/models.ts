import { buildingForValue } from "../cities/types";
import * as T from "three";
import { tileAccent } from "../game/tiers";
import type { CityPack } from "../cities/types";
import { ModelKit, type Factory } from "./kit";
import { beijingModels } from "./models/beijing";
import { hongkongModels } from "./models/hongkong";
import { shanghaiModels } from "./models/shanghai";
import { shenzhenModels } from "./models/shenzhen";
import { tokyoModels } from "./models/tokyo";
import { singaporeModels } from "./models/singapore";
import { dubaiModels } from "./models/dubai";
import { sydneyModels } from "./models/sydney";
import { newyorkModels } from "./models/newyork";
import { parisModels } from "./models/paris";
import { londonModels } from "./models/london";
import { romeModels } from "./models/rome";
export { ModelKit } from "./kit";
export type { Factory } from "./kit";
/** Model keys are globally unique and prefixed per city; `validatePacks` enforces both. */
export const modelFactories: Record<string, Factory> = {
  ...beijingModels,
  ...hongkongModels,
  ...shanghaiModels,
  ...shenzhenModels,
  ...tokyoModels,
  ...singaporeModels,
  ...dubaiModels,
  ...sydneyModels,
  ...newyorkModels,
  ...parisModels,
  ...londonModels,
  ...romeModels,
};
export function createBuilding(
  kit: ModelKit,
  city: CityPack,
  value: number,
  landscaped = true,
): T.Group {
  const building = buildingForValue(city, value);
  if (!building || !modelFactories[building.model])
    throw new Error("Unknown building: " + value);
  const cacheKey = `building:${city.id}:${building.model}:${landscaped}`;
  const cached = kit.templates.get(cacheKey);
  if (cached) return decorateTier(kit, cached.clone(), value, landscaped);
  const group = new T.Group();
  if (landscaped) {
    kit.box(group, 1.64, 0.075, 1.64, city.palette.ground, 0, -0.0375);
    kit.box(group, 0.26, 0.012, 0.7, "#d9d3b9", 0, 0.006, 0.48);
    if (value > 4) {
      kit.tree(group, -0.69, 0.57, 0.65);
      kit.tree(group, 0.66, -0.57, 0.6);
    }
  }
  modelFactories[building.model](kit, group, city);
  return decorateTier(kit, kit.batch(group, cacheKey), value, landscaped);
}

/** Decorations are added after template lookup, so they never leak across tier clones. */
function decorateTier(
  kit: ModelKit,
  group: T.Group,
  value: number,
  landscaped: boolean,
) {
  const color = tileAccent(value);
  if (color && landscaped) {
    const ring = new T.Mesh(
      kit.geometry("tier-ring", () => new T.RingGeometry(0.8, 0.855, 64)),
      kit.material(color),
    );
    ring.name = "tier-ring";
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.014;
    group.add(ring);
  }
  return group;
}
