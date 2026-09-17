import { expect, type Page } from "@playwright/test";
/**
 * Language, appearance and reduce motion live in the Preferences dialog (a page
 * on a phone), so every spec that used to click them in the chrome opens it
 * first. The entry point and the controls are localized, hence the patterns.
 */
export const preferencesButton = (page: Page) =>
  page
    .getByRole("button", { name: /^(Preferences|偏好设置|偏好設定)$/ })
    .first();
export async function openPreferences(page: Page) {
  await preferencesButton(page).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}
export async function closePreferences(page: Page) {
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
}
export const languageSelect = (page: Page) =>
  page.getByRole("combobox", { name: /Language|语言|語言/ });
/** Open Preferences, switch locale, and return to the page underneath. */
export async function setLanguage(page: Page, locale: string) {
  await openPreferences(page);
  await languageSelect(page).selectOption(locale);
  await closePreferences(page);
}
