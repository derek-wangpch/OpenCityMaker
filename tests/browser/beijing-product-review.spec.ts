import { test, expect } from "@playwright/test";
test.skip(!process.env.BEIJING_REVIEW, "Set BEIJING_REVIEW=1 for visual QA");
test.setTimeout(300000);
test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (r) =>
    r.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem(
      "citymaker:v1",
      JSON.stringify({
        version: 1,
        locale: "en",
        city: "beijing",
        cities: {
          beijing: {
            session: {
              id: "beijing-review",
              startedAt: 1,
              moves: 1,
              undoMoves: null,
            },
            run: {
              board: [
                1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1024, 0, 0, 0, 0, 0,
              ],
              score: 4096,
              status: "playing",
              undo: null,
            },
            best: 4096,
            discovered: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
          },
        },
      }),
    ),
  );
});
test("Beijing desktop board", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("h1")).toContainText("Beijing", {
    timeout: 60000,
  });
  await expect(page.locator(".board-canvas canvas")).toBeVisible();
  await page.screenshot({
    path: "artifacts/beijing-tier-review/desktop-board.png",
  });
});
test.describe("phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("Beijing board and every atlas model after rotation", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/#/play", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".mobile-game canvas")).toBeVisible({
      timeout: 60000,
    });
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= innerWidth &&
          document.documentElement.scrollHeight <= innerHeight,
      ),
    ).toBe(true);
    await page.screenshot({
      path: "artifacts/beijing-tier-review/mobile-board.png",
    });
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await page
      .getByRole("button", { name: "Landmark atlas", exact: true })
      .click();
    await expect(page.locator(".atlas-card")).toHaveCount(11);
    for (const tier of [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) {
      await page
        .locator(".atlas-card")
        .nth(tier - 1)
        .click();
      const canvas = page.locator(".model-view canvas");
      await expect(canvas).toBeVisible();
      await page.screenshot({
        path: `artifacts/beijing-tier-review/mobile-tier-${tier}.png`,
      });
      const b = await canvas.boundingBox();
      expect(b).not.toBeNull();
      expect(b!.x).toBeGreaterThanOrEqual(0);
      expect(b!.x + b!.width).toBeLessThanOrEqual(390);
      await page.mouse.move(b!.x + 55, b!.y + 120);
      await page.mouse.down();
      await page.mouse.move(b!.x + 255, b!.y + 120);
      await page.mouse.up();
      await page.screenshot({
        path: `artifacts/beijing-tier-review/rotated-tier-${tier}.png`,
      });
      await page.getByRole("button", { name: "Close", exact: true }).click();
    }
    expect(errors).toEqual([]);
  });
});
