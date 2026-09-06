import { it, expect } from "vitest";
import { Box3, Mesh, Vector3 } from "three";
import { cities, validatePacks } from "../src/cities/packs";
import { ModelKit, modelFactories, createBuilding } from "../src/scene/models";
it("validates every tier, model registration, reference and translation", () => {
  expect(() =>
    validatePacks(cities, Object.keys(modelFactories)),
  ).not.toThrow();
  expect(() =>
    validatePacks([...cities, cities[0]], Object.keys(modelFactories)),
  ).toThrow();
});
it("keeps model keys globally unique, prefixed by city, and free of orphans", () => {
  const keys = cities.flatMap((c) => c.buildings.map((b) => b.model));
  expect(new Set(keys).size).toBe(cities.length * 11);
  expect(new Set(Object.keys(modelFactories))).toEqual(new Set(keys));
  for (const city of cities) {
    const prefixes = new Set(city.buildings.map((b) => b.model.split("-")[0]));
    expect(prefixes.size).toBe(1);
  }
  const shared = structuredClone(cities[1]);
  shared.id = "other";
  shared.buildings[0].model = cities[0].buildings[0].model;
  expect(() =>
    validatePacks([cities[0], shared], Object.keys(modelFactories)),
  ).toThrow();
});
it("gives every city a four-color palette with its own ground tone", () => {
  const grounds = new Set<string>();
  for (const city of cities) {
    for (const color of Object.values(city.palette))
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(city.nativeName.trim()).toBeTruthy();
    grounds.add(city.palette.ground);
  }
  expect(grounds.size).toBe(cities.length);
});
it("every original model has finite geometry within the standardized bounds", () => {
  const kit = new ModelKit();
  let count = 0;
  for (const city of cities)
    for (const b of city.buildings) {
      const model = createBuilding(kit, city, b.value);
      const box = new Box3().setFromObject(model);
      expect(box.min.x, b.model).toBeGreaterThanOrEqual(-0.83);
      expect(box.max.x, b.model).toBeLessThanOrEqual(0.83);
      expect(box.min.z, b.model).toBeGreaterThanOrEqual(-0.83);
      expect(box.max.z, b.model).toBeLessThanOrEqual(0.83);
      // One WTC's approved antenna tip may extend beyond the usual roof limit.
      const heightLimit = b.model === "ny-onewtc" ? 2.7 : 2.66;
      expect(box.max.y, b.model).toBeLessThanOrEqual(heightLimit);
      expect(box.max.y, b.model).toBeGreaterThan(0.4);
      expect(Number.isFinite(box.max.y)).toBe(true);
      model.traverse((part) => {
        if (!(part instanceof Mesh)) return;
        for (const attribute of ["position", "normal"])
          expect(
            part.geometry.getAttribute(attribute).array.every(Number.isFinite),
            b.model + ":" + attribute,
          ).toBe(true);
        if (b.model === "ny-onewtc") {
          const positions = part.geometry.getAttribute("position");
          const vertex = new Vector3();
          for (let i = 0; i < positions.count; i++) {
            vertex
              .fromBufferAttribute(positions, i)
              .applyMatrix4(part.matrixWorld);
            // Only the narrow central needle gets the additional clearance.
            if (vertex.y > 2.66)
              expect(
                Math.hypot(vertex.x, vertex.z),
                b.model + ":antenna",
              ).toBeLessThanOrEqual(0.05);
          }
        }
      });
      count++;
    }
  expect(count).toBe(cities.length * 11);
  kit.dispose();
});

it("batches and shares building geometry without sharing mutable transforms", () => {
  const kit = new ModelKit();
  const first = createBuilding(kit, cities[0], 2048);
  const second = createBuilding(kit, cities[0], 2048);
  expect(first.children.length).toBeLessThan(15);
  expect(first.children[0]).not.toBe(second.children[0]);
  first.position.x = 10;
  expect(second.position.x).toBe(0);
  expect(kit.templates.size).toBe(1);
  kit.dispose();
});

it("appends the eight approved cities without renumbering the original four", () => {
  expect(cities.map((city) => city.id)).toEqual([
    "beijing",
    "hongkong",
    "shanghai",
    "shenzhen",
    "tokyo",
    "singapore",
    "dubai",
    "sydney",
    "newyork",
    "paris",
    "london",
    "rome",
  ]);
  expect(cities.flatMap((city) => city.buildings)).toHaveLength(132);
});
