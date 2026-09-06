import { BufferGeometry, Float32BufferAttribute } from "three";
import type { Factory } from "../../kit";

export const rmDomusFactory: Factory = (k, g) => {
  k.box(g, 1.02, 0.035, 0.92, "#cbb58c", 0, 0.0175);
  // Four inward-draining roof planes, with a genuinely open compluvium.
  const volume = (wall: boolean) => {
    const outer = [
      [-0.51, 0.53, -0.46],
      [0.51, 0.53, -0.46],
      [0.51, 0.53, 0.46],
      [-0.51, 0.53, 0.46],
    ];
    const inner = [
      [-0.27, 0.42, -0.24],
      [0.27, 0.42, -0.24],
      [0.27, 0.42, 0.24],
      [-0.27, 0.42, 0.24],
    ];
    const vertices: number[] = [];
    const quad = (a: number[], b: number[], c: number[], d: number[]) =>
      vertices.push(...a, ...b, ...c, ...a, ...c, ...d);
    const lower = (p: number[]) => [p[0], wall ? 0.035 : p[1] - 0.035, p[2]];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      quad(outer[i], inner[i], inner[j], outer[j]);
      quad(lower(outer[j]), lower(inner[j]), lower(inner[i]), lower(outer[i]));
      quad(outer[j], lower(outer[j]), lower(outer[i]), outer[i]);
      quad(inner[i], lower(inner[i]), lower(inner[j]), inner[j]);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    return geo;
  };
  k.mesh(
    g,
    k.geometry("rome-domus-walls", () => volume(true)),
    "#d5b382",
    0,
    -0.005,
  );
  k.mesh(
    g,
    k.geometry("rome-domus-compluvium", () => volume(false)),
    "#ac6848",
  );
  k.box(g, 0.54, 0.19, 0.48, "#cbb58c", 0, 0.13);
  k.box(g, 0.29, 0.035, 0.25, "#e4cfaa", 0, 0.244);
  k.box(g, 0.23, 0.008, 0.19, "#79a69e", 0, 0.265);
  k.box(g, 0.15, 0.25, 0.015, "#66503a", 0, 0.16, 0.468);
  k.box(g, 0.23, 0.03, 0.1, "#cbb58c", 0, 0.04, 0.48);
};
