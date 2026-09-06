import { expect, it } from "vitest";
import { Group, Raycaster, Vector3 } from "three";
import { beijing } from "../src/cities/beijing";
import { ModelKit, modelFactories } from "../src/scene/models";

function inspect(id: string, run: (g: Group) => void) {
  const kit = new ModelKit(),
    g = new Group();
  modelFactories[id](kit, g, beijing);
  g.updateMatrixWorld(true);
  try {
    run(g);
  } finally {
    kit.dispose();
  }
}
const hits = (
  g: Group,
  x: number,
  y: number,
  z: number,
  dx: number,
  dy: number,
  dz: number,
) =>
  new Raycaster(
    new Vector3(x, y, z),
    new Vector3(dx, dy, dz),
    0,
    3,
  ).intersectObject(g, true);

it("city gate has a traversable arch with solid shoulders and lintel", () => {
  inspect("bj-gate", (g) => {
    expect(hits(g, 0, 0.16, 1, 0, 0, -1)).toHaveLength(0);
    expect(hits(g, 0.4, 0.16, 1, 0, 0, -1).length).toBeGreaterThan(0);
    expect(hits(g, 0, 0.4, 1, 0, 0, -1).length).toBeGreaterThan(0);
  });
});
it("hutong leaves both lane exits clear and turns doors toward the lane", () => {
  inspect("bj-hutong", (g) => {
    expect(hits(g, 0, 0.15, 0.9, 0, 0, -1)).toHaveLength(0);
    expect(hits(g, 0, 0.15, -0.9, 0, 0, 1)).toHaveLength(0);
    for (const dx of [-1, 1]) {
      const door = hits(g, 0, 0.08, 0, dx, 0, 0)[0];
      expect(door).toBeDefined();
      expect((door.object as any).material.color.getHexString()).toBe("a34e3c");
    }
  });
});
it("Temple of Heaven has enclosed drums connecting all three eaves", () => {
  inspect("bj-heaven", (g) => {
    for (const y of [0.86, 1.17])
      expect(hits(g, 1, y, 0, -1, 0, 0).length).toBeGreaterThan(0);
  });
});
it("Drum Tower masonry supports the gallery above its lower eave", () => {
  inspect("bj-drum", (g) => {
    expect(hits(g, 0.4, 0.5, 1, 0, 0, -1).length).toBeGreaterThan(0);
    expect(hits(g, 0.2, 1.02, 1, 0, 0, -1).length).toBeGreaterThan(0);
  });
});
