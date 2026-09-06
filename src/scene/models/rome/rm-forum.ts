import type { Factory } from "../../kit";
export const rmForumFactory: Factory = (k, g) => {
  const stone = "#cdbb96",
    light = "#e1cda8",
    old = "#aa9273";
  // A compact Forum fragment inspired by the Dioscuri, not the whole site's plan.
  k.box(g, 1.12, 0.075, 0.83, old, 0, 0.038, -0.02);
  k.box(g, 0.96, 0.095, 0.42, stone, -0.05, 0.122, -0.18);
  for (const x of [-0.37, -0.08, 0.21]) {
    k.box(g, 0.17, 0.065, 0.17, light, x, 0.2, -0.18);
    k.cylinder(g, 0.066, 0.69, stone, x, 0.577, -0.18, 0.047, 12);
    // Capitals are broad silhouettes; no fine acanthus or dense fluting.
    k.cylinder(g, 0.073, 0.07, light, x, 0.955, -0.18, 0.087, 8);
    k.box(g, 0.17, 0.045, 0.18, light, x, 1.014, -0.18);
  }
  k.box(g, 0.78, 0.095, 0.19, stone, -0.08, 1.084, -0.18);
  k.box(g, 0.84, 0.04, 0.23, light, -0.08, 1.152, -0.18);
  // A shortened upper fragment prevents the lintel reading as a new temple roof.
  k.box(g, 0.51, 0.055, 0.18, old, -0.17, 1.198, -0.18);
  for (const [x, z, h] of [
    [-0.38, 0.28, 0.19],
    [0.15, 0.32, 0.27],
    [0.46, -0.34, 0.15],
  ]) {
    k.cylinder(g, 0.065, h, stone, x, 0.075 + h / 2, z, 0.06, 10);
  }
  const fallen = k.cylinder(g, 0.064, 0.27, old, 0.44, 0.13, 0.21, 0.064, 10);
  fallen.rotation.z = Math.PI / 2;
  k.box(g, 0.22, 0.06, 0.13, light, -0.11, 0.105, 0.35);
};
