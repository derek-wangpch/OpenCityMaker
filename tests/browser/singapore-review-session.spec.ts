import { test, expect } from "@playwright/test";
test("Singapore tier review contact sheets", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/tests/fixtures/singapore-model-review.html");
  await page.waitForFunction(() =>
    Boolean((window as unknown as { __done: boolean }).__done),
  );
  await expect(page.locator(".row")).toHaveCount(10);
  for (const row of await page.locator(".row").all()) {
    const id = await row.getAttribute("id");
    await row.screenshot({ path: `artifacts/singapore-review/${id}.png` });
  }
  expect(errors).toEqual([]);
});
