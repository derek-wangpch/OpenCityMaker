import { afterEach, expect, it, vi } from "vitest";
import * as T from "three";
import { ModelKit } from "../src/scene/kit";
import { WeatherSystem } from "../src/scene/weather";
import {
  BOARD_CAMERA,
  ORIGINAL_CAMERA_DISTANCE,
  boardCameraPosition,
  boardFieldOfView,
} from "../src/game/boardRotation";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it.each([0, BOARD_CAMERA.distance - ORIGINAL_CAMERA_DISTANCE])(
  "restores lighting, fits clouds and preserves fog depth with camera offset %s",
  (fogDistanceOffset) => {
    vi.spyOn(performance, "now").mockReturnValue(0);
    const gradient = { addColorStop() {} };
    vi.stubGlobal("document", {
      createElement: () => ({
        getContext: () => ({
          createRadialGradient: () => gradient,
          createLinearGradient: () => gradient,
          fillRect() {},
        }),
      }),
    });
    const scene = new T.Scene();
    const kit = new ModelKit();
    const hemi = new T.HemisphereLight(0xffffff, 0xffffff, 1.8);
    const sun = new T.DirectionalLight(0xffffff, 2.6);
    const renderer = {
      toneMappingExposure: 1.05,
      getPixelRatio: () => 1,
    } as T.WebGLRenderer;
    const weather = new WeatherSystem(
      scene,
      kit,
      hemi,
      sun,
      renderer,
      fogDistanceOffset,
    );
    weather.set("fog", "#e6ecdf", false);
    expect(scene.fog).toBeInstanceOf(T.Fog);
    const fog = scene.fog as T.Fog;
    expect(fog.near).toBeLessThan(14 + fogDistanceOffset);
    expect(fog.far).toBeGreaterThan(24 + fogDistanceOffset);
    const targetDepth = ORIGINAL_CAMERA_DISTANCE + fogDistanceOffset;
    expect((targetDepth - fog.near) / (fog.far - fog.near)).toBeCloseTo(
      (ORIGINAL_CAMERA_DISTANCE - 12) / 22,
    );
    expect(weather.update(1200)).toBe(true);

    weather.set("snow", "#e6ecdf", true);
    const positions = () => {
      const result: number[][] = [];
      weather.group.traverse((object) =>
        result.push(object.position.toArray()),
      );
      return result;
    };
    const pose = positions();
    expect(weather.update(9000)).toBe(false);
    expect(positions()).toEqual(pose);

    // Cloud sprite edges, not just their centers, must fit the board viewport.
    const camera = fogDistanceOffset
      ? new T.PerspectiveCamera(boardFieldOfView(9.9), 11.7 / 9.9, 0.1, 200)
      : new T.OrthographicCamera(-5.85, 5.85, 4.95, -4.95, 0.1, 100);
    camera.position.set(9, 11, 12);
    camera.lookAt(0, 0.4, 0);
    weather.set("cloudy", "#e6ecdf", false);
    for (let step = 0; step < (fogDistanceOffset ? 8 : 1); step++) {
      if (fogDistanceOffset) {
        const position = boardCameraPosition(step);
        camera.position.set(position.x, position.y, position.z);
        camera.lookAt(0, 0.4, 0);
      }
      for (const time of [0, 1200, 45000, 120000]) {
        weather.update(time);
        weather.fitClouds(camera);
        weather.group.traverse((object) => {
          if (!(object instanceof T.Sprite) || !object.parent?.visible) return;
          const p = object.position
            .clone()
            .applyMatrix4(camera.matrixWorldInverse);
          for (const x of [-1, 1])
            for (const y of [-1, 1]) {
              const corner = p
                .clone()
                .add(
                  new T.Vector3(
                    (x * object.scale.x) / 2,
                    (y * object.scale.y) / 2,
                    0,
                  ),
                )
                .applyMatrix4(camera.projectionMatrix);
              expect(Math.abs(corner.x)).toBeLessThan(1);
              expect(Math.abs(corner.y)).toBeLessThan(1);
            }
        });
      }
    }

    weather.set("clear", "#e6ecdf", false);
    const previousSun = sun.intensity;
    expect(weather.update(0)).toBe(true);
    expect(sun.intensity).toBe(previousSun);
    expect(weather.update(1500)).toBe(true);
    expect(sun.intensity).toBeGreaterThan(previousSun);
    expect(sun.intensity).toBeLessThan(2.6);
    // Board rebuilds must not restart a transition already in progress.
    weather.set("clear", "#e6ecdf", false);
    expect(weather.update(3000)).toBe(false);
    expect(scene.fog).toBeNull();
    expect(weather.group.children.every((child) => !child.visible)).toBe(true);
    expect(weather.update(10000)).toBe(false);
    expect(hemi.intensity).toBe(1.8);
    expect(sun.intensity).toBe(2.6);
    expect(renderer.toneMappingExposure).toBe(1.05);
    weather.set("fog", "#e6ecdf", false);
    weather.update(1500);
    const partialFog = (scene.fog as T.Fog).far;
    expect(partialFog).toBeGreaterThan(34 + fogDistanceOffset);
    vi.mocked(performance.now).mockReturnValue(1500);
    weather.set("rain", "#e6ecdf", false);
    weather.update(1500);
    expect((scene.fog as T.Fog).far).toBe(partialFog);
    weather.update(4500);
    expect(scene.fog).toBeNull();
    weather.set("off", "#e6ecdf", false);
    expect(weather.update(15000)).toBe(false);
    expect(scene.fog).toBeNull();
    expect(weather.group.children.every((child) => !child.visible)).toBe(true);
    weather.dispose();
    expect(scene.children).not.toContain(weather.group);
    kit.dispose();
  },
);

it("composes dark moonlight with weather instead of replacing its base", () => {
  vi.spyOn(performance, "now").mockReturnValue(0);
  const gradient = { addColorStop() {} };
  vi.stubGlobal("document", {
    createElement: () => ({
      getContext: () => ({
        createRadialGradient: () => gradient,
        createLinearGradient: () => gradient,
        fillRect() {},
      }),
    }),
  });
  const scene = new T.Scene();
  const kit = new ModelKit();
  const hemi = new T.HemisphereLight(0xffffff, 0xffffff, 1.8);
  const sun = new T.DirectionalLight(0xffffff, 2.6);
  const renderer = {
    toneMappingExposure: 1.05,
    getPixelRatio: () => 1,
  } as T.WebGLRenderer;
  const weather = new WeatherSystem(scene, kit, hemi, sun, renderer);
  weather.setBase({ hemi: 1.5, sun: 1.68, exposure: 0.96 }, "dark");
  weather.set("rain", "#e6ecdf", true, "dark");
  expect(hemi.intensity).toBeCloseTo(1.5 * 0.85);
  expect(sun.intensity).toBeCloseTo(1.68 * 0.38);
  expect(renderer.toneMappingExposure).toBeCloseTo(0.96 * 0.96);

  weather.set("fog", "#e6ecdf", true, "dark");
  expect(scene.fog).toBeInstanceOf(T.Fog);
  expect((scene.fog as T.Fog).color.getHexString()).not.toBe("e3e8de");
  weather.dispose();
  expect(hemi.intensity).toBe(1.5);
  expect(sun.intensity).toBe(1.68);
  expect(renderer.toneMappingExposure).toBe(0.96);
  kit.dispose();
});
