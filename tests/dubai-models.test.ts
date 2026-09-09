import { expect, it } from "vitest";
import { Box3, Group, Mesh, Raycaster, Vector3 } from "three";
import { ModelKit, modelFactories, createBuilding } from "../src/scene/models";
import { dubai } from "../src/cities/dubai";
function model(id: string) {
  const kit = new ModelKit(),
    group = new Group();
  modelFactories[id](kit, group, dubai);
  group.updateMatrixWorld(true);
  return { kit, group };
}
function cast(group: Group, origin: number[], direction: number[]) {
  return new Raycaster(
    new Vector3(...origin),
    new Vector3(...direction),
  ).intersectObject(group, true);
}
it("Khalifa's three staggered wings all reach the podium", () => {
  const { kit, group } = model("db-khalifa");
  for (let i = 0; i < 3; i++) {
    const a = Math.PI / 2 + (i * Math.PI * 2) / 3;
    const hit = cast(
      group,
      [Math.cos(a) * 0.4, 0.1, Math.sin(a) * 0.4],
      [-Math.cos(a), 0, -Math.sin(a)],
    )[0];
    expect(hit).toBeDefined();
    expect(hit.distance).toBeLessThan(0.16);
  }
  kit.dispose();
});
it("Dubai Frame keeps its sky opening clear with connected top and bottom galleries", () => {
  const { kit, group } = model("db-frame");
  expect(cast(group, [0, 1, 2], [0, 0, -1])).toHaveLength(0);
  for (const y of [0.12, 1.95])
    expect(cast(group, [0, y, 2], [0, 0, -1]).length).toBeGreaterThan(0);
  kit.dispose();
});
it("Museum of the Future has a through void and outward faces on both sides", () => {
  const { kit, group } = model("db-future");
  for (const side of [-1, 1]) {
    expect(cast(group, [0.07, 0.83, side * 2], [0, 0, -side])).toHaveLength(0);
    const hit = cast(group, [-0.5, 0.77, side * 2], [0, 0, -side])[0];
    expect(hit).toBeDefined();
    expect(side * hit.point.z).toBeGreaterThan(0.2);
  }
  kit.dispose();
});
it("the tier-2 entrance actually connects the street and open courtyard", () => {
  const { kit, group } = model("db-courtyard");
  const ray = new Raycaster(
    new Vector3(0, 0.18, 0.7),
    new Vector3(0, 0, -1),
    0,
    0.9,
  );
  expect(ray.intersectObject(group, true)).toHaveLength(0);
  kit.dispose();
});
it("low tiers keep a small geometry budget instead of tiny repeated ornaments", () => {
  const lowTiers = dubai.buildings.filter((b) => b.value <= 8);
  expect(lowTiers).toHaveLength(3);
  for (const building of lowTiers) {
    const { kit, group } = model(building.model);
    let triangles = 0;
    group.traverse((o) => {
      if (o instanceof Mesh)
        triangles +=
          (o.geometry.index?.count ??
            o.geometry.getAttribute("position").count) / 3;
    });
    expect(triangles, building.model).toBeLessThan(1200);
    kit.dispose();
  }
});

it("all eleven Dubai models keep finite geometry inside the plot and height limits", () => {
  for (const building of dubai.buildings) {
    const { kit, group } = model(building.model);
    const bounds = new Box3().setFromObject(group);
    expect(bounds.min.x, building.model).toBeGreaterThanOrEqual(-0.83);
    expect(bounds.max.x, building.model).toBeLessThanOrEqual(0.83);
    expect(bounds.min.z, building.model).toBeGreaterThanOrEqual(-0.83);
    expect(bounds.max.z, building.model).toBeLessThanOrEqual(0.83);
    expect(bounds.min.y, building.model).toBeGreaterThanOrEqual(-0.01);
    expect(bounds.max.y, building.model).toBeLessThanOrEqual(2.66);
    group.traverse((o) => {
      if (o instanceof Mesh)
        for (const name of ["position", "normal"])
          expect(
            o.geometry.getAttribute(name).array.every(Number.isFinite),
            building.model,
          ).toBe(true);
    });
    kit.dispose();
  }
});

it("Sheikh Saeed House keeps the entrance and central sky court open", () => {
  const { kit, group } = model("db-saeed");
  const entrance = new Raycaster(
    new Vector3(0, 0.18, 0.9),
    new Vector3(0, 0, -1),
    0,
    0.9,
  );
  expect(entrance.intersectObject(group, true)).toHaveLength(0);
  const courtyard = cast(group, [0, 2, 0], [0, -1, 0])[0];
  expect(courtyard).toBeDefined();
  expect(courtyard.point.y).toBeLessThan(0.04);
  kit.dispose();
});

it("Al Fahidi alley has one exposed surface above the shared entrance path", () => {
  const kit = new ModelKit();
  const group = createBuilding(kit, dubai, 16);
  group.updateMatrixWorld(true);
  // Both the front alley / generic path overlap and the cross-alley junction.
  for (const [x, z] of [
    [-0.06, 0.37],
    [-0.07, 0.02],
  ]) {
    const hits = cast(group, [x, 0.1, z], [0, -1, 0]);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].point.y).toBeGreaterThan(0.02);
    expect(
      hits.filter((hit) => Math.abs(hit.distance - hits[0].distance) < 1e-5),
    ).toHaveLength(1);
  }
  kit.dispose();
});
