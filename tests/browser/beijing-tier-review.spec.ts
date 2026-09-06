import { test, expect } from "@playwright/test";
test.setTimeout(180000);
test.use({ viewport: { width: 460, height: 560 } });
const env = ((globalThis as any).process?.env ?? {}) as Record<string, string>;
test.skip(!env.BEIJING_REVIEW, "Set BEIJING_REVIEW=1 for visual QA");
for (let tier = 11; tier >= 1; tier--) {
  test(`Beijing tier ${tier} views`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const view of ["default", "front", "side", "top", "rotated"]) {
      await page.goto(
        `/tests/fixtures/beijing-preview.html?city=beijing&v=${2 ** tier}&view=${view === "rotated" ? "default" : view}&rotation=${view === "rotated" ? 1.57 : 0}`,
      );
      await page.waitForFunction(() => (window as any).__done);
      await expect(page.locator("canvas")).toBeVisible();
      await page.screenshot({
        path: `artifacts/beijing-tier-review/${env.BEIJING_REVIEW_PHASE ?? "after"}/${tier}-${view}.png`,
      });
    }
    expect(errors).toEqual([]);
  });
}
