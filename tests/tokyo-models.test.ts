import { expect, it } from "vitest";
import { Box3, Group, Mesh, Raycaster, Vector3 } from "three";
import { ModelKit } from "../src/scene/kit";
import { tokyoModels } from "../src/scene/models/tokyo";
import { tokyo } from "../src/cities/tokyo";
function hits(id: string, origin: number[], direction: number[]) {
  const k = new ModelKit(),
    g = new Group();
  tokyoModels[id](k, g, tokyo);
  g.updateMatrixWorld(true);
  const count = new Raycaster(
    new Vector3(...origin),
    new Vector3(...direction),
  ).intersectObject(g, true).length;
  k.dispose();
  return count;
}
it("joins Tocho below its upper twin-tower gap", () => {
  expect(hits("tk-tocho", [0, 1, -1], [0, 0, 1])).toBeGreaterThan(0);
  expect(hits("tk-tocho", [0, 1.9, -1], [0, 0, 1])).toBe(0);
});
it("keeps both Diet courtyards open to the sky", () => {
  for (const x of [-0.38, 0.38])
    expect(hits("tk-diet", [x, 2, -0.05], [0, -1, 0])).toBe(0);
});
it("keeps the Kaminarimon passage open below its suspended lantern", () => {
  expect(hits("tk-kaminarimon", [0, 0.15, -1], [0, 0, 1])).toBe(0);
  expect(hits("tk-kaminarimon", [0, 0.5, -1], [0, 0, 1])).toBeGreaterThan(0);
});
it("leaves the Nagaya lane open at both ends", () => {
  expect(hits("tk-nagaya", [-1, 0.12, 0.43], [1, 0, 0])).toBe(0);
});

it("keeps all eleven Tokyo models finite and inside their plots", () => {
  const k = new ModelKit();
  for (const [id, factory] of Object.entries(tokyoModels)) {
    const g = new Group();
    factory(k, g, tokyo);
    const bounds = new Box3().setFromObject(g);
    for (const axis of ["x", "z"] as const) {
      expect(bounds.min[axis], id).toBeGreaterThanOrEqual(-0.8);
      expect(bounds.max[axis], id).toBeLessThanOrEqual(0.8);
    }
    expect(bounds.max.y, id).toBeLessThanOrEqual(2.65);
    g.traverse((part) => {
      if (part instanceof Mesh)
        for (const name of ["position", "normal"])
          expect(
            part.geometry.getAttribute(name).array.every(Number.isFinite),
            id,
          ).toBe(true);
    });
  }
  k.dispose();
});
