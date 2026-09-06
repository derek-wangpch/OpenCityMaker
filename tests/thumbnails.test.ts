import { it, expect } from "vitest";
import { cities } from "../src/cities/packs";
import { thumbnailKey } from "../src/scene/render";
it("keeps previews of the same model in different cities apart", () => {
  expect(thumbnailKey("beijing", "x")).not.toBe(thumbnailKey("hongkong", "x"));
});
it("gives every building in every city its own preview key", () => {
  const keys = cities.flatMap((city) =>
    city.buildings.map((b) => thumbnailKey(city.id, b.model)),
  );
  expect(new Set(keys).size).toBe(cities.length * 11);
});
