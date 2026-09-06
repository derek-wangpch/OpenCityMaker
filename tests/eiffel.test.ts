import { expect, it } from "vitest";
import { Box3, Group, Vector3 } from "three";
import { ModelKit } from "../src/scene/kit";
import { paris } from "../src/cities/paris";
import { paEiffelFactory } from "../src/scene/models/paris/pa-eiffel";

it("keeps the upper shaft narrowing from the second platform", () => {
  const kit = new ModelKit();
  const group = new Group();
  const second = (115.73 / 330) * 2.62;
  const third = (276.13 / 330) * 2.62;
  const posts: [Vector3, Vector3][] = [];
  const beam = kit.beam.bind(kit);
  kit.beam = (g, a, b, width, color) => {
    if (width === 0.022) posts.push([new Vector3(...a), new Vector3(...b)]);
    return beam(g, a, b, width, color);
  };
  paEiffelFactory(kit, group, paris);
  expect(posts.length).toBeGreaterThan(0);
  for (const [a, b] of posts) {
    expect(a.y).toBeGreaterThanOrEqual(second - 1e-8);
    expect(b.y).toBeLessThanOrEqual(third + 1e-8);
    expect(Math.abs(b.x)).toBeLessThan(Math.abs(a.x));
    expect(Math.abs(b.z)).toBeLessThan(Math.abs(a.z));
  }
  const feet = posts.filter(([a]) => Math.abs(a.y - second) < 1e-8);
  expect(feet).toHaveLength(4);
  for (const [a] of feet)
    expect(Math.abs(a.x)).toBeCloseTo(((20.48 * 2.62) / 330) * 1.18);
  const bounds = new Box3().setFromObject(group);
  expect(bounds.max.y).toBeLessThanOrEqual(2.65);
  expect(
    Math.max(
      Math.abs(bounds.min.x),
      bounds.max.x,
      Math.abs(bounds.min.z),
      bounds.max.z,
    ),
  ).toBeLessThanOrEqual(0.8);
  kit.dispose();
});
