import { test, expect } from "@playwright/test";
// Opt-in visual review, reusing the existing model preview entry.
test.skip(
  !process.env.SHENZHEN_REVIEW,
  "Set SHENZHEN_REVIEW=1 to capture the full Shenzhen review",
);
for (const tier of [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) {
  test(`Shenzhen tier ${tier}: all elevations`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const view of ["default", "front", "side", "top"]) {
      await page.goto(
        `/model-preview.html?city=shenzhen&v=${2 ** tier}&view=${view}`,
      );
      await page.waitForFunction(() => (window as any).__done === true);
      await expect(page.locator("canvas")).toBeVisible();
      await page.locator("canvas").screenshot({
        path: `artifacts/shenzhen-tier-review/tier-${tier}-${view}.png`,
      });
    }
    expect(errors).toEqual([]);
  });
}
