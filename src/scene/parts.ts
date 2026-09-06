import type * as T from "three";
import type { ModelKit } from "./kit";
export function hall(k: ModelKit, g: T.Group, roof: string, levels: number) {
  for (let i = 0; i < 3; i++)
    k.box(
      g,
      1.4 - i * 0.15,
      0.08,
      1.1 - i * 0.14,
      "#e4dfcc",
      0,
      0.04 + i * 0.08,
    );
  for (let i = 0; i < levels; i++) {
    const y = 0.24 + i * 0.42;
    k.box(g, 0.98 - i * 0.12, 0.35, 0.67 - i * 0.08, "#ae4e3c", 0, y + 0.175);
    for (let n = -2; n <= 2; n++)
      k.cylinder(
        g,
        0.027,
        0.34,
        "#e1b279",
        n * 0.18,
        y + 0.17,
        0.35 - i * 0.04,
      );
    k.roof(g, 1.4 - i * 0.17, 1.03 - i * 0.12, y + 0.36, 0.25, roof);
  }
}
export function shop(
  k: ModelKit,
  g: T.Group,
  x: number,
  z: number,
  color: string,
  height: number,
  width = 0.65,
) {
  k.box(g, width, height, 0.55, color, x, height / 2, z);
  for (let y = 0.24; y < height; y += 0.25) {
    k.box(g, width + 0.05, 0.035, 0.16, "#e8dfc8", x, y, z + 0.33);
    k.box(g, width + 0.03, 0.045, 0.02, "#5b7772", x, y + 0.07, z + 0.405);
    for (const dx of [-0.18, 0, 0.18])
      k.box(g, 0.07, 0.13, 0.015, "#405e63", x + dx, y + 0.12, z + 0.28);
  }
  k.box(g, width + 0.07, 0.06, 0.63, "#eae0c9", x, height, z);
  k.box(g, width * 0.75, 0.13, 0.07, "#c77759", x, 0.14, z + 0.32);
}
