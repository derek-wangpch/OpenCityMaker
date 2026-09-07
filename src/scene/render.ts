import * as T from "three";
import { tileAccent, showTileLabel } from "../game/tiers";
import { ModelKit, createBuilding } from "./models";
import type { Building, CityPack } from "../cities/types";
import type { Movement } from "../game/engine";
import { WeatherSystem } from "./weather";
import type { Weather } from "../game/weather";
import type { ResolvedTheme } from "../theme";
import {
  BOARD_CAMERA,
  ORIGINAL_CAMERA_DISTANCE,
  boardCameraPosition,
  boardFieldOfView,
  swipeDirection,
} from "../game/boardRotation";
export type SceneMode = "board" | "model" | "portrait";
/** Framing at the viewing target: [width, minimum height] in world units. */
const FRUSTUM: Record<SceneMode, [number, number]> = {
  board: [11.7, 9.9],
  model: [3.8, 3.8],
  portrait: [3, 3.9],
};
export const SCENE_THEME = {
  light: {
    hemiSky: "#fff7e6",
    hemiGround: "#789484",
    hemi: 1.8,
    sunColor: "#fff1d7",
    sun: 2.6,
    exposure: 1.05,
    shadow: 0.13,
    boardBase: "#9caa92",
    boardRim: "#d6d8c4",
    boardTile: "#d4dcc6",
    modelTile: "#c3c5ad",
    labelBackground: "#faf5e8",
    labelText: "#375447",
  },
  dark: {
    hemiSky: "#8fa8bf",
    hemiGround: "#182421",
    hemi: 1.5,
    sunColor: "#f2bd86",
    sun: 1.68,
    exposure: 0.96,
    shadow: 0.2,
    boardBase: "#34433d",
    boardRim: "#637269",
    boardTile: "#53635a",
    modelTile: "#4b5a52",
    labelBackground: "#25312d",
    labelText: "#eef0df",
  },
} as const;
export class SceneView {
  renderer: T.WebGLRenderer;
  scene = new T.Scene();
  camera: T.OrthographicCamera | T.PerspectiveCamera;
  kit = new ModelKit();
  root = new T.Group();
  observer?: ResizeObserver;
  private frame = 0;
  private alive = true;
  private animation?: (time: number) => boolean;
  private textures = new Map<number, T.SpriteMaterial>();
  private content: T.Group | null = null;
  private raycaster = new T.Raycaster();
  private boardPlane = new T.Plane(new T.Vector3(0, 1, 0), 0);
  private viewHeight = FRUSTUM.board[1];
  private shadowMaterial = new T.ShadowMaterial({ opacity: 0.13 });
  private weather: WeatherSystem | null;
  private lastWeatherDraw = 0;
  private rotationStep = 0;
  private hemi = new T.HemisphereLight("#fff7e6", "#789484", 1.8);
  private sun = new T.DirectionalLight("#fff1d7", 2.6);
  private theme: ResolvedTheme = "light";
  private visibility = () => {
    if (document.hidden) cancelAnimationFrame(this.frame);
    else this.draw();
  };
  constructor(
    public canvas: HTMLCanvasElement,
    public mode: SceneMode,
    transparent = true,
    theme: ResolvedTheme = "light",
    rotationStep = 0,
  ) {
    this.camera =
      mode === "board" ? new T.PerspectiveCamera() : new T.OrthographicCamera();
    this.renderer = new T.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: transparent,
      preserveDrawingBuffer: mode !== "board",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.setClearColor("#e6ecdf", transparent ? 0 : 1);
    this.scene.add(this.hemi);
    this.sun.position.set(-3, 9, 5);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sun.shadow.camera, {
      left: -7,
      right: 7,
      top: 7,
      bottom: -7,
      near: 0.1,
      far: 30,
    });
    this.sun.shadow.bias = -0.001;
    this.sun.shadow.normalBias = 0.025;
    this.scene.add(this.sun);
    this.scene.add(this.root);
    // Only the playable board gets weather; model viewers and thumbnails stay clean.
    this.weather =
      mode === "board"
        ? new WeatherSystem(
            this.scene,
            this.kit,
            this.hemi,
            this.sun,
            this.renderer,
            BOARD_CAMERA.distance - ORIGINAL_CAMERA_DISTANCE,
          )
        : null;
    this.setTheme(theme);
    if (mode === "portrait") {
      // Nearly head-on elevation with a hint of roof, so a row of portraits
      // reads as a skyline standing on one ground line.
      this.camera.position.set(1.6, 3.6, 12);
      this.camera.lookAt(0, 1.3, 0);
    } else if (mode === "board") {
      this.rotationStep = rotationStep;
      this.applyBoardCamera();
    } else {
      this.camera.position.set(9, 11, 12);
      this.camera.lookAt(0, 0.85, 0);
    }
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    document.addEventListener("visibilitychange", this.visibility);
    this.resize();
  }
  private applyBoardCamera() {
    const position = boardCameraPosition(this.rotationStep);
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(0, BOARD_CAMERA.targetY, 0);
    this.camera.updateMatrixWorld();
  }
  setBoardRotation(step: number) {
    if (this.mode !== "board" || this.rotationStep === step) return;
    this.rotationStep = step;
    this.applyBoardCamera();
    this.root.traverse((object) => {
      if (object instanceof T.Sprite) this.positionLabel(object);
    });
    this.draw();
  }
  private positionLabel(sprite: T.Sprite) {
    // Keep the badge on the near edge of its own plot, including from behind.
    // Rotate its original offset by precisely the same orbit as the camera.
    const angle = (this.rotationStep * Math.PI) / 4;
    sprite.position.set(0.78 * Math.sin(angle), 0.08, 0.78 * Math.cos(angle));
  }
  setTheme(theme: ResolvedTheme) {
    if (this.theme === theme) return;
    this.disposeLabels();
    this.theme = theme;
    const palette = SCENE_THEME[theme];
    this.hemi.color.set(palette.hemiSky);
    this.hemi.groundColor.set(palette.hemiGround);
    this.hemi.intensity = palette.hemi;
    this.sun.color.set(palette.sunColor);
    this.sun.intensity = palette.sun;
    this.renderer.toneMappingExposure = palette.exposure;
    this.shadowMaterial.opacity = palette.shadow;
    this.weather?.setBase(
      { hemi: palette.hemi, sun: palette.sun, exposure: palette.exposure },
      theme,
    );
  }
  private disposeLabels() {
    this.textures.forEach((material) => {
      material.map?.dispose();
      material.dispose();
    });
    this.textures.clear();
  }
  resize() {
    const w = this.canvas.clientWidth || this.canvas.width || 256,
      h = this.canvas.clientHeight || this.canvas.height || 256;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    const [width, minHeight] = FRUSTUM[this.mode];
    const height = Math.max(minHeight, width / aspect);
    this.viewHeight = height;
    if (this.camera instanceof T.PerspectiveCamera) {
      this.camera.aspect = aspect;
      this.camera.fov = boardFieldOfView(height);
    } else {
      this.camera.left = (-height * aspect) / 2;
      this.camera.right = (height * aspect) / 2;
      this.camera.top = height / 2;
      this.camera.bottom = -height / 2;
    }
    this.camera.near = 0.1;
    this.camera.far = this.mode === "board" ? 200 : 100;
    this.camera.updateProjectionMatrix();
    this.root.traverse((object) => {
      if (object instanceof T.Sprite) this.sizeLabel(object);
    });
    this.weather?.resize();
    this.draw();
  }
  private draw = () => {
    cancelAnimationFrame(this.frame);
    if (!this.alive || document.hidden) return;
    const time = performance.now();
    const continuing = this.animation?.(time) ?? false;
    const weather = this.weather?.update(time) ?? false;
    // Weather-only frames are throttled: a gentle drift does not need 60 fps,
    // while an in-flight move animation keeps every frame.
    if (!continuing && weather && time - this.lastWeatherDraw < 33) {
      this.frame = requestAnimationFrame(this.draw);
      return;
    }
    if (continuing || weather) this.lastWeatherDraw = time;
    this.weather?.fitClouds(this.camera);
    this.renderer.render(this.scene, this.camera);
    if (continuing || weather) this.frame = requestAnimationFrame(this.draw);
  };
  private label(value: number) {
    if (!this.textures.has(value)) {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 56;
      const ctx = canvas.getContext("2d")!;
      const palette = SCENE_THEME[this.theme];
      ctx.fillStyle = tileAccent(value) ?? palette.labelBackground;
      ctx.beginPath();
      ctx.roundRect(0, 0, 128, 56, 15);
      ctx.fill();
      ctx.fillStyle = tileAccent(value) ? "#182b2c" : palette.labelText;
      ctx.font = `bold ${Math.min(40, 180 / String(value).length)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(value), 64, 29);
      const texture = new T.CanvasTexture(canvas);
      texture.colorSpace = T.SRGBColorSpace;
      this.textures.set(
        value,
        new T.SpriteMaterial({
          map: texture,
          depthTest: false,
          sizeAttenuation: false,
        }),
      );
    }
    const sprite = new T.Sprite(this.textures.get(value)!);
    this.positionLabel(sprite);
    this.sizeLabel(sprite);
    sprite.renderOrder = 4;
    return sprite;
  }
  private sizeLabel(sprite: T.Sprite) {
    const referenceWidth = Math.max(
      0.58,
      (this.viewHeight / (this.canvas.clientHeight || 400)) * 30,
    );
    // Keep number badges readable at the same pixel size on near and far rows.
    const width =
      referenceWidth /
      (this.camera instanceof T.PerspectiveCamera ? BOARD_CAMERA.distance : 1);
    sprite.scale.set(width, (width * 56) / 128, 1);
  }
  private plot(city: CityPack, value: number, index: number, labels = true) {
    const g = createBuilding(this.kit, city, value);
    g.position.set(
      ((index % 4) - 1.5) * 1.88,
      0.025,
      (Math.floor(index / 4) - 1.5) * 1.88,
    );
    g.userData.index = index;
    if (showTileLabel(value, labels)) g.add(this.label(value));
    return g;
  }
  board(
    city: CityPack,
    board: number[],
    events: Movement[] = [],
    reduced = false,
    labels = true,
    weather: Weather = "clear",
    theme: ResolvedTheme = "light",
  ) {
    this.setTheme(theme);
    const palette = SCENE_THEME[theme];
    this.root.clear();
    this.animation = undefined;
    this.weather?.set(weather, city.palette.background, reduced, theme);
    // Match both layers so an aligned view has one straight outer silhouette.
    const boardSize = 7.98;
    this.kit.box(
      this.root,
      boardSize,
      0.22,
      boardSize,
      palette.boardBase,
      0,
      -0.29,
    );
    this.kit.box(
      this.root,
      boardSize,
      0.09,
      boardSize,
      palette.boardRim,
      0,
      -0.13,
    );
    for (let i = 0; i < 16; i++)
      this.kit.box(
        this.root,
        1.76,
        0.14,
        1.76,
        palette.boardTile,
        ((i % 4) - 1.5) * 1.88,
        -0.065,
        (Math.floor(i / 4) - 1.5) * 1.88,
      );
    // Ground plane receives the island's soft cast shadow.
    const ground = new T.Mesh(
      this.kit.geometry("shadow-plane", () => new T.PlaneGeometry(200, 200)),
      this.shadowMaterial,
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.64;
    ground.receiveShadow = true;
    this.root.add(ground);
    const content = new T.Group();
    this.content = content;
    this.root.add(content);
    const settle = () => {
      content.clear();
      board.forEach((v, i) => {
        if (v) content.add(this.plot(city, v, i, labels));
      });
    };
    if (!events.length || reduced) {
      settle();
      this.draw();
      return;
    }
    const tiles = events.map((event) => {
      const group = this.plot(city, event.value, event.from, labels);
      content.add(group);
      return { event, group, start: group.position.clone() };
    });
    const destinations = new Set(events.map((e) => e.to));
    const merged = new Set(events.filter((e) => e.merged).map((e) => e.to));
    const start = performance.now();
    let settled = false;
    this.animation = (time) => {
      const elapsed = time - start;
      const t = Math.min(1, elapsed / 150),
        ease = 1 - (1 - t) ** 3;
      if (t < 1)
        for (const { event, group, start: position } of tiles) {
          const target = new T.Vector3(
            ((event.to % 4) - 1.5) * 1.88,
            0.025,
            (Math.floor(event.to / 4) - 1.5) * 1.88,
          );
          group.position.lerpVectors(position, target, ease);
        }
      else {
        if (!settled) {
          settle();
          settled = true;
        }
        const pop =
          Math.sin(Math.min(1, (elapsed - 150) / 160) * Math.PI) * 0.1;
        content.children.forEach((child) =>
          child.scale.setScalar(
            merged.has(child.userData.index) ||
              !destinations.has(child.userData.index)
              ? 1 + pop
              : 1,
          ),
        );
      }
      if (elapsed >= 310) {
        content.children.forEach((child) => child.scale.setScalar(1));
        this.animation = undefined;
        return false;
      }
      return true;
    };
    this.draw();
  }
  /**
   * Board index under a click, or null for a miss. Only the buildings are
   * tested, so a tall model answers wherever it is drawn rather than where its
   * tile sits, and the empty ground stays untouchable.
   */
  pick(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect();
    if (!this.content || !rect.width || !rect.height) return null;
    this.raycaster.setFromCamera(
      new T.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      ),
      this.camera,
    );
    const hit = this.raycaster.intersectObjects(this.content.children, true)[0];
    for (let o = hit?.object as T.Object3D | null; o; o = o.parent)
      if (typeof o.userData.index === "number") return o.userData.index;
    return null;
  }
  /** Use the grid axes near the finger, including at the far side of the board. */
  swipe(fromX: number, fromY: number, toX: number, toY: number) {
    const rect = this.canvas.getBoundingClientRect();
    let origin;
    if (rect.width && rect.height) {
      this.raycaster.setFromCamera(
        new T.Vector2(
          ((fromX - rect.left) / rect.width) * 2 - 1,
          -((fromY - rect.top) / rect.height) * 2 + 1,
        ),
        this.camera,
      );
      const point = this.raycaster.ray.intersectPlane(
        this.boardPlane,
        new T.Vector3(),
      );
      if (point)
        origin = {
          x: T.MathUtils.clamp(point.x, -3.99, 3.99),
          z: T.MathUtils.clamp(point.z, -3.99, 3.99),
        };
    }
    return swipeDirection(toX - fromX, toY - fromY, this.rotationStep, origin);
  }
  model(
    city: CityPack,
    value: number,
    rotation = 0,
    theme: ResolvedTheme = this.theme,
  ) {
    this.setTheme(theme);
    this.root.clear();
    this.content = null;
    this.animation = undefined;
    const portrait = this.mode === "portrait";
    const model = createBuilding(this.kit, city, value, !portrait);
    model.rotation.y = rotation;
    this.root.add(model);
    if (!portrait)
      this.kit.box(
        this.root,
        1.68,
        0.12,
        1.68,
        SCENE_THEME[theme].modelTile,
        0,
        -0.135,
      );
    this.draw();
  }
  rotate(angle: number) {
    if (this.root.children[0]) this.root.children[0].rotation.y = angle;
    this.draw();
  }
  dispose() {
    this.alive = false;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    document.removeEventListener("visibilitychange", this.visibility);
    this.weather?.dispose();
    this.kit.dispose();
    this.disposeLabels();
    this.shadowMaterial.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
const thumbnails = new Map<string, string>();
/** Preview style: `model` sits on a landscaped tile, `portrait` is the bare building. */
export type PreviewStyle = "model" | "portrait";
export const PREVIEW_SIZE: Record<PreviewStyle, [number, number]> = {
  model: [280, 260],
  portrait: [200, 260],
};
/** Cities share the model catalog's shape but not its colors, so the city owns the key. */
export const thumbnailKey = (
  cityId: string,
  model: string,
  style: PreviewStyle = "model",
  theme: ResolvedTheme = "light",
) =>
  `${theme}:` + (style === "model" ? "" : style + ":") + cityId + ":" + model;
function snapshot(): Record<string, string> {
  const result: Record<string, string> = {};
  thumbnails.forEach((url, key) => (result[key] = url));
  return result;
}
export interface PreviewOptions {
  /** Which of a city's buildings to render. Defaults to all of them. */
  select?: (city: CityPack) => Building[];
  style?: PreviewStyle;
  theme?: ResolvedTheme;
}
const everyBuilding = (city: CityPack) => city.buildings;
/**
 * Renders the missing previews of several cities through one WebGL context.
 * Creating the context (and its shadow map) dwarfs a single model draw, so
 * callers batch what they need together and the context is released after.
 */
function renderCities(
  packs: CityPack[],
  { select = everyBuilding, style = "model", theme = "light" }: PreviewOptions,
): boolean {
  const jobs = packs
    .map((city) => ({
      city,
      missing: select(city).filter(
        (b) => !thumbnails.has(thumbnailKey(city.id, b.model, style, theme)),
      ),
    }))
    .filter((job) => job.missing.length);
  if (!jobs.length) return false;
  const [width, height] = PREVIEW_SIZE[style];
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const view = new SceneView(canvas, style, true, theme);
  view.renderer.setPixelRatio(1);
  view.renderer.setSize(width, height, false);
  try {
    for (const { city, missing } of jobs) {
      for (const building of missing) {
        view.model(city, building.value, 0, theme);
        // Static previews must also work when the page initially loads in a background tab.
        view.renderer.render(view.scene, view.camera);
        thumbnails.set(
          thumbnailKey(city.id, building.model, style, theme),
          canvas.toDataURL("image/png"),
        );
      }
    }
  } finally {
    view.dispose();
  }
  return true;
}
export function getThumbnails(
  packs: CityPack[],
  options: PreviewOptions = {},
): Record<string, string> {
  renderCities(packs, options);
  return snapshot();
}
/**
 * Backfills the remaining cities `perSlice` at a time during idle periods.
 * Each preview costs a shadowed WebGL render plus a synchronous PNG encode, so
 * rendering every city on mount would stall the main thread for the whole
 * catalog before first play. Small selections (one landmark per city) can
 * afford a larger slice.
 */
export function scheduleThumbnails(
  packs: CityPack[],
  onCity: (thumbnails: Record<string, string>) => void,
  { perSlice = 1, ...options }: PreviewOptions & { perSlice?: number } = {},
): () => void {
  const idle =
    window.requestIdleCallback ??
    ((fn: () => void) => window.setTimeout(fn, 0) as unknown as number);
  const cancel =
    window.cancelIdleCallback ?? ((id: number) => window.clearTimeout(id));
  let index = 0;
  let handle = 0;
  let stopped = false;
  const step = () => {
    if (stopped) return;
    while (index < packs.length) {
      const slice = packs.slice(index, index + perSlice);
      index += slice.length;
      let drawn = false;
      try {
        drawn = renderCities(slice, options);
      } catch {
        /* Board displays a localized WebGL fallback. */
      }
      if (drawn) {
        onCity(snapshot());
        break;
      }
    }
    if (index < packs.length) handle = idle(step);
  };
  handle = idle(step);
  return () => {
    stopped = true;
    cancel(handle);
  };
}
