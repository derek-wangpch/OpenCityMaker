import { describe, expect, it } from "vitest";
import * as T from "three";
import { cities } from "../src/cities/packs";
import { buildingForValue } from "../src/cities/types";
import { showTileLabel, tileAccent } from "../src/game/tiers";
import { createBuilding, ModelKit } from "../src/scene/models";

describe("extended landmark presentation", () => {
  it("resolves every city's top model while preserving the true tile value", () => {
    for (const city of cities) {
      const top = city.buildings.find((b) => b.value === 2048)!;
      expect(buildingForValue(city, 8192)).toEqual({ ...top, value: 8192 });
      expect(buildingForValue(city, 2048)).toBe(top);
      expect(buildingForValue(city, 3000)).toBeUndefined();
    }
  });
  it("distinguishes extended tiers even when normal number labels are hidden", () => {
    expect([4096, 8192, 16384, 32768].map(tileAccent)).toEqual([
      "#e7b74f",
      "#ad82e8",
      "#36b9c7",
      "#36b9c7",
    ]);
    expect(tileAccent(2048)).toBeUndefined();
    expect(showTileLabel(2048, false)).toBe(false);
    expect(showTileLabel(2048, true)).toBe(true);
    for (const value of [4096, 8192, 16384, 32768])
      expect(showTileLabel(value, false)).toBe(true);
  });
  it("keeps ring colors independent without contaminating cached landmark models", () => {
    const kit = new ModelKit();
    const city = cities[0];
    const extended = [4096, 8192, 16384].map((value) =>
      createBuilding(kit, city, value),
    );
    const normal = createBuilding(kit, city, 2048);
    expect(normal.getObjectByName("tier-ring")).toBeUndefined();
    extended.forEach((group, i) => {
      const ring = group.getObjectByName("tier-ring") as T.Mesh<
        T.RingGeometry,
        T.MeshStandardMaterial
      >;
      expect(ring.material.color.getHexString()).toBe(
        tileAccent([4096, 8192, 16384][i])!.slice(1),
      );
      expect(ring.parent).toBe(group);
      expect(
        group.children.filter((child) => child.name !== "tier-ring").length,
      ).toBe(normal.children.length);
      expect(new T.Box3().setFromObject(group).max.y).toBe(
        new T.Box3().setFromObject(normal).max.y,
      );
    });
    expect(
      createBuilding(kit, city, 4096).children.filter(
        (child) => child.name === "tier-ring",
      ),
    ).toHaveLength(1);
    kit.dispose();
  });
});
