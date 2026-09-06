import { expect, it } from "vitest";
import { Box3, Group, Mesh, Raycaster, Vector3 } from "three";
import { ModelKit, createBuilding, modelFactories } from "../src/scene/models";
import { hongkong } from "../src/cities/hongkong";
function raw(id: string) {
  const kit = new ModelKit(),
    g = new Group();
  modelFactories[id](kit, g, hongkong);
  g.updateMatrixWorld(true);
  return { kit, g };
}
it("the Blue House end wall has only one exposed surface at each point", () => {
  const { kit, g } = raw("hk-blue");
  for (const y of [0.2, 0.55, 1.1]) {
    const hits = new Raycaster(
      new Vector3(2, y, -0.06),
      new Vector3(-1, 0, 0),
    ).intersectObject(g, true);
    const outerFaces = hits.filter(
      (hit) => Math.abs(hit.point.x - 0.54) < 0.0001,
    );
    expect(outerFaces).toHaveLength(1);
  }
  kit.dispose();
});
it("all Hong Kong models have finite geometry within the tile and height budget", () => {
  for (const b of hongkong.buildings) {
    const kit = new ModelKit(),
      g = createBuilding(kit, hongkong, b.value);
    const bounds = new Box3().setFromObject(g);
    expect(bounds.min.x, b.model).toBeGreaterThanOrEqual(-0.83);
    expect(bounds.max.x, b.model).toBeLessThanOrEqual(0.83);
    expect(bounds.min.z, b.model).toBeGreaterThanOrEqual(-0.83);
    expect(bounds.max.z, b.model).toBeLessThanOrEqual(0.83);
    expect(bounds.min.y, b.model).toBeGreaterThanOrEqual(-0.08);
    expect(bounds.max.y, b.model).toBeLessThanOrEqual(2.65);
    g.traverse((o) => {
      if (o instanceof Mesh)
        for (const key of ["position", "normal"])
          expect(
            Array.from(o.geometry.getAttribute(key).array).every(
              Number.isFinite,
            ),
            b.model,
          ).toBe(true);
    });
    kit.dispose();
  }
});
it("the walled village entrance opens into the central lane", () => {
  const { kit, g } = raw("hk-walled");
  const hit = new Raycaster(
    new Vector3(0, 0.15, 1),
    new Vector3(0, 0, -1),
  ).intersectObject(g, true);
  expect(hit.length).toBeGreaterThan(0);
  expect(hit[0].point.z).toBeLessThan(-0.5);
  expect(
    new Raycaster(
      new Vector3(0.4, 0.15, 1),
      new Vector3(0, 0, -1),
    ).intersectObject(g, true)[0].point.z,
  ).toBeGreaterThan(0.6);
  kit.dispose();
});
it("the temple has an open entrance and an uncovered central lightwell", () => {
  const { kit, g } = raw("hk-temple");
  expect(
    new Raycaster(
      new Vector3(0, 0.2, 1),
      new Vector3(0, 0, -1),
    ).intersectObject(g, true)[0].point.z,
  ).toBeLessThan(0);
  expect(
    new Raycaster(
      new Vector3(0, 2, -0.06),
      new Vector3(0, -1, 0),
    ).intersectObject(g, true)[0].point.y,
  ).toBeLessThan(0.06);
  kit.dispose();
});
it("all four clock elevations expose complete clock faces", () => {
  const { kit, g } = raw("hk-clock");
  for (const [x, z] of [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ]) {
    const hits = new Raycaster(
      new Vector3(x, 1.2, z),
      new Vector3(-x, 0, -z),
    ).intersectObject(g, true);
    expect(hits.length).toBeGreaterThan(0);
    expect(
      Math.max(Math.abs(hits[0].point.x), Math.abs(hits[0].point.z)),
    ).toBeGreaterThan(0.245);
  }
  kit.dispose();
});
it("the Bank of China twin masts intersect the roof below their bases", () => {
  const { kit, g } = raw("hk-boc");
  const shafts = g.children.filter(
    (o) => o instanceof Mesh && o.geometry.type === "BufferGeometry",
  );
  for (const z of [-0.055, 0.055]) {
    const hits = new Raycaster(
      new Vector3(0.055, 2.7, z),
      new Vector3(0, -1, 0),
    ).intersectObjects(shafts, true);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].point.y).toBeGreaterThan(2.19);
    expect(hits[0].point.y).toBeLessThan(2.58);
  }
  kit.dispose();
});
it("ICC retains a continuous taper and level roof; IFC crown stays open above its core", () => {
  const { kit } = raw("hk-icc");
  const p = kit.geometries.get("hk-icc:shaft")!.getAttribute("position");
  const levels = new Map<number, number>();
  for (let i = 0; i < p.count; i++)
    levels.set(
      p.getY(i),
      Math.max(
        levels.get(p.getY(i)) ?? 0,
        Math.abs(p.getX(i)),
        Math.abs(p.getZ(i)),
      ),
    );
  const rings = [...levels].sort((a, b) => a[0] - b[0]);
  expect(rings.at(-1)![0]).toBeCloseTo(2.44);
  for (let i = 1; i < rings.length; i++)
    expect(rings[i][1]).toBeLessThan(rings[i - 1][1]);
  kit.dispose();
  const ifc = raw("hk-ifc");
  const hits = new Raycaster(
    new Vector3(0, 3, 0),
    new Vector3(0, -1, 0),
  ).intersectObject(ifc.g, true);
  expect(hits[0].point.y).toBeCloseTo(2.29);
  expect(new Box3().setFromObject(ifc.g).max.y).toBeGreaterThan(2.45);
  ifc.kit.dispose();
});
