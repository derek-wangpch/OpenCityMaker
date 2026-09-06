import { expect, it } from "vitest";
import * as T from "three";
import { ModelKit } from "../src/scene/kit";
import { syCentralparkFactory } from "../src/scene/models/sydney/sy-centralpark";

it("keeps unequal towers, separated reflector systems and planted side within the plot", () => {
  const kit = new ModelKit(),
    group = new T.Group();
  syCentralparkFactory(kit, group, {} as never);
  group.updateMatrixWorld(true);
  const named = (name: string) => group.children.filter((o) => o.name === name);
  const towers = named("tower").map((o) => new T.Box3().setFromObject(o));
  expect(towers).toHaveLength(2);
  expect(towers[1].max.y - towers[0].max.y).toBeGreaterThan(0.6);
  const array = new T.Box3();
  named("reflector").forEach((o) => array.union(new T.Box3().setFromObject(o)));
  expect(array.min.y - towers[0].max.y).toBeGreaterThan(0.25);
  expect(towers[1].max.y - array.max.y).toBeGreaterThan(0.3);
  expect(array.max.x).toBeLessThan(towers[1].min.x);
  for (const o of named("roof-heliostat")) {
    const b = new T.Box3().setFromObject(o);
    expect(b.min.y).toBeGreaterThan(towers[0].max.y);
    expect(b.max.x).toBeLessThan(towers[0].max.x);
  }
  expect(named("side-green").length).toBeGreaterThan(5);
  const bounds = new T.Box3().setFromObject(group);
  expect(bounds.min.y).toBeGreaterThanOrEqual(0);
  expect(bounds.max.y).toBeLessThan(1.74);
  expect(bounds.getSize(new T.Vector3()).x).toBeLessThan(1.6);
  expect(bounds.getSize(new T.Vector3()).z).toBeLessThan(1.6);
  kit.dispose();
});
