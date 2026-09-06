import * as T from "three";
import type { ModelKit } from "./kit";
import { mixHex, skyTint, type Weather } from "../game/weather";
/**
 * Diorama weather for the board view: a few cheap, deterministic particle
 * fields over the island plus the light/fog mood that sells them. The group is
 * a sibling of SceneView's `root` so rebuilding the board never drops it, and
 * geometries live in the shared ModelKit while this class owns its materials.
 *
 * Everything derives from an integer hash of the particle index — no
 * Math.random — so any frame is reproducible and the reduced-motion frame is
 * stable across reloads and screenshots.
 */
const RAIN_COUNT = 520;
const SNOW_COUNT = 340;
/** Spawn box around the island: x/z span, then top and span of the fall
 * (wrapping y over [TOP - FALL, TOP]). */
const SPAN = 13,
  TOP = 9,
  FALL = 9.6;
/** Light multipliers on the values captured at construction. */
const LIGHTS: Record<Weather, { hemi: number; sun: number; exposure: number }> =
  {
    off: { hemi: 1, sun: 1, exposure: 1 },
    clear: { hemi: 1, sun: 1, exposure: 1 },
    cloudy: { hemi: 0.9, sun: 0.72, exposure: 0.98 },
    rain: { hemi: 0.85, sun: 0.38, exposure: 0.96 },
    snow: { hemi: 1.14, sun: 0.74, exposure: 1 },
    fog: { hemi: 1.06, sun: 0.52, exposure: 0.97 },
  };
/** Deterministic per-index randomness in [0, 1). The murmur-style finalizer is
 * essential: a purely multiplicative hash is affine, so salting by addition
 * would collapse every particle property onto one shared 1-D curve. */
const rand = (i: number, salt: number) => {
  let h = Math.imul(i + 1, 0x27d4eb2d) ^ Math.imul(salt + 1, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 2 ** 32;
};
/** Fixed phase for the reduced-motion frame, identical on every reload. */
const STATIC_PHASE = 1200;
export class WeatherSystem {
  readonly group = new T.Group();
  private kind: Weather = "clear";
  private reduced = false;
  private rain: T.LineSegments;
  private snow: T.Points;
  private puffs: T.Group;
  private clouds: T.Group;
  private cloudParts: {
    x0: number;
    y0: number;
    z0: number;
    speed: number;
    phase: number;
  }[];
  private lineMaterial: T.LineBasicMaterial;
  private pointsMaterial: T.PointsMaterial;
  private atmosphereTextures: T.CanvasTexture[];
  private atmosphereMaterials: T.SpriteMaterial[] = [];
  private snowTexture: T.CanvasTexture;
  private base: { hemi: number; sun: number; exposure: number };
  private fogKey = "";
  private weights: Record<Weather, number> = {
    clear: 1,
    cloudy: 0,
    rain: 0,
    snow: 0,
    fog: 0,
    off: 0,
  };
  private from = { ...this.weights };
  private transitionStart = 0;
  private transitioning = false;
  private initialized = false;
  constructor(
    private scene: T.Scene,
    kit: ModelKit,
    private hemi: T.HemisphereLight,
    private sun: T.DirectionalLight,
    private renderer: T.WebGLRenderer,
  ) {
    this.base = {
      hemi: hemi.intensity,
      sun: sun.intensity,
      exposure: renderer.toneMappingExposure,
    };
    const sphere = new T.Sphere(new T.Vector3(0, 4, 0), 26);
    // Rain: one LineSegments whose 520 streaks are rewritten per frame.
    const rainGeometry = kit.geometry("weather:rain", () =>
      new T.BufferGeometry().setAttribute(
        "position",
        new T.BufferAttribute(new Float32Array(RAIN_COUNT * 6), 3),
      ),
    );
    rainGeometry.boundingSphere = sphere;
    this.lineMaterial = new T.LineBasicMaterial({
      color: "#9dc0d6",
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });
    this.rain = new T.LineSegments(rainGeometry, this.lineMaterial);
    // Snow: one Points cloud with a soft round canvas sprite.
    const snowGeometry = kit.geometry("weather:snow", () =>
      new T.BufferGeometry().setAttribute(
        "position",
        new T.BufferAttribute(new Float32Array(SNOW_COUNT * 3), 3),
      ),
    );
    snowGeometry.boundingSphere = sphere;
    this.snowTexture = WeatherSystem.softDot();
    this.pointsMaterial = new T.PointsMaterial({
      map: this.snowTexture,
      color: "#ffffff",
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: false,
      size: 4.2 * this.renderer.getPixelRatio(),
    });
    this.snow = new T.Points(snowGeometry, this.pointsMaterial);
    this.atmosphereTextures = Array.from({ length: 6 }, (_, i) =>
      WeatherSystem.vaporTexture(i),
    );
    this.puffs = this.vaporBank(true).group;
    const bank = this.vaporBank(false);
    this.clouds = bank.group;
    this.cloudParts = bank.parts;
    for (const object of [this.rain, this.snow, this.puffs, this.clouds]) {
      object.castShadow = false;
      object.receiveShadow = false;
      object.frustumCulled = false;
      object.visible = false;
      this.group.add(object);
    }
    this.rain.renderOrder = 3;
    this.snow.renderOrder = 3;
    this.puffs.renderOrder = 2;
    this.clouds.renderOrder = 1;
    this.scene.add(this.group);
  }
  /** Rain streak falls fastest, snow drifts, fog and clouds wander slowly. */
  private static fall(i: number, salt: number, base: number, spread: number) {
    return base + rand(i, salt) * spread;
  }
  /** Soft round flake: white core with a cool rim so it reads on pale skies. */
  private static softDot(): T.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(24, 24, 3, 24, 24, 24);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.55, "rgba(232,240,250,1)");
    gradient.addColorStop(1, "rgba(206,220,240,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 48, 48);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    return texture;
  }
  /** Overlapping soft lobes form a single shaded cloud without mesh seams. */
  private static vaporTexture(variant: number): T.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    // Distinct silhouettes, not just scaled copies of the same cloud:
    // a tall cumulus crown, a trailing bank, and separated small cloudlets.
    const profiles = [
      [
        [48, 82, 25],
        [80, 72, 33],
        [114, 49, 40],
        [150, 66, 36],
        [184, 80, 28],
        [210, 85, 19],
      ],
      [
        [31, 78, 17],
        [57, 74, 22],
        [89, 72, 26],
        [124, 68, 29],
        [158, 61, 32],
        [188, 67, 27],
        [218, 74, 17],
      ],
      [
        [43, 79, 23],
        [65, 68, 26],
        [123, 53, 24],
        [143, 61, 20],
        [198, 77, 26],
        [219, 85, 17],
      ],
    ];
    const profile = profiles[variant % profiles.length];
    for (let i = 0; i < profile.length * 3; i++) {
      const [cx, cy, r] = profile[Math.floor(i / 3)];
      const radius = r * (0.83 + rand(i, 53 + variant * 7) * 0.17);
      const rawX = cx + (rand(i, 51 + variant * 7) - 0.5) * 10;
      const rawY = cy + (rand(i, 52 + variant * 7) - 0.5) * 8;
      // A transparent gutter protects every edge from texture clipping.
      const x = T.MathUtils.clamp(
        variant >= 3 ? 256 - rawX : rawX,
        radius + 4,
        252 - radius,
      );
      const y = T.MathUtils.clamp(rawY, radius + 4, 124 - radius);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "rgba(255,255,255,0.8)");
      gradient.addColorStop(0.45, "rgba(255,255,255,0.65)");
      gradient.addColorStop(0.75, "rgba(255,255,255,0.28)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    ctx.globalCompositeOperation = "source-atop";
    const shade = ctx.createLinearGradient(0, 25, 0, 110);
    shade.addColorStop(0, "#fffdf6");
    shade.addColorStop(0.48, "#edf2f3");
    shade.addColorStop(1, "#9aaebb");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, 256, 128);
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace;
    return texture;
  }
  private vaporBank(mist: boolean) {
    const group = new T.Group();
    const parts = [];
    const count = mist ? 12 : 6;
    for (let i = 0; i < count; i++) {
      const material = new T.SpriteMaterial({
        map: this.atmosphereTextures[
          mist ? 1 : i % this.atmosphereTextures.length
        ],
        transparent: true,
        opacity: mist ? 0.2 : 0.78,
        depthWrite: false,
        fog: false,
        toneMapped: false,
      });
      this.atmosphereMaterials.push(material);
      const cloud = new T.Sprite(material);
      const angle = (i / count) * Math.PI * 2;
      // Mist crosses the board and rim; clouds frame the far skyline.
      const x0 = mist ? Math.cos(angle) * 3.8 : -5 + rand(i, 61) * 9;
      const y0 = mist ? 0.25 + rand(i, 62) * 0.65 : 3.5 + rand(i, 62) * 1.6;
      const z0 = mist ? Math.sin(angle) * 3.8 : -4.8 + rand(i, 63) * 2.4;
      cloud.position.set(x0, y0, z0);
      const shape = i % 3;
      const width = mist
        ? 5 + rand(i, 64) * 3
        : [3.5, 4.5, 2.8][shape] + rand(i, 64) * 0.7;
      cloud.scale.set(
        width,
        width * (mist ? 0.23 : [0.56, 0.28, 0.44][shape]),
        1,
      );
      group.add(cloud);
      parts.push({
        x0,
        y0,
        z0,
        speed: 0.055 + rand(i, 41) * 0.045,
        phase: rand(i, 42) * Math.PI * 2,
      });
    }
    return { group, parts };
  }
  /**
   * Applies a weather to the scene. Cheap and idempotent — called on every
   * board rebuild. With `reduced`, particles are placed at one fixed phase and
   * never move (update() then reports inactive).
   */
  set(kind: Weather, background: string, reduced: boolean) {
    const changed = !this.initialized || kind !== this.kind;
    this.kind = kind;
    this.reduced = reduced;
    this.fogKey = skyTint(background, "fog");
    if (!this.initialized || reduced || kind === "off") {
      for (const key of Object.keys(this.weights) as Weather[])
        this.weights[key] = key === kind ? 1 : 0;
      this.transitioning = false;
    } else if (changed) {
      // Capture the currently displayed blend, including an interrupted change.
      this.from = { ...this.weights };
      this.transitionStart = performance.now();
      this.transitioning = true;
    }
    this.initialized = true;
    this.applyMood();
    if (reduced) {
      this.paintRain(STATIC_PHASE);
      this.paintSnow(STATIC_PHASE);
      this.paintClouds(STATIC_PHASE);
      this.paintFog(STATIC_PHASE);
    }
  }
  private applyMood() {
    const w = this.weights;
    this.rain.visible = w.rain > 0;
    this.snow.visible = w.snow > 0;
    this.puffs.visible = w.fog > 0;
    const cloudAlpha = w.cloudy * 0.78 + w.rain * 0.78 + w.snow * 0.4;
    this.clouds.visible = cloudAlpha > 0;
    this.lineMaterial.opacity = 0.38 * w.rain;
    this.pointsMaterial.opacity = 0.95 * w.snow;
    this.clouds.children.forEach((cloud) => {
      const material = (cloud as T.Sprite).material;
      material.color
        .set("#ffffff")
        .lerp(
          new T.Color("#8196a8"),
          cloudAlpha ? (w.rain * 0.78) / cloudAlpha : 0,
        );
      material.opacity = cloudAlpha;
    });
    let hemi = 0,
      sun = 0,
      exposure = 0;
    for (const key of Object.keys(w) as Weather[]) {
      hemi += LIGHTS[key].hemi * w[key];
      sun += LIGHTS[key].sun * w[key];
      exposure += LIGHTS[key].exposure * w[key];
    }
    this.hemi.intensity = this.base.hemi * hemi;
    this.sun.intensity = this.base.sun * sun;
    this.renderer.toneMappingExposure = this.base.exposure * exposure;
    if (w.fog > 0) {
      // Scaling the linear fog range scales its visible density continuously.
      const fog =
        this.scene.fog instanceof T.Fog
          ? this.scene.fog
          : new T.Fog(this.fogKey, 12, 34);
      fog.color.set(this.fogKey);
      fog.far = 12 + 22 / w.fog;
      this.scene.fog = fog;
      this.puffs.children.forEach((puff) => {
        (puff as T.Sprite).material.color.set(
          mixHex(this.fogKey, "#ffffff", 0.6),
        );
      });
    } else this.scene.fog = null;
  }
  /** Keep drawing until the outgoing weather has completely faded away. */
  update(time: number): boolean {
    if (this.reduced) return false;
    if (this.transitioning) {
      const progress = T.MathUtils.clamp(
        (time - this.transitionStart) / 3000,
        0,
        1,
      );
      const eased = progress * progress * (3 - 2 * progress);
      for (const key of Object.keys(this.weights) as Weather[]) {
        this.weights[key] = T.MathUtils.lerp(
          this.from[key],
          key === this.kind ? 1 : 0,
          eased,
        );
      }
      this.transitioning = progress < 1;
      this.applyMood();
    }
    if (this.clouds.visible) this.paintClouds(time);
    if (this.puffs.visible) this.paintFog(time);
    if (this.rain.visible) this.paintRain(time);
    if (this.snow.visible) this.paintSnow(time);
    return (
      this.transitioning ||
      this.clouds.visible ||
      this.puffs.visible ||
      this.rain.visible ||
      this.snow.visible
    );
  }
  /** Keep full cloud silhouettes inside the current canvas framing. */
  fitClouds(camera: T.OrthographicCamera) {
    if (!this.clouds.visible) return;
    if (this.reduced) this.paintClouds(STATIC_PHASE);
    camera.updateMatrixWorld();
    // Billboards extend beyond their centers. Fit their full rectangle in
    // camera space so the canvas cannot slice off a drifting cloud crown.
    const position = new T.Vector3();
    this.clouds.children.forEach((cloud) => {
      position.copy(cloud.position).applyMatrix4(camera.matrixWorldInverse);
      const halfWidth = cloud.scale.x / 2 + 0.12;
      const halfHeight = cloud.scale.y / 2 + 0.12;
      position.x = T.MathUtils.clamp(
        position.x,
        camera.left + halfWidth,
        camera.right - halfWidth,
      );
      position.y = T.MathUtils.clamp(
        position.y,
        camera.bottom + halfHeight,
        camera.top - halfHeight,
      );
      cloud.position.copy(position.applyMatrix4(camera.matrixWorld));
    });
  }
  /** Keeps snow flakes the same visual size when the pixel ratio changes. */
  resize() {
    this.pointsMaterial.size = 4.2 * this.renderer.getPixelRatio();
  }
  dispose() {
    this.scene.fog = null;
    this.hemi.intensity = this.base.hemi;
    this.sun.intensity = this.base.sun;
    this.renderer.toneMappingExposure = this.base.exposure;
    this.scene.remove(this.group);
    this.lineMaterial.dispose();
    this.pointsMaterial.dispose();
    this.atmosphereMaterials.forEach((material) => material.dispose());
    this.atmosphereTextures.forEach((texture) => texture.dispose());
    this.snowTexture.dispose();
    // Geometries are kit-owned and disposed with the SceneView context.
  }
  private paintRain(time: number) {
    const attribute = this.rain.geometry.getAttribute(
      "position",
    ) as T.BufferAttribute;
    const positions = attribute.array as Float32Array;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const speed = WeatherSystem.fall(i, 2, 6.2, 1.5),
        x0 = rand(i, 3) * SPAN - SPAN / 2,
        z0 = rand(i, 4) * SPAN - SPAN / 2;
      const y = TOP - (((time / 1000) * speed + rand(i, 1) * FALL) % FALL);
      const x = x0 + (TOP - y) * 0.1; // wind shear slants the whole field
      positions.set([x, y, z0, x + 0.06, y + 0.42, z0 + 0.03], i * 6);
    }
    attribute.needsUpdate = true;
  }
  private paintSnow(time: number) {
    const attribute = this.snow.geometry.getAttribute(
      "position",
    ) as T.BufferAttribute;
    const positions = attribute.array as Float32Array;
    for (let i = 0; i < SNOW_COUNT; i++) {
      const speed = WeatherSystem.fall(i, 2, 0.55, 0.4),
        x0 = rand(i, 3) * SPAN - SPAN / 2,
        z0 = rand(i, 4) * SPAN - SPAN / 2;
      const y = TOP - (((time / 1000) * speed + rand(i, 1) * FALL) % FALL);
      // Per-flake sway frequency and phase so neighbors never wiggle in step.
      const sway =
        (time / 1000) * (0.5 + rand(i, 5) * 0.4) + rand(i, 6) * Math.PI * 2;
      positions[i * 3] = x0 + Math.sin(sway) * 0.18;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z0 + Math.cos(sway * 0.83 + 1.3) * 0.14;
    }
    attribute.needsUpdate = true;
  }
  /** Bounded drift keeps clouds in view without a visible wraparound jump. */
  private paintClouds(time: number) {
    const seconds = time / 1000;
    this.clouds.children.forEach((cloud, i) => {
      const part = this.cloudParts[i];
      cloud.position.set(
        part.x0 + Math.sin(seconds * part.speed + part.phase) * 1.2,
        part.y0 + Math.sin(seconds * 0.25 + part.phase) * 0.12,
        part.z0,
      );
    });
  }
  /** The fog band slowly circulates around the island and breathes a little. */
  private paintFog(time: number) {
    const seconds = time / 1000;
    this.puffs.children.forEach((puff, i) => {
      const angle = (i / this.puffs.children.length) * Math.PI * 2;
      puff.position.x =
        Math.cos(angle) * 3.8 + Math.sin(seconds * 0.07 + i) * 0.7;
      puff.position.y =
        0.25 + rand(i, 62) * 0.65 + Math.sin(seconds * 0.12 + i) * 0.12;
      (puff as T.Sprite).material.opacity =
        (0.17 + Math.sin(seconds * 0.1 + i) * 0.035) * this.weights.fog;
    });
  }
}
