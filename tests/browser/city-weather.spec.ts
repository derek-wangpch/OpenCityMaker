import { test, expect, type Page } from "@playwright/test";
import type { Save } from "../../src/game/storage";

async function seed(page: Page, city: string, weather: string) {
  await page.addInitScript(
    ({ city, weather }) => {
      if (!localStorage.getItem("citymaker:v1"))
        localStorage.setItem(
          "citymaker:v1",
          JSON.stringify({
            version: 1,
            locale: "en",
            city,
            weather,
            cities: {
              [city]: {
                run: {
                  board: [2, 2, ...Array(14).fill(0)],
                  score: 0,
                  status: "playing",
                  undo: null,
                },
                best: 0,
                discovered: [2],
              },
            },
          }),
        );
    },
    { city, weather },
  );
}

function saved(page: Page): Promise<Save> {
  return page.evaluate(
    () =>
      new Promise<Save>((resolve, reject) => {
        const open = indexedDB.open("citymaker", 1);
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction("progress", "readonly");
          const request = tx.objectStore("progress").get("current");
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
          tx.oncomplete = () => db.close();
        };
      }),
  );
}

test("city weather normalizes old snow saves and persists the shorter cycle", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seed(page, "hongkong", "snow");
  await page.goto("/");
  const weather = page.getByRole("button", { name: /^Weather · / });
  await expect(weather).toHaveAccessibleName("Weather · Clear");
  await expect.poll(async () => (await saved(page)).weather).toBe("clear");
  const original = (await saved(page)).cities.hongkong;
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("citymaker:v1")!).weather,
    ),
  ).toBe("snow");
  for (const [label, value] of [
    ["Cloudy", "cloudy"],
    ["Rain", "rain"],
    ["Fog", "fog"],
    ["Off", "off"],
    ["Clear", "clear"],
  ]) {
    await weather.click();
    await expect(weather).toHaveAccessibleName(`Weather · ${label}`);
    await expect.poll(async () => (await saved(page)).weather).toBe(value);
  }
  expect((await saved(page)).cities.hongkong).toEqual(original);
  await page.reload();
  await expect(weather).toHaveAccessibleName("Weather · Clear");
  expect((await saved(page)).cities.hongkong).toEqual(original);
});

test("city weather switches out of snow and preserves compatible weather", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await seed(page, "beijing", "snow");
  await page.goto("/");
  const weather = page.getByRole("button", { name: /^Weather · / });
  await expect(weather).toHaveAccessibleName("Weather · Snow");
  await page.getByRole("button", { name: "02 Hong Kong" }).click();
  await expect(weather).toHaveAccessibleName("Weather · Clear");
  await weather.click();
  await weather.click();
  await expect(weather).toHaveAccessibleName("Weather · Rain");
  await page.getByRole("button", { name: "03 Shanghai" }).click();
  await expect(weather).toHaveAccessibleName("Weather · Rain");
  await weather.click();
  await expect(weather).toHaveAccessibleName("Weather · Snow");
  await page.getByRole("button", { name: "04 Shenzhen" }).click();
  await expect(weather).toHaveAccessibleName("Weather · Clear");
  for (let i = 0; i < 4; i++) await weather.click();
  await expect(weather).toHaveAccessibleName("Weather · Off");
  await page.getByRole("button", { name: "01 Beijing" }).click();
  await expect(weather).toHaveAccessibleName("Weather · Off");
  await expect.poll(async () => (await saved(page)).weather).toBe("off");
});

test("city weather automatic changes use the active city and respect off", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.addInitScript(() => {
    Math.random = () => 0.5;
  });
  await seed(page, "beijing", "clear");
  await page.goto("/");
  const weather = page.getByRole("button", { name: /^Weather · / });
  await expect(weather).toHaveAccessibleName("Weather · Clear");
  // The timer starts in Beijing, but must use Hong Kong's options when it fires.
  await page.getByRole("button", { name: "02 Hong Kong" }).click();
  await page.clock.fastForward(68_000);
  await expect(weather).toHaveAccessibleName("Weather · Rain");
  await expect.poll(async () => (await saved(page)).weather).toBe("rain");
  await page.getByRole("button", { name: "03 Shanghai" }).click();
  await page.clock.fastForward(68_000);
  await expect(weather).toHaveAccessibleName("Weather · Snow");
  await weather.click(); // fog
  await weather.click(); // off
  await expect(weather).toHaveAccessibleName("Weather · Off");
  await page.clock.fastForward(180_000);
  await expect(weather).toHaveAccessibleName("Weather · Off");
  await expect.poll(async () => (await saved(page)).weather).toBe("off");
});

test("city weather mobile taps skip snow and remember off after reload", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await seed(page, "singapore", "snow");
  await page.goto("/#/play");
  const weather = page.getByRole("button", { name: /^Weather · / });
  await expect(weather).toHaveAccessibleName("Weather · Clear");
  for (const label of ["Cloudy", "Rain", "Fog", "Off"]) {
    await weather.tap();
    await expect(weather).toHaveAccessibleName(`Weather · ${label}`);
  }
  await expect.poll(async () => (await saved(page)).weather).toBe("off");
  await page.reload();
  await expect(weather).toHaveAccessibleName("Weather · Off");
  await context.close();
});
