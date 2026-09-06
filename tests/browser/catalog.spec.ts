import { test, expect } from "@playwright/test";
import { cities } from "../../src/cities/packs";

// Full-resolution city sheets complement the downscaled 132-model overview.
test("city sheets, three-language mobile layout and landmark rotation", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?gallery");
  await expect(page.locator(".atlas-card img")).toHaveCount(
    cities.length * 11,
    { timeout: 20000 },
  );
  await page
    .locator(".atlas-card img")
    .evaluateAll((images) =>
      Promise.all(images.map((img) => (img as HTMLImageElement).decode())),
    );
  for (const [index, city] of cities.entries()) {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page
      .getByRole("button", {
        name: `${String(index + 1).padStart(2, "0")} ${city.name.en}`,
        exact: true,
      })
      .click();
    // Filter only the QA sheet, without adding a second gallery implementation.
    await page.evaluate((index) => {
      document
        .querySelectorAll<HTMLElement>(".gallery-city")
        .forEach((el, i) => {
          el.style.display = i === index ? "" : "none";
        });
      document.querySelectorAll<HTMLElement>(".atlas-card").forEach((el, i) => {
        el.style.display = Math.floor(i / 11) === index ? "" : "none";
      });
    }, index);
    await expect(page.locator(".atlas-card:visible")).toHaveCount(11);
    await page.screenshot({
      path: `artifacts/screenshots/cities/city-${city.id}.png`,
      fullPage: true,
    });
    await page.setViewportSize({ width: 360, height: 740 });
    await page.screenshot({
      path: `artifacts/screenshots/cities/city-${city.id}-mobile.png`,
      fullPage: true,
    });
    if (index >= 4) {
      for (const locale of ["zh-CN", "zh-HK", "en"] as const) {
        await page
          .getByRole("combobox", { name: /Language|语言|語言/ })
          .selectOption(locale);
        await expect(page.locator(".gallery-city:visible")).toHaveText(
          city.name[locale],
        );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  }
  // Inspect the signature shapes from another angle using the real dialog.
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.evaluate(() =>
    document
      .querySelectorAll<HTMLElement>(".gallery-city,.atlas-card")
      .forEach((el) => {
        el.style.display = "";
      }),
  );
  const models = [
    "tk-tower",
    "tk-skytree",
    "sg-artscience",
    "sg-sands",
    "db-future",
    "db-burj-al-arab",
    "db-khalifa",
    "sy-harbourbridge",
    "sy-opera",
    "ny-brooklyn",
    "ny-liberty",
    "ny-onewtc",
    "pa-eiffel",
    "ld-towerbridge",
    "ld-eye",
    "ld-shard",
    "rm-pantheon",
    "rm-colosseum",
    "rm-stpeters",
  ];
  const buildings = cities.flatMap((city) => city.buildings);
  for (const model of models) {
    const index = buildings.findIndex((building) => building.model === model);
    await page.locator(".atlas-card").nth(index).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const canvas = dialog.locator("canvas");
    await canvas.focus();
    const before = await canvas.screenshot();
    for (let i = 0; i < 5; i++) await canvas.press("ArrowRight");
    // A screenshot waits for the browser frame; its pixels must change after rotation.
    const after = await canvas.screenshot();
    expect(after.equals(before), model).toBe(false);
    await dialog.screenshot({
      path: `artifacts/screenshots/models/model-${model}.png`,
    });
    await page.keyboard.press("Escape");
  }
  expect(errors).toEqual([]);
});
