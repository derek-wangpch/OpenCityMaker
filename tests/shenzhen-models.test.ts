import { expect, it } from "vitest";
import { Box3, Group, Mesh, Raycaster, Vector3 } from "three";
import { ModelKit, modelFactories, createBuilding } from "../src/scene/models";
import { shenzhen } from "../src/cities/shenzhen";
function model(id: string) {
  const kit = new ModelKit(),
    g = new Group();
  modelFactories[id](kit, g, shenzhen);
  g.updateMatrixWorld(true);
  return { kit, g };
}
it("all Shenzhen tiers stay within the plot with finite geometry", () => {
  for (const b of shenzhen.buildings) {
    const kit = new ModelKit();
    const g = createBuilding(kit, shenzhen, b.value);
    const box = new Box3().setFromObject(g);
    expect(box.min.x).toBeGreaterThanOrEqual(-0.83);
    expect(box.max.x).toBeLessThanOrEqual(0.83);
    expect(box.min.z).toBeGreaterThanOrEqual(-0.83);
    expect(box.max.z).toBeLessThanOrEqual(0.83);
    // The shared tile plinth extends 0.075 below model ground.
    expect(box.min.y, b.model).toBeGreaterThanOrEqual(-0.08);
    expect(box.max.y).toBeLessThanOrEqual(2.65);
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
it("Dapeng gate has a through passage and windows above the rampart", () => {
  const { kit, g } = model("sz-dapeng");
  expect(
    new Raycaster(
      new Vector3(0, 0.12, 1),
      new Vector3(0, 0, -1),
    ).intersectObject(g, true),
  ).toHaveLength(0);
  expect(
    new Raycaster(
      new Vector3(0.5, 0.12, 1),
      new Vector3(0, 0, -1),
    ).intersectObject(g, true).length,
  ).toBeGreaterThan(0);
  kit.dispose();
});
it("walled village door is recessed behind its front wall rather than covered by it", () => {
  const { kit, g } = model("sz-weiwu");
  const hits = new Raycaster(
    new Vector3(0, 0.1, 1),
    new Vector3(0, 0, -1),
  ).intersectObject(g, true);
  expect(hits[0].point.z).toBeLessThan(0.74);
  kit.dispose();
});
it("Ping An is a continuous chamfered solid without an added needle", () => {
  const { kit, g } = model("sz-pingan");
  expect(new Box3().setFromObject(g).max.y).toBeLessThan(2.51);
  for (const y of [0.4, 1, 1.8, 2.3])
    for (const [x, z] of [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ]) {
      expect(
        new Raycaster(
          new Vector3(x, y, z),
          new Vector3(-x, 0, -z),
        ).intersectObject(g, true).length,
      ).toBeGreaterThan(0);
    }
  kit.dispose();
});
it("KK100 keeps a level cap and contracts mainly in side elevation", () => {
  const { kit } = model("sz-kk100");
  const geo = kit.geometries.get("sz-kk100:continuous-shell")!;
  const p = geo.getAttribute("position");
  const bounds = (lo: number, hi: number) => {
    const box = new Box3();
    for (let i = 0; i < p.count; i++)
      if (p.getY(i) >= lo && p.getY(i) <= hi)
        box.expandByPoint(new Vector3(p.getX(i), p.getY(i), p.getZ(i)));
    return box.getSize(new Vector3());
  };
  const top = bounds(2.339, 2.341),
    mid = bounds(1.18, 1.24);
  expect(top.y).toBe(0);
  expect(top.x / mid.x).toBeGreaterThan(0.85);
  expect(top.z / mid.z).toBeLessThan(0.2);
  kit.dispose();
});
