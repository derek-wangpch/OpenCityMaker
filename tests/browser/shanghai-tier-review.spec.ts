import { test, expect } from "@playwright/test";
test.setTimeout(600000);
test.skip(
  !process.env.SHANGHAI_REVIEW,
  "Set SHANGHAI_REVIEW=1 for Shanghai visual review",
);
test("Shanghai tier 9 to 1: all elevations", async ({ page }) => {
  await page.routeWebSocket("**", (socket) => socket.close());
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/tests/fixtures/shanghai-preview.html");
  await page.waitForFunction(() => (window as any).__done === true);
  for (const tier of [9, 8, 7, 6, 5, 4, 3, 2, 1]) {
    for (const view of ["default", "front", "side", "top"]) {
      await page.evaluate(
        ({ tier, view }) => (window as any).__show(tier, view),
        { tier, view },
      );
      await page
        .locator("canvas")
        .screenshot({
          path: `artifacts/shanghai-tier-review/tier-${tier}-${view}.png`,
          timeout: 60000,
        });
    }
  }
  expect(errors).toEqual([]);
});
