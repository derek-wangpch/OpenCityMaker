import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const env = ((globalThis as any).process?.env ?? {}) as Record<
  string,
  string | undefined
>;
test.setTimeout(90000);
const out = env.DUBAI_REVIEW_OUT ?? "artifacts/dubai-tier-review/after";
for (let tier = 11; tier >= 1; tier--) {
  test(`Dubai tier ${tier} elevations`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    for (const view of ["default", "front", "side", "top"]) {
      await page.goto(
        `/tests/fixtures/dubai-preview.html?tier=${tier}&view=${view}`,
      );
      await page.waitForFunction(() => (window as any).__done);
      await expect(page.locator("canvas")).toBeVisible();
      // Read the actual rendered canvas (preserveDrawingBuffer is enabled in
      // model mode), avoiding screenshot layout/font synchronization entirely.
      const data = await page
        .locator("canvas")
        .evaluate((canvas) =>
          (canvas as HTMLCanvasElement).toDataURL("image/png"),
        );
      await mkdir(out, { recursive: true });
      await writeFile(
        `${out}/tier-${tier}-${view}.png`,
        Buffer.from(data.split(",")[1], "base64"),
      );
    }
    expect(errors).toEqual([]);
  });
}
