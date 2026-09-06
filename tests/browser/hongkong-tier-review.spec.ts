import { test, expect } from "@playwright/test";
test.setTimeout(120000);
test.use({
  launchOptions: {
    args: [`--use-angle=${process.env.HONGKONG_REVIEW_GPU ?? "swiftshader"}`],
  },
});
// Opt-in visual review, using a dedicated Hong Kong preview fixture.
test.skip(
  !process.env.HONGKONG_REVIEW,
  "Set HONGKONG_REVIEW=1 to capture the full Hong Kong review",
);
for (const tier of [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) {
  test(`Hong Kong tier ${tier}: all elevations`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const view of ["default", "front", "side", "top"]) {
      await page.goto(
        `/tests/fixtures/hongkong-preview.html?city=hongkong&v=${2 ** tier}&view=${view}`,
      );
      await page.waitForFunction(() => (window as any).__done === true);
      await expect(page.locator("canvas")).toBeVisible();
      await page.locator("canvas").screenshot({
        path: `artifacts/hongkong-tier-review/tier-${tier}-${view}.png`,
      });
    }
    expect(errors).toEqual([]);
  });
}
