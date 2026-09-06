import { expect, test } from "@playwright/test";

test("system theme, overrides, persistence and dialogs stay in sync", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const toggle = page.getByRole("button", {
    name: "Appearance: Follow system",
  });
  await expect(toggle).toBeVisible();
  await expect
    .poll(() =>
      page.locator('meta[name="theme-color"]').getAttribute("content"),
    )
    .toBe("#171c1a");

  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(
    page.getByRole("button", { name: "Appearance: Light" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Appearance: Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Appearance: Dark" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("citymaker:theme")),
  ).toBe("dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.screenshot({
    path: "artifacts/screenshots/ui/dark-desktop-game.png",
  });
  await page.getByRole("button", { name: "How to play" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: "artifacts/screenshots/ui/dark-desktop.png" });
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Landmark atlas", exact: true })
    .click();
  await expect(page.locator(".atlas-card")).toHaveCount(11);
  await page.screenshot({ path: "artifacts/screenshots/ui/dark-atlas.png" });

  await page.getByRole("button", { name: "Appearance: Dark" }).click();
  await expect(
    page.getByRole("button", { name: "Appearance: Follow system" }),
  ).toBeVisible();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("phone start and game use the resolved dark theme", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    colorScheme: "dark",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Appearance: Follow system" }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/screenshots/ui/dark-mobile-start.png",
  });
  await page.getByRole("button", { name: "Play", exact: true }).tap();
  await expect(page.locator(".mobile-game")).toBeVisible();
  await page.screenshot({
    path: "artifacts/screenshots/ui/dark-mobile-game.png",
  });
  await context.close();
});
