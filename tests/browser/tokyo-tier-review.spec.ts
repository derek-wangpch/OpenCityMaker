import { test, expect } from "@playwright/test";
test.setTimeout(120000);
test.use({ viewport: { width: 460, height: 560 } });
const env = ((globalThis as any).process?.env ?? {}) as Record<string, string>;
for (let tier = 11; tier >= 1; tier--) {
  test(`Tokyo tier ${tier} views`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const view of ["default", "front", "side", "top", "rotated"]) {
      await page.goto(
        `/tests/fixtures/tokyo-preview.html?city=tokyo&v=${2 ** tier}&view=${view === "rotated" ? "default" : view}&rotation=${view === "rotated" ? 1.57 : 0}`,
      );
      await page.waitForFunction(() => (window as any).__done);
      await expect(page.locator("canvas")).toBeVisible();
      await page.screenshot({
        path: `artifacts/tokyo-tier-review/${env.TOKYO_REVIEW_PHASE ?? "after"}/${tier}-${view}.png`,
      });
    }
    expect(errors).toEqual([]);
  });
}
