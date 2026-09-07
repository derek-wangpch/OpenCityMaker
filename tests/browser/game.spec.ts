import { move, type Direction } from "../../src/game/engine";
import { test, expect, type Page } from "@playwright/test";
import { cities } from "../../src/cities/packs";
const initial = [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const allModels = cities.length * 11;
async function seed(
  page: Page,
  board = initial,
  extras: Record<string, unknown> = {},
) {
  await page.addInitScript(
    ({ board, extras }) => {
      if (!localStorage.getItem("citymaker:v1"))
        localStorage.setItem(
          "citymaker:v1",
          JSON.stringify({
            version: 1,
            locale: "en",
            city: "beijing",
            cities: {
              beijing: {
                run: { board, score: 0, status: "playing", undo: null },
                best: 0,
                discovered: [2],
              },
            },
            ...extras,
          }),
        );
    },
    { board, extras },
  );
}
async function load(page: Page) {
  await page.goto("/");
  await expect(page.locator(".discovery-image img")).toBeVisible();
}
const saved = async (page: Page, waitForIndicator = true) => {
  if (waitForIndicator)
    await expect(page.locator(".save-dot")).not.toHaveClass(/warning/);
  return page.evaluate(
    () =>
      new Promise<any>((resolve, reject) => {
        const open = indexedDB.open("citymaker", 1);
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction("progress", "readonly");
          const request = tx.objectStore("progress").get("current");
          request.onsuccess = () => resolve(request.result);
          tx.oncomplete = () => db.close();
          request.onerror = () => reject(request.error);
        };
        open.onerror = () => reject(open.error);
      }),
  );
};
test("keyboard merge, discovery, city independence and reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await seed(page);
  await load(page);
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("score")).toHaveText("4");
  await expect(page.locator(".collection-heading")).toContainText("2");
  const after = await saved(page);
  expect(after.cities.beijing.run.board).toContain(4);
  // Undo is hidden for now: the snapshot is still recorded, but no control
  // exposes it.
  expect(after.cities.beijing.run.undo).not.toBeNull();
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toHaveCount(0);
  expect(after.cities.beijing.best).toBe(4);
  expect(after.cities.beijing.discovered).toContain(4);
  await page.getByRole("button", { name: "02 Hong Kong" }).click();
  await expect(page.locator("h1")).toContainText("Hong Kong");
  const hk = await saved(page);
  // A city absent from the stored save is created on first visit, not migrated.
  await page.getByRole("button", { name: "04 Shenzhen" }).click();
  await expect(page.locator("h1")).toContainText("Shenzhen");
  const fresh = await saved(page);
  expect(fresh.cities.shenzhen.run.score).toBe(0);
  expect(fresh.cities.shenzhen.run.board.filter(Boolean)).toHaveLength(2);
  await page.getByRole("button", { name: "03 Shanghai" }).click();
  await expect(page.locator("h1")).toContainText("Shanghai");
  await page.getByRole("button", { name: "01 Beijing" }).click();
  expect((await saved(page)).cities.beijing.run.board).toEqual(
    after.cities.beijing.run.board,
  );
  await page.reload();
  await expect(page.getByTestId("score")).toHaveText("4");
  expect((await saved(page)).cities.hongkong.run.board).toEqual(
    hk.cities.hongkong.run.board,
  );
  expect((await saved(page)).cities.shenzhen.run.board).toEqual(
    fresh.cities.shenzhen.run.board,
  );
  expect(errors).toEqual([]);
  await page.screenshot({ path: "artifacts/screenshots/ui/desktop-game.png" });
});
test("returning from the atlas tab does not replay the last move", async ({
  page,
}) => {
  // Weather off keeps the scene static, so any animation frame after the tab
  // switch can only come from a replayed slide.
  await seed(page, initial, { weather: "off" });
  await load(page);
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("score")).toHaveText("4");
  await page.waitForTimeout(600);
  await page
    .getByRole("button", { name: "Landmark atlas", exact: true })
    .click();
  await expect(page.locator(".atlas-card").first()).toBeVisible();
  await page.evaluate(() => {
    (window as any).__frames = 0;
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => {
      (window as any).__frames++;
      return raf(cb);
    };
  });
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.getByTestId("score")).toHaveText("4");
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => (window as any).__frames)).toBeLessThan(3);
});
/** Where a board cell lands on screen, following SceneView's fixed camera. */
function project(
  index: number,
  box: { x: number; y: number; width: number; height: number },
) {
  const x = ((index % 4) - 1.5) * 1.88,
    z = (Math.floor(index / 4) - 1.5) * 1.88;
  const right = 0.8 * x - 0.6 * z,
    up = -0.355 * x - 0.473 * z - 0.04;
  const aspect = box.width / box.height,
    height = Math.max(9.9, 11.7 / aspect);
  return {
    x: box.x + box.width / 2 + (right / (height * aspect)) * box.width,
    y: box.y + box.height / 2 - (up / height) * box.height,
  };
}
// Two far-apart tiles: the back-left corner and the front-right one.
const corners = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4];
test("clicking a building opens its card; ground and swipes do not", async ({
  page,
}) => {
  await seed(page, corners, { weather: "off" });
  await load(page);
  const box = (await page.locator(".board-canvas canvas").boundingBox())!;
  const dialog = page.getByRole("dialog");
  const clickCell = (index: number) => {
    const { x, y } = project(index, box);
    return page.mouse.click(x, y);
  };
  await clickCell(0);
  await expect(dialog.locator("h2")).toHaveText("Traditional house");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  // Each building answers for itself, not for whichever tile is nearest.
  await clickCell(15);
  await expect(dialog.locator("h2")).toHaveText("Hutong cluster");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  // Empty ground stays untouchable.
  await clickCell(5);
  await expect(dialog).toBeHidden();
  // A drag is still a move, not a tap.
  const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.mouse.move(centre.x, centre.y);
  await page.mouse.down();
  await page.mouse.move(centre.x - 160, centre.y + 90, { steps: 8 });
  await page.mouse.up();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status")).toContainText("Move complete");
});
test("the board mirror gives the keyboard the same cards", async ({ page }) => {
  await seed(page, corners, { weather: "off" });
  await load(page);
  const mirror = page.locator(".board-mirror");
  const width = async () => (await mirror.boundingBox())!.width;
  // Clipped to a screen-reader-only sliver until a tile takes focus.
  expect(await width()).toBeLessThan(3);
  const tile = page.getByRole("button", {
    name: "2 Traditional house · Open atlas card",
  });
  await tile.focus();
  expect(await width()).toBeGreaterThan(200);
  await page.screenshot({ path: "artifacts/screenshots/ui/board-mirror.png" });
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog").locator("h2")).toHaveText(
    "Traditional house",
  );
  await page.getByRole("button", { name: "Close" }).click();
  await expect(tile).toBeFocused();
  // Tab reaches the next building, skipping the empty ground between them.
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "4 Hutong cluster · Open atlas card" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "New city", exact: true }).focus();
  expect(await width()).toBeLessThan(3);
});
test("tapping a building on the phone board opens its card", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await seed(page, corners, { weather: "off" });
  await page.goto("/#/play");
  await expect(page.locator(".board-canvas canvas")).toBeVisible();
  const box = (await page.locator(".board-canvas canvas").boundingBox())!;
  const target = project(0, box);
  await page.touchscreen.tap(target.x, target.y);
  await expect(page.getByRole("dialog").locator("h2")).toHaveText(
    "Traditional house",
  );
  await context.close();
});
test("restart confirmation, language choices, help and atlas viewer", async ({
  page,
}) => {
  await seed(page);
  await load(page);
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("score")).toHaveText("4");
  await page.getByRole("button", { name: "New city", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Keep playing" }).click();
  await expect(page.getByTestId("score")).toHaveText("4");
  await page.getByRole("button", { name: "New city", exact: true }).click();
  await page.getByRole("button", { name: "Start fresh" }).click();
  await expect(page.getByTestId("score")).toHaveText("0");
  await page.getByRole("combobox", { name: "Language" }).selectOption("zh-CN");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("北京");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await page.screenshot({ path: "artifacts/screenshots/ui/simplified.png" });
  await page.getByRole("combobox").selectOption("zh-HK");
  await expect(
    page.getByRole("button", { name: "地標圖鑑", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "artifacts/screenshots/ui/traditional.png" });
  await page.getByRole("combobox").selectOption("en");
  await page.getByRole("button", { name: "How to play" }).first().click();
  await expect(page.getByRole("dialog")).toContainText("once per move");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Landmark atlas", exact: true })
    .click();
  await expect(page.locator(".atlas-card")).toHaveCount(11);
  await page.locator(".atlas-card").nth(6).click();
  await expect(page.getByRole("dialog")).toContainText("Temple of Heaven");
  const canvas = page.locator(".model-view canvas");
  const bounds = await canvas.boundingBox();
  await page.mouse.move(bounds!.x + 80, bounds!.y + 120);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + 180, bounds!.y + 120);
  await page.mouse.up();
  await canvas.focus();
  await page.keyboard.press("ArrowRight");
  await page.screenshot({
    path: "artifacts/screenshots/ui/landmark-viewer.png",
  });
  await page.keyboard.press("Escape");
  await expect(page.locator(".atlas-card").nth(6)).toBeFocused();
});
test("mobile start, full-screen swipe, number toggle, city list and atlas", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await seed(page);
  await page.goto("/");
  await expect(page.locator(".mobile-start")).toBeVisible();
  await page.screenshot({ path: "artifacts/screenshots/ui/mobile-start.png" });
  await page.getByRole("button", { name: "Play", exact: true }).tap();
  await expect(page).toHaveURL(/#\/play$/);
  await expect(page.locator(".mobile-game")).toBeVisible();
  // The board owns the whole viewport: nothing scrolls and the bars stay inside.
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  const box = await page.locator(".board-canvas canvas").boundingBox();
  expect(box!.height).toBeGreaterThan(400);
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box!.x + 230, y: box!.y + 300 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: box!.x + 140, y: box!.y + 240 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.getByTestId("score")).toHaveText("4");
  await page.waitForTimeout(350);
  const controls = await page.locator(".mobile-bottombar").boundingBox();
  expect(controls!.y + controls!.height).toBeLessThanOrEqual(844);
  // Tile numbers are off by default; the choice is remembered across reloads.
  const numbers = page.getByRole("button", { name: "Show numbers" });
  await expect(numbers).toHaveAttribute("aria-pressed", "false");
  await numbers.tap();
  await expect(
    page.getByRole("button", { name: "Hide numbers" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: "artifacts/screenshots/ui/mobile-game.png" });
  await page.reload();
  await expect(page.locator(".mobile-game")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Hide numbers" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("score")).toHaveText("4");
  await page.getByRole("button", { name: "Home", exact: true }).tap();
  await expect(page.locator(".mobile-start")).toBeVisible();
  expect((await saved(page)).showLabels).toBe(true);
  await page.getByRole("button", { name: "Landmark atlas", exact: true }).tap();
  await expect(page).toHaveURL(/#\/atlas$/);
  await expect(page.locator(".atlas-card")).toHaveCount(11);
  await page.screenshot({ path: "artifacts/screenshots/ui/mobile-atlas.png" });
  await page.getByRole("button", { name: "Home", exact: true }).tap();
  await expect(page.locator(".mobile-start")).toBeVisible();
  // The atlas remembers who opened it: from the board, back returns to the
  // board rather than dropping the player on the start page.
  await page.getByRole("button", { name: "Continue", exact: true }).tap();
  await expect(page.locator(".mobile-game")).toBeVisible();
  await page.getByRole("button", { name: /Landmark atlas/ }).tap();
  await expect(page).toHaveURL(/#\/atlas$/);
  await page.getByRole("button", { name: "Back to game", exact: true }).tap();
  await expect(page).toHaveURL(/#\/play$/);
  await expect(page.locator(".mobile-game")).toBeVisible();
  await page.getByRole("button", { name: "Home", exact: true }).tap();
  await expect(page.locator(".mobile-start")).toBeVisible();
  await page.getByRole("button", { name: "Choose a city", exact: true }).tap();
  await expect(page).toHaveURL(/#\/cities$/);
  await expect(
    page.getByRole("button", { name: "01 Beijing" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".city-card-art")).toHaveCount(12);
  await page.screenshot({ path: "artifacts/screenshots/ui/mobile-cities.png" });
  await page.getByRole("button", { name: "12 Rome" }).tap();
  // Picking a city lands on its start page; the board opens from there.
  await expect(page.locator(".mobile-start h1")).toContainText("Rome");
  await page.getByRole("button", { name: "Play", exact: true }).tap();
  await expect(page).toHaveURL(/#\/play$/);
  await expect(page.locator(".mobile-city-name")).toHaveText("Rome");
  await expect(page.getByTestId("score")).toHaveText("0");
  // The OS back gesture walks back through the pages.
  await page.goBack();
  await expect(page.locator(".mobile-start")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#\/cities$/);
  await expect(page.locator(".mobile-cities")).toBeVisible();
  // Widening past the phone breakpoint keeps the run and switches shells.
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(page.locator(".game-panel")).toBeVisible();
  await expect(page.getByRole("button", { name: "12 Rome" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  await context.close();
});
test("persisted Rome stays visible and rail navigation leaves the board unchanged", async ({
  page,
}) => {
  // Narrowest width that still shows the wide layout's city rail.
  await page.setViewportSize({ width: 760, height: 900 });
  await seed(page, initial, {
    city: "rome",
    cities: {
      rome: {
        run: { board: initial, score: 0, status: "playing", undo: null },
        best: 0,
        discovered: [2],
      },
    },
  });
  await load(page);
  const selected = page.getByRole("button", { name: "12 Rome" });
  await expect(selected).toHaveAttribute("aria-current", "true");
  await expect
    .poll(() =>
      selected.evaluate((el) => {
        const rail = el.closest(".city-switch")!.getBoundingClientRect();
        const chip = el.getBoundingClientRect();
        return chip.left >= rail.left && chip.right <= rail.right;
      }),
    )
    .toBe(true);
  const before = (await saved(page)).cities.rome.run;
  await selected.focus();
  for (const [key, name] of [
    ["ArrowLeft", "11 London"],
    ["Home", "01 Beijing"],
    ["End", "12 Rome"],
    ["ArrowRight", "01 Beijing"],
  ]) {
    await page.keyboard.press(key);
    await expect(page.getByRole("button", { name })).toBeFocused();
  }
  expect((await saved(page)).cities.rome.run).toEqual(before);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const controls = await page.locator(".board-bottom").boundingBox();
  expect(controls!.y + controls!.height).toBeLessThan(900);
});

test.describe("full catalog overview", () => {
  // Twelve cities exceed SwiftShader's maximum screenshot surface at native scale.
  // Keep the complete overview at 40%; city sheets are captured separately at 1x.
  test.use({ deviceScaleFactor: 0.4 });
  test("gallery exposes every model and fits at desktop and small phone", async ({
    page,
  }) => {
    await page.goto("/?gallery");
    // Previews backfill one city per idle slice, so this count fills in progressively.
    await expect(page.locator(".atlas-card img")).toHaveCount(allModels, {
      timeout: 20000,
    });
    await expect(page.locator(".gallery-city")).toHaveCount(cities.length);
    await page
      .locator(".atlas-card img")
      .evaluateAll((images) =>
        Promise.all(images.map((img) => (img as HTMLImageElement).decode())),
      );
    for (const name of ["10 Paris", "11 London", "12 Rome"])
      await expect(page.getByRole("button", { name, exact: true })).toHaveCount(
        1,
      );
    await page.screenshot({
      path: "artifacts/screenshots/ui/gallery-all.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 360, height: 740 });
    await page.screenshot({
      path: "artifacts/screenshots/ui/gallery-mobile.png",
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
});

test("crowded mixed-height board, win and terminal input", async ({ page }) => {
  await seed(
    page,
    [1024, 1024, 512, 128, 256, 64, 32, 16, 8, 4, 2, 4, 16, 32, 64, 128],
  );
  await load(page);
  await page.screenshot({ path: "artifacts/screenshots/ui/dense-desktop.png" });
  // Narrowing to a phone swaps shells without touching the run.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".mobile-start")).toBeVisible();
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.locator(".mobile-game")).toBeVisible();
  await expect(page.getByTestId("score")).toHaveText("0");
  await page.screenshot({ path: "artifacts/screenshots/ui/dense-mobile.png" });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(page.locator(".game-panel")).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".end-overlay")).toContainText("You reached 2048");
  const before = await saved(page);
  await page.keyboard.press("ArrowRight");
  expect((await saved(page)).cities.beijing.run.board).toEqual(
    before.cities.beijing.run.board,
  );
  await page.screenshot({ path: "artifacts/screenshots/ui/win.png" });
  await page.getByRole("button", { name: "Build again" }).click();
  await expect(page.locator(".end-overlay")).toHaveCount(0);
});
test("dead-board recovery and corrupt-storage recovery", async ({ page }) => {
  await seed(page, [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2]);
  await load(page);
  await expect(page.locator(".end-overlay")).toContainText("No moves left");
  await page.getByRole("button", { name: "Build again" }).click();
  await expect(page.locator(".end-overlay")).toHaveCount(0);
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open("citymaker", 1);
        open.onsuccess = () => {
          const db = open.result,
            tx = db.transaction("progress", "readwrite");
          tx.objectStore("progress").put("broken", "current");
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onabort = () => reject(tx.error);
        };
      }),
  );
  await page.reload();
  await expect(page.getByTestId("score")).toHaveText("0");
  expect(
    (await saved(page)).cities.beijing.run.board.filter(Boolean),
  ).toHaveLength(2);
});
test("reduced motion and unavailable storage/WebGL stay usable", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await seed(page);
  await load(page);
  await expect(
    page.getByRole("button", { name: "Reduce motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("score")).toHaveText("4");
  await context.close();
  const blocked = await browser.newPage();
  await blocked.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new Error("denied");
      },
    });
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("denied");
      },
    });
    HTMLCanvasElement.prototype.getContext = function () {
      return null;
    };
  });
  await blocked.goto("/");
  await expect(blocked.getByRole("alert")).toContainText("WebGL");
  await expect(blocked.locator("footer")).toContainText("Storage unavailable");
  await blocked.close();
});
test("Hong Kong dense skyline and keyboard after clicking controls at 360px", async ({
  page,
}) => {
  await seed(
    page,
    [2, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 512, 128, 16, 4, 2],
    {
      city: "hongkong",
      cities: {
        hongkong: {
          run: {
            board: [
              2, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 512, 128, 16, 4, 2,
            ],
            score: 1200,
            status: "playing",
            undo: null,
          },
          best: 1200,
          discovered: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024],
        },
      },
    },
  );
  await load(page);
  await page.screenshot({
    path: "artifacts/screenshots/ui/hongkong-desktop.png",
  });
  // The city rail scrolls within the viewport instead of widening the page.
  await page.setViewportSize({ width: 760, height: 900 });
  const railFits = await page.evaluate(() => {
    const rail = document.querySelector(".city-switch")!;
    return (
      rail.scrollWidth > rail.clientWidth && rail.clientWidth <= innerWidth
    );
  });
  expect(railFits).toBe(true);
  // The selected city stays visible in the rail without scrolling the page.
  const selected = await page.locator(".city-switch button.selected").first();
  const inside = await selected.evaluate((el: HTMLElement) => {
    const rail = el.closest(".city-switch")!.getBoundingClientRect();
    const chip = el.getBoundingClientRect();
    return chip.left >= rail.left - 1 && chip.right <= rail.right + 1;
  });
  expect(inside).toBe(true);
  // Arrow keys inside the rail move focus, never the board.
  await selected.focus();
  const before = await page.getByTestId("score").textContent();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "03 Shanghai" })).toBeFocused();
  await expect(page.getByTestId("score")).toHaveText(before!);
  await page
    .getByRole("button", { name: "Move left ↖ (A / ←)", exact: true })
    .click();
  await expect(page.getByTestId("score")).toHaveText("1,204");
  await page.waitForTimeout(350);
  // On a phone the dense skyline fills the screen and keys still move the board.
  await page.setViewportSize({ width: 360, height: 740 });
  await expect(page.locator(".mobile-start")).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".mobile-game")).toBeVisible();
  await expect(page.getByTestId("score")).toHaveText("1,204");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  const bounds = await page.locator(".mobile-bottombar").boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(740);
  await page.screenshot({
    path: "artifacts/screenshots/ui/hongkong-mobile.png",
  });
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(350);
  await page.getByRole("button", { name: "Home", exact: true }).click();
  expect((await saved(page)).cities.hongkong.run.undo).not.toBeNull();
  await page
    .getByRole("button", { name: "Landmark atlas", exact: true })
    .click();
  await page.locator(".atlas-card").last().click();
  await page.screenshot({
    path: "artifacts/screenshots/ui/icc-mobile-viewer.png",
  });
});

// Undo is hidden in the UI for now, so the terminal-undo round trip is covered
// by tests/repository.test.ts instead of here.
test("IndexedDB migration, match history and reload", async ({ page }) => {
  await seed(page, [1024, 1024, ...Array(14).fill(0)]);
  await load(page);
  const migrated = await saved(page);
  expect(migrated.cities.beijing.session.id).toBeTruthy();
  const legacy = await page.evaluate(() =>
    localStorage.getItem("citymaker:v1"),
  );
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".end-overlay")).toBeVisible();
  await saved(page);
  await page
    .getByRole("button", { name: "Match history", exact: true })
    .click();
  await expect(page.locator(".history-row")).toHaveCount(1);
  await expect(page.locator(".history-row")).toContainText("Completed");
  await page.screenshot({
    path: "artifacts/screenshots/ui/history-desktop.png",
  });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Build again" }).click();
  await saved(page);
  await page.reload();
  await load(page);
  await page.getByRole("combobox").selectOption("zh-CN");
  await saved(page);
  await page.getByRole("button", { name: "战绩历史", exact: true }).click();
  await expect(page.locator(".history-row")).toHaveCount(1);
  await expect(page.locator(".history-row")).toContainText("已通关");
  await page
    .getByRole("combobox", { name: "城市", exact: true })
    .selectOption("hongkong");
  await expect(page.locator(".history-empty")).toBeVisible();
  await page
    .getByRole("combobox", { name: "城市", exact: true })
    .selectOption("all");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "artifacts/screenshots/ui/history-mobile.png",
  });
  expect(await page.evaluate(() => localStorage.getItem("citymaker:v1"))).toBe(
    legacy,
  );
});

test("all eight added cities create independent playable runs and survive reload", async ({
  page,
}) => {
  test.setTimeout(90000);
  await seed(page);
  await load(page);
  const original = (await saved(page)).cities.beijing;
  const progress: Record<string, unknown> = {};
  const labels: Record<Direction, string> = {
    left: "Move left ↖ (A / ←)",
    up: "Move up ↗ (W / ↑)",
    down: "Move down ↙ (S / ↓)",
    right: "Move right ↘ (D / →)",
  };
  for (const [index, city] of cities.entries()) {
    if (index < 4) continue;
    await page
      .getByRole("button", {
        name: `${String(index + 1).padStart(2, "0")} ${city.name.en}`,
        exact: true,
      })
      .click();
    await expect(page.locator("h1")).toContainText(city.name.en);
    const before = (await saved(page)).cities[city.id];
    expect(before.run.board.filter(Boolean)).toHaveLength(2);
    const direction = (Object.keys(labels) as Direction[]).find(
      (d) => move(before.run, d, () => 0).changed,
    )!;
    await page
      .getByRole("button", { name: labels[direction], exact: true })
      .click();
    await expect
      .poll(async () => (await saved(page)).cities[city.id].run.undo)
      .not.toBeNull();
    progress[city.id] = (await saved(page)).cities[city.id];
  }
  await page.reload();
  await expect(page.locator("h1")).toContainText("Rome");
  const restored = await saved(page);
  for (const [id, entry] of Object.entries(progress))
    expect(restored.cities[id]).toEqual(entry);
  expect(restored.cities.beijing).toEqual(original);
});

test("weather cycles clear, cloudy, rain, snow, fog and off, persists and tints the sky", async ({
  page,
}) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await seed(page);
  await load(page);
  const weather = page.getByRole("button", { name: /^Weather · / });
  const sky = () =>
    page
      .locator(".app")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--scene").trim(),
      );
  expect(await sky()).toBe("#e6ecdf"); // Beijing's clear sky
  // One full cycle; every state is persisted to IndexedDB as it is selected.
  for (const [name, kind] of [
    ["Weather · Cloudy", "cloudy"],
    ["Weather · Rain", "rain"],
    ["Weather · Snow", "snow"],
    ["Weather · Fog", "fog"],
    ["Weather · Off", "off"],
    ["Weather · Clear", "clear"],
  ] as const) {
    await weather.click();
    await expect(page.getByRole("button", { name })).toBeVisible();
    expect((await saved(page)).weather).toBe(kind);
  }
  // Fog tints the CSS sky so the scene fog never sits behind a clear sky.
  const settle = () => page.waitForTimeout(3200); // let the weather transition finish
  await weather.click(); // cloudy
  await expect(
    page.getByRole("button", { name: "Weather · Cloudy" }),
  ).toBeVisible();
  await weather.click(); // rain
  await expect(
    page.getByRole("button", { name: "Weather · Rain" }),
  ).toBeVisible();
  expect(await sky()).toBe("#adb5b2");
  await settle();
  await page.screenshot({ path: "artifacts/screenshots/ui/weather-rain.png" });
  await weather.click(); // snow
  await settle();
  await page.screenshot({ path: "artifacts/screenshots/ui/weather-snow.png" });
  await weather.click(); // fog
  await expect(
    page.getByRole("button", { name: "Weather · Fog" }),
  ).toBeVisible();
  expect(await sky()).toBe("#e3e8de");
  await settle();
  await page.screenshot({ path: "artifacts/screenshots/ui/weather-fog.png" });
  // The choice survives a reload and speaks the selected locale.
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Weather · Fog" }),
  ).toBeVisible();
  expect((await saved(page)).weather).toBe("fog");
  await page.getByRole("combobox", { name: "Language" }).selectOption("zh-CN");
  await expect(page.getByRole("button", { name: "天气 · 雾" })).toBeVisible();
  // Gallery sheets use model contexts, which never construct weather.
  await page.goto("/?gallery");
  await expect(page.locator(".atlas-card img").first()).toBeVisible({
    timeout: 20000,
  });
  expect(errors).toEqual([]);
});
test("reduced motion parks weather on a static frame; normal rain animates", async ({
  browser,
}) => {
  const frames = async (page: Page) =>
    page.evaluate(() => (window as any).__weatherFrames());
  const track = (page: Page) =>
    page.addInitScript(() => {
      let frames = 0;
      const original = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = ((cb: FrameRequestCallback) =>
        original((t) => {
          frames++;
          return cb(t);
        })) as typeof requestAnimationFrame;
      (window as any).__weatherFrames = () => frames;
    });
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const quiet = await reduced.newPage();
  await track(quiet);
  await seed(quiet, initial, { weather: "snow" });
  await quiet.goto("/");
  await expect(
    quiet.getByRole("button", { name: "Weather · Snow" }),
  ).toBeVisible();
  await quiet.waitForTimeout(700);
  expect(await frames(quiet)).toBeLessThan(5); // one static frame, no loop
  await reduced.close();
  const context = await browser.newContext();
  const page = await context.newPage();
  await track(page);
  await seed(page, initial, { weather: "rain" });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Weather · Rain" }),
  ).toBeVisible();
  await page.waitForTimeout(700);
  expect(await frames(page)).toBeGreaterThan(8); // rain streams frames (~30 fps)
  await context.close();
});
test("weather button fits the mobile bottom bar at 360px", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await seed(page, initial, { weather: "rain" });
  await page.goto("/");
  await page.getByRole("button", { name: "Play", exact: true }).tap();
  await expect(page.locator(".mobile-game")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Weather · Rain" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/screenshots/ui/weather-mobile.png",
  });
  await context.close();
});

for (const width of [1440, 390]) {
  test(`loss leaves time to inspect the final board at ${width}px`, async ({
    page,
  }) => {
    const board = [0, 8, 16, 8, 16, 32, 64, 16, 8, 16, 32, 8, 16, 8, 16, 32];
    await page.setViewportSize({ width, height: 844 });
    await seed(page, board, { weather: "off" });
    await page.goto("/");
    if (width < 600)
      await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.getByTestId("score")).toBeVisible();
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    await page.keyboard.press("ArrowLeft");
    await expect(
      page.getByRole("table").getByRole("cell").first(),
    ).toContainText("8");
    await page.clock.runFor(500);
    await expect(page.locator(".end-overlay")).toHaveCount(0);
    await page.clock.runFor(1000);
    await expect(page.locator(".end-loss")).toContainText("the board is full");
    await page.getByRole("button", { name: "Inspect board" }).click();
    await expect(page.locator(".end-overlay")).toHaveCount(0);
    await page.clock.runFor(5000);
    await expect(page.locator(".end-overlay")).toHaveCount(0);
    await page.getByRole("button", { name: "Show result" }).click();
    await expect(page.locator(".end-loss")).toBeVisible();
    // Undo is hidden for now, so restarting is the only way out of the panel.
    await expect(
      page.getByRole("button", { name: "Undo", exact: true }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Build again" }).click();
    await expect(page.locator(".end-overlay, .end-review")).toHaveCount(0);
  });
}

test("continue a completed city across reload, city switch, and phone layout", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await seed(page, [2048, 2048, 8192, 16384, ...Array(12).fill(0)], {
    weather: "off",
    cities: {
      beijing: {
        run: {
          board: [2048, 2048, 8192, 16384, ...Array(12).fill(0)],
          score: 10000,
          status: "won",
          undo: null,
        },
        best: 10000,
        discovered: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
      },
    },
  });
  await load(page);
  const before = await saved(page);
  await page
    .getByRole("button", { name: "Keep building", exact: true })
    .click();
  await expect(page.locator(".end-overlay")).toHaveCount(0);
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTestId("score")).toHaveText("14,096");
  const after = await saved(page);
  expect(after.cities.beijing.run.board).toContain(4096);
  expect(after.cities.beijing.session.id).toBe(
    before.cities.beijing.session.id,
  );
  expect(after.cities.beijing.session.moves).toBe(1);
  expect(after.cities.beijing.run).toMatchObject({
    status: "playing",
    hasWon: true,
    continued: true,
  });
  await expect(page.locator(".collection-heading")).toContainText("11 / 11");
  await expect(page.locator(".discovery-card")).toContainText("32768");
  await page.getByRole("button", { name: "02 Hong Kong" }).click();
  await page.getByRole("button", { name: "01 Beijing" }).click();
  expect((await saved(page)).cities.beijing.run.board).toEqual(
    after.cities.beijing.run.board,
  );
  await page.reload();
  await expect(page.getByTestId("score")).toHaveText("14,096");
  await expect(page.locator(".end-overlay")).toHaveCount(0);
  const card = page.locator(".board-mirror button").filter({ hasText: "4096" });
  await card.focus();
  await card.press("Enter");
  await expect(page.locator(".viewer-meta")).toContainText("4096");
  await expect(page.getByRole("dialog")).not.toContainText(
    "Merge buildings during play to discover",
  );
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page
    .getByRole("button", { name: "Match history", exact: true })
    .click();
  await expect(page.locator(".history-row")).toHaveCount(1);
  await expect(page.locator(".history-row")).toContainText("Completed");
  await expect(page.locator(".history-row")).toContainText("Still building");
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.screenshot({
    path: "artifacts/screenshots/ui/continued-desktop.png",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".mobile-next")).toContainText("32768");
  await expect(page.locator(".end-overlay")).toHaveCount(0);
  await page.screenshot({
    path: "artifacts/screenshots/ui/continued-mobile.png",
  });
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(async () => (await saved(page, false)).cities.beijing.session.moves)
    .toBe(2);
  expect(errors).toEqual([]);
});

test("continued dead city keeps its achievement and restart clears continuation", async ({
  page,
}) => {
  const dead = [4096, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
  await seed(page, dead, {
    cities: {
      beijing: {
        run: {
          board: dead,
          score: 5000,
          hasWon: true,
          continued: true,
          status: "playing",
          undo: null,
        },
        best: 5000,
        discovered: [2, 4, 2048],
      },
    },
  });
  await load(page);
  await expect(page.locator(".end-overlay")).toContainText(
    "Your city is complete",
  );
  await page.getByRole("button", { name: "Build again", exact: true }).click();
  await expect(page.locator(".end-overlay")).toHaveCount(0);
  const run = (await saved(page)).cities.beijing.run;
  expect(run.status).toBe("playing");
  expect(run.hasWon).toBeFalsy();
  expect(run.continued).toBeFalsy();
  await page
    .getByRole("button", { name: "Match history", exact: true })
    .click();
  await expect(page.locator(".history-row")).toContainText("Completed");
  await expect(page.locator(".history-row")).not.toContainText(
    "Still building",
  );
});

test("phone victory offers Chinese continuation and accepts a board swipe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page, [1024, 1024, ...Array(14).fill(0)], {
    locale: "zh-CN",
    weather: "off",
  });
  await page.goto("/");
  await page.getByRole("button", { name: "开始建城", exact: true }).click();
  await expect(page.locator(".mobile-game")).toBeVisible();
  const swipe = async (dx: number, dy: number) => {
    const canvas = await page.locator(".board-canvas canvas").boundingBox();
    const x = canvas!.x + canvas!.width / 2,
      y = canvas!.y + canvas!.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 4 });
    await page.mouse.up();
  };
  await swipe(-60, -60);
  await expect(page.locator(".end-overlay")).toContainText("挑战4096");
  await expect(
    page.getByRole("button", { name: "再次建城", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/screenshots/ui/continued-mobile-win-cn.png",
  });
  await page.getByRole("button", { name: "继续建城", exact: true }).click();
  await swipe(60, 60);
  await expect
    .poll(async () => (await saved(page, false)).cities.beijing.session.moves)
    .toBe(2);
  await expect(page.locator(".end-overlay")).toHaveCount(0);
});

for (const [width, height, colorScheme] of [
  [1440, 1100, "light"],
  [1440, 900, "dark"],
  [390, 844, "dark"],
  [360, 640, "light"],
] as const) {
  test(`victory stays outside the board at ${width}px in ${colorScheme} mode`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ colorScheme });
    await seed(page, [2048, 2, ...Array(14).fill(0)], {
      locale: "zh-CN",
      weather: "off",
    });
    await page.goto("/");
    if (width < 740)
      await page.getByRole("button", { name: "开始建城", exact: true }).click();
    await expect(page.locator(".victory-slot .celebration")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      colorScheme,
    );
    const assertSeparate = async () => {
      const canvas = (await page.locator(".board-canvas").boundingBox())!;
      const notice = (await page.locator(".victory-slot").boundingBox())!;
      expect(canvas.width).toBeGreaterThan(0);
      expect(canvas.height).toBeGreaterThan(100);
      const intersects =
        canvas.x < notice.x + notice.width &&
        canvas.x + canvas.width > notice.x &&
        canvas.y < notice.y + notice.height &&
        canvas.y + canvas.height > notice.y;
      expect(intersects).toBe(false);
      expect(notice.y).toBeGreaterThanOrEqual(canvas.y + canvas.height);
      if (width >= 740) {
        const panel = (await page.locator(".game-panel").boundingBox())!;
        expect(notice.y + notice.height).toBeLessThanOrEqual(panel.y + panel.height);
      }
      expect(notice.x).toBeGreaterThanOrEqual(0);
      expect(notice.x + notice.width).toBeLessThanOrEqual(width);
      expect(notice.y + notice.height).toBeLessThanOrEqual(height);
    };
    await assertSeparate();
    await expect(page.locator(".celebration")).toHaveCSS(
      "backdrop-filter",
      "none",
    );
    // Wait for the entrance animation to finish before checking the icon.
    await page.locator(".celebration .end-icon").evaluate(async (icon) => {
      await Promise.all(icon.getAnimations().map((animation) => animation.finished));
    });
    await expect(page.locator(".celebration .end-icon")).toHaveCSS("opacity", "1");
    await expect(page.locator(".celebration .end-icon")).toHaveCSS(
      "color", colorScheme === "dark" ? "rgb(242, 242, 233)" : "rgb(53, 74, 59)",
    );
    await page.screenshot({
      path: `artifacts/screenshots/ui/victory-outside-${width}-${colorScheme}.png`,
    });
    const boardBefore = (await saved(page, false)).cities.beijing.run.board;
    await page.getByRole("button", { name: "查看棋盘", exact: true }).click();
    await expect(page.locator(".celebration")).toHaveCount(0);
    await assertSeparate();
    await page.getByRole("button", { name: "查看结算", exact: true }).click();
    await expect(page.locator(".celebration")).toBeVisible();
    await assertSeparate();
    await page.getByRole("button", { name: "继续建城", exact: true }).click();
    await expect(page.locator(".victory-slot")).toHaveCount(0);
    await expect
      .poll(async () => (await saved(page, false)).cities.beijing.run.continued)
      .toBe(true);
    expect((await saved(page, false)).cities.beijing.run.board).toEqual(
      boardBefore,
    );
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(async () => (await saved(page, false)).cities.beijing.session.moves)
      .toBe(1);
  });
}
