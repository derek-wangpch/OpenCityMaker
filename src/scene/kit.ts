import * as T from "three";
import type { CityPack } from "../cities/types";
/** Every original model occupies a 1.6 × 1.6 plot, y=0 at ground; max height 2.65. */
export class ModelKit {
  templates = new Map<string, T.Group>();
  geometries = new Map<string, T.BufferGeometry>();
  materials = new Map<string, T.MeshStandardMaterial>();
  geometry(key: string, create: () => T.BufferGeometry) {
    if (!this.geometries.has(key)) this.geometries.set(key, create());
    return this.geometries.get(key)!;
  }
  material(color: string) {
    if (!this.materials.has(color))
      this.materials.set(
        color,
        new T.MeshStandardMaterial({
          color,
          roughness: 0.76,
          metalness: 0.04,
          flatShading: true,
        }),
      );
    return this.materials.get(color)!;
  }
  mesh(
    g: T.Group,
    geometry: T.BufferGeometry,
    color: string,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const m = new T.Mesh(geometry, this.material(color));
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
    return m;
  }
  box(
    g: T.Group,
    w: number,
    h: number,
    d: number,
    color: string,
    x = 0,
    y = h / 2,
    z = 0,
  ) {
    const m = this.mesh(
      g,
      this.geometry("box", () => new T.BoxGeometry(1, 1, 1)),
      color,
      x,
      y,
      z,
    );
    m.scale.set(w, h, d);
    return m;
  }
  cylinder(
    g: T.Group,
    r: number,
    h: number,
    color: string,
    x = 0,
    y = h / 2,
    z = 0,
    top = r,
    segments = 16,
  ) {
    return this.mesh(
      g,
      this.geometry(
        `cyl:${r}:${h}:${top}:${segments}`,
        () => new T.CylinderGeometry(top, r, h, segments),
      ),
      color,
      x,
      y,
      z,
    );
  }
  sphere(
    g: T.Group,
    r: number,
    color: string,
    x: number,
    y: number,
    z: number,
  ) {
    const m = this.mesh(
      g,
      this.geometry("sphere", () => new T.IcosahedronGeometry(1, 1)),
      color,
      x,
      y,
      z,
    );
    m.scale.setScalar(r);
    return m;
  }
  beam(g: T.Group, a: number[], b: number[], width: number, color: string) {
    const av = new T.Vector3(...a),
      bv = new T.Vector3(...b),
      delta = bv.clone().sub(av);
    const m = this.box(g, width, delta.length(), width, color);
    m.position.copy(av.add(bv).multiplyScalar(0.5));
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize());
    return m;
  }
  roof(
    g: T.Group,
    w: number,
    d: number,
    y: number,
    h: number,
    color: string,
    x = 0,
    z = 0,
  ) {
    const key = `roof:${w}:${d}:${h}`;
    const geo = this.geometry(key, () => {
      const positions: number[] = [];
      const rings = [
        [w / 2, d / 2, 0],
        [w * 0.38, d * 0.35, h * 0.22],
        [w * 0.25, 0.018, h],
      ];
      const corners = (r: number[]) => [
        [-r[0], r[2], -r[1]],
        [r[0], r[2], -r[1]],
        [r[0], r[2], r[1]],
        [-r[0], r[2], r[1]],
      ];
      for (let level = 0; level < 2; level++) {
        const a = corners(rings[level]),
          b = corners(rings[level + 1]);
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          positions.push(...a[i], ...b[i], ...a[j], ...a[j], ...b[i], ...b[j]);
        }
      }
      const result = new T.BufferGeometry();
      result.setAttribute(
        "position",
        new T.Float32BufferAttribute(positions, 3),
      );
      result.computeVertexNormals();
      return result;
    });
    this.mesh(g, geo, color, x, y, z);
    this.box(g, w, 0.045, d, color, x, y - 0.018, z);
    this.box(g, w * 0.53, 0.045, 0.055, color, x, y + h, z);
    // Fine raised tile seams on both slopes.
    for (let n = -3; n <= 3; n++)
      for (const side of [-1, 1])
        this.beam(
          g,
          [x + n * w * 0.065, y + h + 0.015, z],
          [x + n * w * 0.115, y + 0.025, z + (side * d) / 2],
          0.012,
          color,
        );
  }
  house(
    g: T.Group,
    x: number,
    z: number,
    scale: number,
    roof: string,
    wall = "#e7cfaa",
    rotation = 0,
  ) {
    const h = new T.Group();
    h.position.set(x, 0, z);
    h.rotation.y = rotation;
    h.scale.setScalar(scale);
    g.add(h);
    this.box(h, 0.72, 0.4, 0.55, wall);
    this.roof(h, 0.9, 0.73, 0.41, 0.23, roof);
    this.box(h, 0.14, 0.27, 0.02, "#68574a", 0, 0.135, 0.282);
    for (const side of [-1, 1]) {
      this.box(h, 0.14, 0.13, 0.025, "#8badac", side * 0.235, 0.23, 0.285);
      this.box(h, 0.016, 0.14, 0.032, "#f2e1c8", side * 0.235, 0.23, 0.287);
    }
    this.box(h, 0.24, 0.035, 0.16, "#d6c4a7", 0, 0.018, 0.35);
  }
  tree(g: T.Group, x: number, z: number, size = 1) {
    this.cylinder(g, 0.025, 0.22 * size, "#84715a", x, 0.11 * size, z);
    this.sphere(g, 0.135 * size, "#688b57", x, 0.28 * size, z);
    this.sphere(g, 0.105 * size, "#87a265", x + 0.04, 0.39 * size, z);
  }
  windows(
    g: T.Group,
    w: number,
    h: number,
    d: number,
    y = 0,
    color = "#c2dce0",
    x = 0,
    z = 0,
    rows = 8,
  ) {
    for (let i = 1; i <= rows; i++) {
      const yy = y + (i * h) / (rows + 1);
      this.box(g, w + 0.012, 0.025, d + 0.012, color, x, yy, z);
    }
    for (let i = -2; i <= 2; i++) {
      this.box(g, 0.016, h, d + 0.016, color, x + (i * w) / 5, y + h / 2, z);
      this.box(g, w + 0.018, h, 0.016, color, x, y + h / 2, z + (i * d) / 5);
    }
  }
  /** Bake each color into one reusable mesh to keep crowded phone boards inexpensive. */
  batch(group: T.Group, key: string): T.Group {
    group.updateMatrixWorld(true);
    const byMaterial = new Map<T.MeshStandardMaterial, T.BufferGeometry[]>();
    group.traverse((object) => {
      if (!(object instanceof T.Mesh)) return;
      const material = object.material as T.MeshStandardMaterial;
      const geometry = object.geometry.index
        ? object.geometry.toNonIndexed()
        : object.geometry.clone();
      geometry.applyMatrix4(object.matrixWorld);
      const parts = byMaterial.get(material) ?? [];
      parts.push(geometry);
      byMaterial.set(material, parts);
    });
    const result = new T.Group();
    let index = 0;
    for (const [material, parts] of byMaterial) {
      const geometry = this.geometry(key + ":" + index++, () => {
        const merged = new T.BufferGeometry();
        for (const name of ["position", "normal"]) {
          const length = parts.reduce(
            (sum, part) => sum + part.getAttribute(name).array.length,
            0,
          );
          const array = new Float32Array(length);
          let offset = 0;
          for (const part of parts) {
            const source = part.getAttribute(name).array;
            array.set(source, offset);
            offset += source.length;
          }
          merged.setAttribute(name, new T.BufferAttribute(array, 3));
        }
        return merged;
      });
      const mesh = new T.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      result.add(mesh);
      parts.forEach((part) => part.dispose());
    }
    this.templates.set(key, result);
    return result.clone();
  }
  dispose() {
    this.templates.clear();
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
  }
}
export type Factory = (k: ModelKit, g: T.Group, city: CityPack) => void;
