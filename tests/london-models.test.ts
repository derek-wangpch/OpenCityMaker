import { describe, expect, it } from "vitest";
import { Group, Mesh, Raycaster, Vector3 } from "three";
import { london } from "../src/cities/london";
import { ModelKit } from "../src/scene/kit";
import { londonModels } from "../src/scene/models/london";

function model(id: string) {
  const kit = new ModelKit();
  const group = new Group();
  londonModels[id](kit, group, london);
  group.updateMatrixWorld(true);
  return { kit, group };
}

describe("London landmark spatial identity", () => {
  it("keeps the road open through both Tower Bridge towers", () => {
    const { kit, group } = model("ld-towerbridge");
    for (const z of [-0.1, 0, 0.1]) {
      const ray = new Raycaster(new Vector3(-1, 0.42, z), new Vector3(1, 0, 0));
      expect(ray.intersectObject(group, true)).toHaveLength(0);
    }
    // The test must still detect the stonework above the road.
    const upper = new Raycaster(new Vector3(-1, 0.85, 0), new Vector3(1, 0, 0));
    expect(upper.intersectObject(group, true).length).toBeGreaterThan(0);
    kit.dispose();
  });

  it("keeps both ends of the mews lane open", () => {
    const { kit, group } = model("ld-mews");
    for (const x of [-0.12, 0, 0.12]) {
      const ray = new Raycaster(new Vector3(x, 0.2, -1), new Vector3(0, 0, 1));
      expect(ray.intersectObject(group, true)).toHaveLength(0);
    }
    kit.dispose();
  });

  it("leaves Buckingham Palace's quadrangle open to the sky", () => {
    const { kit, group } = model("ld-buckingham");
    const ray = new Raycaster(new Vector3(0, 2, -0.2), new Vector3(0, -1, 0));
    expect(ray.intersectObject(group, true)).toHaveLength(0);
    ray.set(new Vector3(0.56, 2, -0.2), new Vector3(0, -1, 0));
    expect(ray.intersectObject(group, true).length).toBeGreaterThan(0);
    kit.dispose();
  });

  it("places all 32 Eye cabins outside the wheel with level long axes", () => {
    const { kit, group } = model("ld-eye");
    const cabins: Mesh[] = [];
    group.traverse((part) => {
      if (part instanceof Mesh && part.material === kit.material("#8fb6c0"))
        cabins.push(part);
    });
    expect(cabins).toHaveLength(32);
    for (const cabin of cabins) {
      expect(
        Math.hypot(cabin.position.x, cabin.position.y - 0.98) -
          Math.max(cabin.scale.x, cabin.scale.y),
      ).toBeGreaterThan(0.64);
      expect(cabin.rotation.z).toBe(0);
    }
    kit.dispose();
  });
});
