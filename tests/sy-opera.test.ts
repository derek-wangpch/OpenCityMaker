import { expect, it } from "vitest";
import * as T from "three";
import { ModelKit } from "../src/scene/kit";
import { syOperaFactory } from "../src/scene/models/sydney/sy-opera";

it("opera glazing faces outward at both ends and stair treads remain exposed", () => {
  const kit = new ModelKit();
  const group = new T.Group();
  syOperaFactory(kit, group, {} as never);
  for (const [key, geo] of kit.geometries) {
    if (!key.startsWith("sy-opera-glass:")) continue;
    const direction = Number(key.split(":").at(-1));
    const normals = geo.getAttribute("normal");
    for (let i = 0; i < normals.count; i++)
      expect(normals.getZ(i) * -direction, key).toBeGreaterThan(0);
  }
  const ray = new T.Raycaster();
  group.updateMatrixWorld(true);
  for (let i = 0; i < 6; i++) {
    ray.set(
      new T.Vector3(-0.1, 2, -0.6975 + i * 0.055),
      new T.Vector3(0, -1, 0),
    );
    const hit = ray.intersectObject(group)[0];
    expect(hit.point.y).toBeCloseTo(0.06 + (i + 1) * 0.02, 5);
  }
  const bounds = new T.Box3().setFromObject(group);
  expect(bounds.min.y).toBeGreaterThanOrEqual(0);
  expect(bounds.max.y).toBeLessThan(1.1);
  expect(bounds.getSize(new T.Vector3()).x).toBeLessThanOrEqual(1.6);
  expect(bounds.getSize(new T.Vector3()).z).toBeLessThanOrEqual(1.6);
  kit.dispose();
});
