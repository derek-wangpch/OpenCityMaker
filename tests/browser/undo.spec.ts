import { test, expect, type Page } from "@playwright/test";
import type { Save } from "../../src/game/storage";

const board = [2, 2, ...Array(14).fill(0)];
async function seed(page: Page) {
  await page.addInitScript((board) => {
    if (!localStorage.getItem("citymaker:v1"))
      localStorage.setItem(
        "citymaker:v1",
        JSON.stringify({
          version: 1,
          city: "beijing",
          locale: "en",
          weather: "off",
          cities: {
            beijing: {
              run: { board, score: 0, status: "playing", undo: null },
              best: 0,
              discovered: [2],
            },
          },
        }),
      );
  }, board);
}
function saved(page: Page): Promise<Save> {
  return page.evaluate(
    () =>
      new Promise<Save>((resolve, reject) => {
        const open = indexedDB.open("citymaker", 1);
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction("progress", "readonly");
          const request = tx.objectStore("progress").get("current");
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
          tx.oncomplete = () => db.close();
        };
      }),
  );
}

test("undo restores a saved move once while keeping best score and discoveries", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await seed(page);
  await page.goto("/");
  const undo = page.getByRole("button", { name: "Undo", exact: true });
  await expect(undo).toBeDisabled();
  await page.keyboard.press("ArrowLeft");
  await expect(undo).toBeEnabled();
  await expect
    .poll(async () => (await saved(page)).cities.beijing.run.score)
    .toBe(4);
  const moved = (await saved(page)).cities.beijing;
  await page.getByRole("button", { name: "02 Hong Kong" }).click();
  await expect(undo).toBeDisabled();
  await page.getByRole("button", { name: "01 Beijing" }).click();
  await expect(undo).toBeEnabled();
  await expect.poll(async () => (await saved(page)).city).toBe("beijing");
  await page.reload();
  await expect(undo).toBeEnabled();
  await undo.click();
  await expect(undo).toBeDisabled();
  await expect
    .poll(async () => (await saved(page)).cities.beijing)
    .toEqual({
      ...moved,
      run: { board, score: 0, status: "playing", undo: null },
      session: { ...moved.session, moves: 0, undoMoves: null },
    });
  expect((await saved(page)).cities.beijing.best).toBe(4);
  expect((await saved(page)).cities.beijing.discovered).toContain(4);
  await page.keyboard.press("ArrowLeft");
  await expect(undo).toBeEnabled();
  // An immediate new move after undo must start from the restored board.
  await undo.evaluate((button) => {
    (button as HTMLButtonElement).click();
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
  });
  await expect
    .poll(async () => (await saved(page)).cities.beijing.run.board)
    .toEqual([2, 0, 0, 4, ...Array(12).fill(0)]);
  const replayed = (await saved(page)).cities.beijing;
  expect(replayed.session.moves).toBe(1);
  expect(replayed.run.board[3]).toBe(4);
  expect(replayed.run.score).toBe(4);
  expect(replayed.run.undo).toEqual({ board, score: 0 });
  await page.getByRole("button", { name: "New city", exact: true }).click();
  await page.getByRole("button", { name: "Start fresh", exact: true }).click();
  await expect(undo).toBeDisabled();
  await expect
    .poll(async () => (await saved(page)).cities.beijing.run.score)
    .toBe(0);
});

test("undo is touch accessible on a 360px phone and survives reload", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await seed(page);
  await page.goto("/#/play");
  const undo = page.getByRole("button", { name: "Undo", exact: true });
  await expect(undo).toBeDisabled();
  const session = await context.newCDPSession(page);
  const box = (await page.locator(".board-canvas canvas").boundingBox())!;
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + 240, y: box.y + 150 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: box.x + 100, y: box.y + 70 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(undo).toBeEnabled();
  await expect
    .poll(async () => (await saved(page)).cities.beijing.run.score)
    .toBe(4);
  for (const button of await page
    .locator(".mobile-bottombar .board-actions button")
    .all()) {
    const bounds = (await button.boundingBox())!;
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(360);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(740);
    expect(bounds.width).toBeGreaterThanOrEqual(40);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    360,
  );
  await page.screenshot({ path: "artifacts/screenshots/ui/undo-mobile.png" });
  await undo.tap();
  await expect(undo).toBeDisabled();
  await expect
    .poll(async () => (await saved(page)).cities.beijing.run)
    .toEqual({ board, score: 0, status: "playing", undo: null });
  await page.reload();
  await expect(undo).toBeDisabled();
  expect((await saved(page)).cities.beijing.session.moves).toBe(0);
  await context.close();
});
