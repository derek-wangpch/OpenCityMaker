import { describe, expect, it } from "vitest";
import { Group, Mesh, Raycaster, Vector3 } from "three";
import { singapore } from "../src/cities/singapore";
import { ModelKit } from "../src/scene/kit";
import { sgSupertreesFactory } from "../src/scene/models/singapore/sg-supertrees";
import { sgMerlionFactory } from "../src/scene/models/singapore/sg-merlion";
import { sgShophouseFactory } from "../src/scene/models/singapore/sg-shophouse";
import { sgTerraceFactory } from "../src/scene/models/singapore/sg-terrace";
import { sgHdbFactory } from "../src/scene/models/singapore/sg-hdb";

const hasHit = (
  g: Group,
  origin: number[],
  direction: number[],
  far: number,
) => {
  g.updateMatrixWorld(true);
  return (
    new Raycaster(
      new Vector3(...origin),
      new Vector3(...direction),
      0,
      far,
    ).intersectObject(g, true).length > 0
  );
};
describe("Singapore recognizable structures", () => {
  it("leaves a continuous walkable five-foot way beneath both shophouse types", () => {
    const k = new ModelKit();
    for (const [factory, z, y] of [
      [sgShophouseFactory, 0.27, 0.16],
      [sgTerraceFactory, 0.1944, 0.1152],
    ] as const) {
      const g = new Group();
      factory(k, g, singapore);
      expect(hasHit(g, [-0.8, y, z], [1, 0, 0], 1.6)).toBe(false);
      expect(hasHit(g, [0, y, z], [0, 1, 0], 0.5)).toBe(true);
    }
    k.dispose();
  });
  it("keeps HDB ground floors open beneath the housing slabs", () => {
    const k = new ModelKit(),
      g = new Group();
    sgHdbFactory(k, g, singapore);
    expect(hasHit(g, [-0.36, 0.09, 0.7], [0, 0, -1], 1.4)).toBe(false);
    expect(hasHit(g, [-0.36, 0.09, -0.13], [0, 1, 0], 0.3)).toBe(true);
    k.dispose();
  });
  it("keeps the skyway deck level and tree crowns open around the service caps", () => {
    const k = new ModelKit(),
      g = new Group();
    sgSupertreesFactory(k, g, singapore);
    const deck = g.children.filter(
      (m): m is Mesh =>
        m instanceof Mesh && k.material("#b7a16c") === m.material,
    );
    expect(deck.length).toBeGreaterThan(1);
    for (const piece of deck) expect(piece.position.y).toBeCloseTo(0.91);
    expect(hasHit(g, [-0.09, 2, -0.13], [0, -1, 0], 0.4)).toBe(false);
    k.dispose();
  });
  it("joins the water stream to the mouth and lands it inside the basin", () => {
    const k = new ModelKit(),
      g = new Group();
    sgMerlionFactory(k, g, singapore);
    const jet = k.geometries.get("sg-merlion:water")!;
    jet.computeBoundingBox();
    expect(jet.boundingBox!.min.z).toBeCloseTo(0.22, 2);
    expect(jet.boundingBox!.max.z).toBeLessThan(0.73);
    expect(jet.boundingBox!.min.y).toBeGreaterThan(0.045);
    expect(jet.boundingBox!.max.y).toBeLessThan(1.07);
    k.dispose();
  });
});
