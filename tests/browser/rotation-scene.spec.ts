import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

test("eight camera views keep scene objects, plot labels and building picking intact", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/rotation-preview.html");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  const result = await page.evaluate(async () => {
    const modulePath = "/node_modules/three/build/three.module.js";
    const { Vector3, Box3 } = await import(modulePath);
    const { view } = (window as any).rotationReview;
    if (!view.camera.isPerspectiveCamera)
      throw new Error("Board must use option C perspective");
    const children = view.root.children.map((o: any) => o.uuid);
    const content = view.root.children[view.root.children.length - 1];
    const plots = content.children.map((o: any) => o.uuid);
    const results = [];
    for (let step = 0; step < 8; step++) {
      view.setBoardRotation(step);
      const hits = content.children.map((plot: any) => {
        // Aim at the centre of the building geometry, excluding its number sprite.
        const box = new Box3();
        plot.children
          .filter((o: any) => o.isMesh)
          .forEach((o: any) => box.expandByObject(o));
        const center = box.getCenter(new Vector3()).project(view.camera);
        const rect = view.canvas.getBoundingClientRect();
        return view.pick(
          rect.x + ((center.x + 1) * rect.width) / 2,
          rect.y + ((1 - center.y) * rect.height) / 2,
        );
      });
      const labels = content.children.map((plot: any) => {
        const sprite = plot.children.find((o: any) => o.isSprite);
        return {
          x: sprite.position.x,
          z: sprite.position.z,
          // Non-attenuated UI badges retain their size on near and far rows.
          pixels:
            (sprite.scale.x *
              view.camera.projectionMatrix.elements[0] *
              view.canvas.clientWidth) /
            2,
        };
      });
      const swipes = [];
      for (let index = 0; index < 16; index++) {
        const from = new Vector3(
          ((index % 4) - 1.5) * 1.88,
          0,
          (Math.floor(index / 4) - 1.5) * 1.88,
        );
        for (const [name, x, z] of [
          ["left", -1, 0],
          ["right", 1, 0],
          ["up", 0, -1],
          ["down", 0, 1],
        ] as const) {
          const a = from.clone().project(view.camera);
          const b = from
            .clone()
            .add(new Vector3(x, 0, z))
            .project(view.camera);
          const rect = view.canvas.getBoundingClientRect();
          const toScreen = (p: any) => [
            rect.x + ((p.x + 1) * rect.width) / 2,
            rect.y + ((1 - p.y) * rect.height) / 2,
          ];
          const [ax, ay] = toScreen(a),
            [bx, by] = toScreen(b);
          swipes.push({ expected: name, actual: view.swipe(ax, ay, bx, by) });
        }
      }
      results.push({
        step,
        hits,
        labels,
        swipes,
        children: view.root.children.map((o: any) => o.uuid),
        plots: content.children.map((o: any) => o.uuid),
      });
    }
    return { results, children, plots };
  });
  for (const view of result.results) {
    expect(view.children).toEqual(result.children);
    expect(view.plots).toEqual(result.plots);
    expect(view.hits).toEqual([0, 15]);
    for (const label of view.labels) {
      expect(Math.abs(label.x)).toBeLessThanOrEqual(0.78);
      expect(Math.abs(label.z)).toBeLessThanOrEqual(0.78);
      expect(label.pixels).toBeGreaterThanOrEqual(29.9);
      expect(label.pixels).toBeLessThan(50);
    }
    for (const swipe of view.swipes) expect(swipe.actual).toBe(swipe.expected);
  }
});

test("all-city eight-angle model sheets", async ({ page }) => {
  test.skip(
    process.env.ROTATION_MODEL_REVIEW !== "1",
    "Opt-in visual review outputs",
  );
  test.setTimeout(180_000);
  await page.goto("/tests/fixtures/rotation-preview.html");
  await expect(page.locator("body")).toHaveAttribute("data-ready", "true");
  await mkdir("artifacts/screenshots/rotation/models", { recursive: true });
  // One WebGL renderer, reused for all 132 models and eight camera angles.
  const cities = await page.evaluate(() =>
    (window as any).rotationReview.cities.map((c: any) => c.id),
  );
  for (const city of cities) {
    const image = await page.evaluate(async (id) => {
      const scenePath = "/src/scene/render.ts",
        rotationPath = "/src/game/boardRotation.ts";
      const { SceneView } = await import(scenePath);
      const { BOARD_CAMERA, ORIGINAL_CAMERA_DISTANCE, boardCameraPosition } =
        await import(rotationPath);
      const state = (window as any).rotationReview;
      if (!state.modelView) {
        const canvas = document.createElement("canvas");
        canvas.width = 150;
        canvas.height = 165;
        state.modelView = new SceneView(canvas, "model");
      }
      const view = state.modelView;
      const pack = state.cities.find((c: any) => c.id === id);
      const sheet = document.createElement("canvas");
      sheet.width = 1650;
      sheet.height = 1512;
      const ctx = sheet.getContext("2d")!;
      ctx.fillStyle = "#e6ecdf";
      ctx.fillRect(0, 0, sheet.width, sheet.height);
      ctx.fillStyle = "#375447";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(
        `${pack.name.en} — default camera + 45° steps (rows 0–7)`,
        12,
        24,
      );
      for (let step = 0; step < 8; step++) {
        const camera = boardCameraPosition(step);
        // Model sheets retain the atlas's original orthographic camera distance.
        const scale = ORIGINAL_CAMERA_DISTANCE / BOARD_CAMERA.distance;
        view.camera.position.set(
          camera.x * scale,
          BOARD_CAMERA.targetY + (camera.y - BOARD_CAMERA.targetY) * scale,
          camera.z * scale,
        );
        view.camera.lookAt(0, 0.85, 0);
        for (let i = 0; i < pack.buildings.length; i++) {
          const building = pack.buildings[i];
          view.model(pack, building.value);
          ctx.drawImage(view.canvas, i * 150, 32 + step * 185, 150, 165);
          ctx.fillStyle = "#375447";
          ctx.font = "11px sans-serif";
          ctx.fillText(
            `${building.model} · ${step * 45}°`,
            i * 150 + 5,
            32 + step * 185 + 177,
          );
        }
      }
      return sheet.toDataURL("image/png");
    }, city);
    await writeFile(
      `artifacts/screenshots/rotation/models/${city}.png`,
      Buffer.from(image.split(",")[1], "base64"),
    );
  }
  await page.evaluate(() => (window as any).rotationReview.modelView.dispose());
});
