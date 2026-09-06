import { expect, it } from "vitest";
import * as T from "three";
import { ModelKit } from "../src/scene/kit";
import { syHarbourbridgeFactory } from "../src/scene/models/sydney/sy-harbourbridge";

it("keeps the paired arch bearings below deck, connected overhead and clear over water", () => {
  const kit = new ModelKit(),
    group = new T.Group();
  syHarbourbridgeFactory(kit, group, {} as never);
  group.updateMatrixWorld(true);
  const parts = (name: string) => group.children.filter((p) => p.name === name);
  expect(parts("pylon")).toHaveLength(4);
  expect(
    new Set(
      parts("pylon").map(
        (p) => `${Math.sign(p.position.x)},${Math.sign(p.position.z)}`,
      ),
    ).size,
  ).toBe(4);
  expect(parts("cross-tie")).toHaveLength(7);
  for (const p of parts("cross-tie")) {
    const b = new T.Box3().setFromObject(p);
    expect(b.min.z).toBeCloseTo(-0.22, 5);
    expect(b.max.z).toBeCloseTo(0.22, 5);
  }
  const arch = new T.Box3();
  for (const p of parts("lower-chord"))
    arch.union(new T.Box3().setFromObject(p));
  expect(arch.min.y).toBeLessThan(0.2);
  expect(arch.max.y).toBeGreaterThan(0.9);
  for (const p of parts("hanger"))
    expect(new T.Box3().setFromObject(p).min.y).toBeCloseTo(0.43, 5);
  const ray = new T.Raycaster(
    new T.Vector3(0, 0.2, 1),
    new T.Vector3(0, 0, -1),
  );
  expect(ray.intersectObject(group)).toHaveLength(0);
  const b = new T.Box3().setFromObject(group, true),
    size = b.getSize(new T.Vector3());
  expect(size.x).toBeLessThanOrEqual(1.6);
  expect(size.z).toBeLessThanOrEqual(1.6);
  expect(b.min.y).toBeGreaterThanOrEqual(0);
  expect(b.max.y).toBeLessThan(1.25);
  kit.dispose();
});
