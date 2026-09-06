import { describe, it, expect } from "vitest";
import { Box3, Group, Mesh } from "three";
import { ModelKit } from "../src/scene/kit";
import { syStmarysFactory } from "../src/scene/models/sydney/sy-stmarys";
import { sydney } from "../src/cities/sydney";

describe("sy-stmarys cathedral silhouette", () => {
  it("keeps twin equal needles above a cruciform long nave within the original plot and height", () => {
    const kit = new ModelKit(),
      g = new Group();
    syStmarysFactory(kit, g, sydney);
    g.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(g);
    expect(bounds.max.y).toBeLessThanOrEqual(1.536);
    for (const axis of ["x", "z"] as const) {
      expect(bounds.min[axis]).toBeGreaterThanOrEqual(-0.8);
      expect(bounds.max[axis]).toBeLessThanOrEqual(0.8);
    }
    const needles = g.children.filter((p) => p.name === "needle-spire");
    expect(needles).toHaveLength(2);
    expect(needles[0].position.x).toBe(-needles[1].position.x);
    expect(needles[0].position.y).toBe(needles[1].position.y);
    const nave = new Box3().setFromObject(g.getObjectByName("long-nave")!);
    const transept = new Box3().setFromObject(g.getObjectByName("transept")!);
    expect(nave.max.z - nave.min.z).toBeGreaterThan(
      2.5 * (nave.max.x - nave.min.x),
    );
    expect(transept.max.x).toBeGreaterThan(nave.max.x + 0.3);
    expect(transept.min.x).toBeLessThan(nave.min.x - 0.3);
    const crossing = new Box3().setFromObject(
      g.getObjectByName("crossing-tower")!,
    );
    expect(crossing.max.y).toBeLessThan(
      new Box3().setFromObject(needles[0]).max.y - 0.3,
    );
    g.traverse((p) => {
      if (p instanceof Mesh)
        for (const a of ["position", "normal"])
          expect(p.geometry.getAttribute(a).array.every(Number.isFinite)).toBe(
            true,
          );
    });
    expect(kit.batch(g, "sy-stmarys-test").children.length).toBeLessThanOrEqual(
      5,
    );
    kit.dispose();
  });
});
