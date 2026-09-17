import { expect, test, type Page } from "@playwright/test";
// Appearance lives in Preferences, so every theme check opens it first.
import { openPreferences, preferencesButton } from "./preferences";

const themeSelect = (page: Page) =>
  page.getByRole("combobox", { name: "Appearance" });

test("system theme, overrides, persistence and dialogs stay in sync", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      page.locator('meta[name="theme-color"]').getAttribute("content"),
    )
    .toBe("#171c1a");

  await openPreferences(page);
  await expect(themeSelect(page)).toHaveValue("system");
  await themeSelect(page).selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(themeSelect(page)).toHaveValue("light");
  await themeSelect(page).selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() => localStorage.getItem("citymaker:theme")),
  ).toBe("dark");
  await page.screenshot({
    path: "artifacts/screenshots/ui/dark-desktop-settings.png",
  });
  await page.keyboard.press("Escape");

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

  await openPreferences(page);
  await themeSelect(page).selectOption("system");
  await expect(themeSelect(page)).toHaveValue("system");
  await page.keyboard.press("Escape");
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
  await page.screenshot({
    path: "artifacts/screenshots/ui/dark-mobile-start.png",
  });
  await preferencesButton(page).tap();
  await expect(page.locator(".mobile-settings")).toBeVisible();
  await expect(themeSelect(page)).toHaveValue("system");
  await page.screenshot({
    path: "artifacts/screenshots/ui/dark-mobile-settings.png",
  });
  await page.goBack();
  await page.getByRole("button", { name: "Play", exact: true }).tap();
  await expect(page.locator(".mobile-game")).toBeVisible();
  await page.screenshot({
    path: "artifacts/screenshots/ui/dark-mobile-game.png",
  });
  await context.close();
});
