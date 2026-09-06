import { test, expect } from "@playwright/test";

// Throwaway visual-check harness for one building model. Copy into
// tests/browser/, run with PREVIEW_* env vars, and DELETE before the final
// full-suite run (the suite executes every spec in tests/browser/).
//
//   PREVIEW_CITY  any registered pack id
//   PREVIEW_VALUE the building's value (2 ** tier, e.g. 春笋 tier 11 -> 2048)
//   PREVIEW_OUT   default screenshot path; other views get suffixes
//   PREVIEW_ROTATION optional model rotation in radians
// Read env via globalThis — the project has no @types/node, so a bare
// `process.env` fails `npx tsc --noEmit` while this throwaway spec exists.
const env = ((globalThis as any).process?.env ?? {}) as Record<
  string,
  string | undefined
>;
const city = env.PREVIEW_CITY ?? "shenzhen";
const value = env.PREVIEW_VALUE ?? "2";
const out = env.PREVIEW_OUT ?? "test-results/model-preview.png";

test("capture model preview elevations", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const view of ["default", "front", "side", "top"]) {
    const params = new URLSearchParams({
      city,
      v: value,
      view,
      rotation: env.PREVIEW_ROTATION ?? "0",
    });
    await page.goto(`/model-preview.html?${params}`);
    await page.waitForFunction(() => (window as any).__done === true);
    await expect(page.locator("canvas")).toBeVisible();
    await page.waitForTimeout(150);
    const path =
      view === "default" ? out : out.replace(/(\.[^.\/]+)?$/, `-${view}$1`);
    await page.locator("canvas").screenshot({ path });
  }
  expect(errors).toEqual([]);
});
