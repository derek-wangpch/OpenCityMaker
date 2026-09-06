import type { CityPack } from "./types";
export function validatePacks(packs: CityPack[], models: string[]): void {
  const ids = new Set<string>();
  const keys = new Set<string>();
  const prefixes = new Set<string>();
  for (const city of packs) {
    if (ids.has(city.id)) throw new Error("Duplicate city ID: " + city.id);
    ids.add(city.id);
    if (!city.nativeName.trim())
      throw new Error("Missing native name: " + city.id);
    if (city.buildings.length !== 11)
      throw new Error("City needs eleven tiers: " + city.id);
    // Thumbnails, template caches and gallery React keys are all keyed by model,
    // so a key reused across cities silently renders the wrong city's palette.
    const prefix = city.buildings[0].model.split("-")[0];
    if (prefixes.has(prefix))
      throw new Error("Duplicate model prefix: " + prefix);
    prefixes.add(prefix);
    for (const [index, building] of city.buildings.entries()) {
      if (keys.has(building.model))
        throw new Error("Duplicate model key: " + building.model);
      keys.add(building.model);
      if (building.model.split("-")[0] !== prefix)
        throw new Error("Model key outside city prefix: " + building.model);
      if (
        building.value !== 2 ** (index + 1) ||
        !models.includes(building.model)
      )
        throw new Error("Invalid tier/model: " + building.model);
      for (const locale of ["en", "zh-CN", "zh-HK"] as const) {
        if (
          ![
            city.name,
            city.country,
            city.subtitle,
            building.name,
            building.description,
          ].every((text) => text[locale]?.trim())
        )
          throw new Error("Missing translation");
      }
      if (
        !building.sources.length ||
        building.sources.some((url) => !url.startsWith("https://"))
      )
        throw new Error("Missing reference");
    }
  }
}
