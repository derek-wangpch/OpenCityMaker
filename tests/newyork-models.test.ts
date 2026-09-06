import { expect, it } from "vitest";
import { Group, Raycaster, Vector3 } from "three";
import { ModelKit, modelFactories } from "../src/scene/models";
import { newyork } from "../src/cities/newyork";

function model(id: string) {
  const kit = new ModelKit();
  const g = new Group();
  modelFactories[id](kit, g, newyork);
  g.updateMatrixWorld(true);
  return { kit, g };
}
it("Brooklyn twin portals remain open through both towers, with a solid central pier", () => {
  const { kit, g } = model("ny-brooklyn");
  for (const z of [-0.155, 0.155]) {
    const ray = new Raycaster(new Vector3(-0.8, 0.82, z), new Vector3(1, 0, 0));
    expect(ray.intersectObject(g, true)).toHaveLength(0);
  }
  const pier = new Raycaster(new Vector3(-0.8, 0.82, 0), new Vector3(1, 0, 0));
  expect(pier.intersectObject(g, true).length).toBeGreaterThan(0);
  // The opening narrows into a point rather than a semicircle.
  const high = new Raycaster(
    new Vector3(-0.8, 1.02, 0.235),
    new Vector3(1, 0, 0),
  );
  expect(high.intersectObject(g, true).length).toBeGreaterThan(0);
  kit.dispose();
});
it("Chrysler masonry closes the bottom of the arched crown on all four faces", () => {
  const { kit, g } = model("ny-chrysler");
  for (const [x, z] of [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]) {
    const ray = new Raycaster(new Vector3(x, 1.56, z), new Vector3(-x, 0, -z));
    const hit = ray.intersectObject(g, true)[0];
    expect(hit).toBeDefined();
    expect(hit.distance).toBeLessThan(0.8);
  }
  kit.dispose();
});
it("brownstone stoop has grounded solid steps rising continuously to the doorway", () => {
  const { kit, g } = model("ny-brownstone");
  const heights = [0.58, 0.48, 0.38].map(
    (z) =>
      new Raycaster(
        new Vector3(0.11, 1, z),
        new Vector3(0, -1, 0),
      ).intersectObject(g, true)[0].point.y,
  );
  expect(heights[0]).toBeCloseTo(0.06);
  expect(heights[1]).toBeCloseTo(0.12);
  expect(heights[2]).toBeCloseTo(0.18);
  kit.dispose();
});
