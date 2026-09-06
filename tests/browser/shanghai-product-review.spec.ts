import { test, expect as baseExpect } from "@playwright/test";
const expect = baseExpect.configure({ timeout: 60000 });
test.setTimeout(360000);
test.skip(
  !process.env.SHANGHAI_REVIEW,
  "Set SHANGHAI_REVIEW=1 for this visual review",
);
test("Shanghai skyline and rotated atlas models at desktop and phone sizes", async ({
  page,
}) => {
  // Font delivery is external to model QA; use the installed fallback fonts.
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Keep concurrent workspace edits from reloading a capture mid-frame.
  await page.routeWebSocket("**", (socket) => socket.close());
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      "citymaker:v1",
      JSON.stringify({
        version: 1,
        locale: "en",
        city: "shanghai",
        cities: {
          shanghai: {
            session: {
              id: "shanghai-review",
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
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Shanghai");
  await expect(page.locator(".board-canvas canvas")).toBeVisible();
  await page.screenshot({
    path: "artifacts/shanghai-tier-review/desktop-board.png",
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "artifacts/shanghai-tier-review/mobile-home.png",
  });
  await page.locator(".mobile-cta.primary").click({ timeout: 15000 });
  await expect(page.locator(".mobile-game")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/shanghai-tier-review/mobile-board.png",
  });
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page
    .getByRole("button", { name: "Landmark atlas", exact: true })
    .click();
  await expect(page.locator(".atlas-card")).toHaveCount(11);
  for (const tier of [9, 8, 7, 6, 5, 4, 3, 2, 1]) {
    await page
      .locator(".atlas-card")
      .nth(tier - 1)
      .click();
    const canvas = page.locator(".model-view canvas");
    await expect(canvas).toBeVisible();
    await page.screenshot({
      path: `artifacts/shanghai-tier-review/mobile-tier-${tier}.png`,
    });
    const bounds = await canvas.boundingBox();
    expect(bounds).not.toBeNull();
    await page.mouse.move(bounds!.x + 55, bounds!.y + 120);
    await page.mouse.down();
    await page.mouse.move(bounds!.x + 255, bounds!.y + 120);
    await page.mouse.up();
    await page.screenshot({
      path: `artifacts/shanghai-tier-review/rotated-tier-${tier}.png`,
    });
    await page.keyboard.press("Escape");
  }
  expect(errors).toEqual([]);
});
