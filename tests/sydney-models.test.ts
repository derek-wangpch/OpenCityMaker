import { expect, it } from "vitest";
import { Box3, Group, Mesh, Raycaster, Vector3 } from "three";
import { ModelKit } from "../src/scene/kit";
import { sydneyModels } from "../src/scene/models/sydney";
import { sydney } from "../src/cities/sydney";

it("keeps reviewed Sydney models within their plots with finite normals and batched materials", () => {
  for (const [id, factory] of Object.entries(sydneyModels)) {
    if (["sy-opera", "sy-harbourbridge"].includes(id)) continue;
    const kit = new ModelKit(),
      group = new Group();
    factory(kit, group, sydney);
    group.updateMatrixWorld(true);
    const b = new Box3().setFromObject(group);
    expect(b.min.y, id).toBeGreaterThanOrEqual(-0.001);
    for (const axis of ["x", "z"] as const) {
      expect(b.min[axis], id).toBeGreaterThanOrEqual(-0.8);
      expect(b.max[axis], id).toBeLessThanOrEqual(0.8);
    }
    expect(b.max.y, id).toBeLessThan(2.65);
    group.traverse((part) => {
      if (!(part instanceof Mesh)) return;
      for (const attr of ["position", "normal"])
        expect(
          part.geometry.getAttribute(attr).array.every(Number.isFinite),
          id,
        ).toBe(true);
    });
    expect(kit.batch(group, id).children.length, id).toBeLessThanOrEqual(10);
    kit.dispose();
  }
});

it("leaves Town Hall's portico open and keeps four clock faces above the main roofs", () => {
  const kit = new ModelKit(),
    g = new Group();
  sydneyModels["sy-townhall"](kit, g, sydney);
  g.updateMatrixWorld(true);
  const walk = new Raycaster(
    new Vector3(0, 0.25, 0.7),
    new Vector3(0, 0, -1),
    0,
    0.18,
  );
  expect(walk.intersectObject(g, true)).toHaveLength(0);
  const clocks: Mesh[] = [];
  g.traverse((p) => {
    if (p instanceof Mesh && p.name === "clock-face") clocks.push(p);
  });
  expect(clocks).toHaveLength(4);
  for (const clock of clocks)
    expect(new Box3().setFromObject(clock).min.y).toBeGreaterThan(1.05);
  kit.dispose();
});
