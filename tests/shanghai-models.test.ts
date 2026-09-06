import { expect, it } from "vitest";
import { Box3, Group, Mesh, Raycaster, Vector3 } from "three";
import { ModelKit, modelFactories, createBuilding } from "../src/scene/models";
import { shanghai } from "../src/cities/shanghai";

it("reviewed Shanghai models fit the plot and contain finite geometry", () => {
  for (const b of shanghai.buildings.filter((b) => b.value <= 2 ** 9)) {
    const kit = new ModelKit();
    const g = createBuilding(kit, shanghai, b.value);
    const box = new Box3().setFromObject(g);
    expect(box.min.x, b.model).toBeGreaterThanOrEqual(-0.83);
    expect(box.max.x, b.model).toBeLessThanOrEqual(0.83);
    expect(box.min.z, b.model).toBeGreaterThanOrEqual(-0.83);
    expect(box.max.z, b.model).toBeLessThanOrEqual(0.83);
    expect(box.min.y, b.model).toBeGreaterThanOrEqual(-0.08);
    expect(box.max.y, b.model).toBeLessThanOrEqual(2.65);
    g.traverse((o) => {
      if (o instanceof Mesh)
        expect(
          Array.from(o.geometry.getAttribute("position").array).every(
            Number.isFinite,
          ),
        ).toBe(true);
    });
    kit.dispose();
  }
});
it("longtang retains an unobstructed passage under the gateway and between houses", () => {
  const kit = new ModelKit(),
    g = new Group();
  modelFactories["sh-longtang"](kit, g, shanghai);
  g.updateMatrixWorld(true);
  expect(
    new Raycaster(
      new Vector3(0, 0.16, 1),
      new Vector3(0, 0, -1),
    ).intersectObject(g, true),
  ).toHaveLength(0);
  for (const side of [-1, 1]) {
    const hits = new Raycaster(
      new Vector3(0, 0.1, 0.34),
      new Vector3(side, 0, 0),
    ).intersectObject(g, true);
    expect(hits.length).toBeGreaterThan(0);
    expect((hits[0].object as Mesh).material).toBe(kit.material("#463c36"));
  }
  kit.dispose();
});
