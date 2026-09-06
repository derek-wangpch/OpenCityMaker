import { describe, it, expect } from "vitest";
import { Box3, Group, Mesh, Raycaster, Vector3 } from "three";
import { ModelKit } from "../src/scene/kit";
import { syUniversityFactory } from "../src/scene/models/sydney/sy-university";
import { sydney } from "../src/cities/sydney";

describe("sy-university architectural spaces", () => {
  it("keeps the gateway open to the quad and the lawn open to the sky", () => {
    const kit = new ModelKit();
    const g = new Group();
    syUniversityFactory(kit, g, sydney);
    g.updateMatrixWorld(true);
    const gate = new Raycaster(
      new Vector3(0, 0.18, 0.8),
      new Vector3(0, 0, -1),
      0,
      0.9,
    );
    expect(gate.intersectObject(g, true)).toHaveLength(0);
    // A ray beside the gateway must meet the supporting stone, not another void.
    const jamb = new Raycaster(
      new Vector3(0.19, 0.18, 0.8),
      new Vector3(0, 0, -1),
      0,
      0.5,
    );
    expect(jamb.intersectObject(g, true).length).toBeGreaterThan(0);
    const sky = new Raycaster(
      new Vector3(0.25, 2, -0.25),
      new Vector3(0, -1, 0),
    );
    const hits = sky.intersectObject(g, true);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].point.y).toBeLessThan(0.06);
    const bounds = new Box3().setFromObject(g);
    expect(bounds.max.y).toBeLessThanOrEqual(1.61);
    expect(bounds.min.x).toBeGreaterThanOrEqual(-0.8);
    expect(bounds.max.x).toBeLessThanOrEqual(0.8);
    expect(bounds.min.z).toBeGreaterThanOrEqual(-0.8);
    expect(bounds.max.z).toBeLessThanOrEqual(0.8);
    g.traverse((part) => {
      if (!(part instanceof Mesh)) return;
      for (const name of ["position", "normal"])
        expect(
          part.geometry.getAttribute(name).array.every(Number.isFinite),
        ).toBe(true);
    });
    const batched = kit.batch(g, "sy-university-test");
    expect(batched.children.length).toBeLessThan(10);
    kit.dispose();
  });
});
