import { test, expect, type Page } from "@playwright/test";
import { openPreferences, preferencesButton } from "./preferences";
/** Seed a run directly, the way game.spec.ts does, so the board is predictable. */
async function seed(
  page: Page,
  board: number[],
  session = { id: "seeded", startedAt: 1, moves: 0, undoMoves: null },
  extras: Record<string, unknown> = {},
) {
  await page.addInitScript(
    ({ board, session, extras }) => {
      if (!localStorage.getItem("citymaker:v1"))
        localStorage.setItem(
          "citymaker:v1",
          JSON.stringify({
            version: 1,
            locale: "en",
            city: "beijing",
            weather: "off",
            cities: {
              beijing: {
                run: { board, score: 40, status: "playing", undo: null },
                session,
                best: 40,
                discovered: [2, 4],
              },
            },
            ...extras,
          }),
        );
    },
    { board, session, extras },
  );
}
const savedProgress = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<any>((resolve, reject) => {
        const open = indexedDB.open("citymaker", 1);
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction("progress", "readonly");
          const request = tx.objectStore("progress").get("current");
          request.onsuccess = () => resolve(request.result);
          tx.oncomplete = () => db.close();
          request.onerror = () => reject(request.error);
        };
        open.onerror = () => reject(open.error);
      }),
  );
const savedMode = async (page: Page) => (await savedProgress(page)).moveMode;
const board = [2, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const stepSwitch = (page: Page) =>
  page.getByRole("switch", { name: "One-cell moves" });
const cells = (page: Page) => page.getByRole("table").getByRole("cell");

test("one-cell moves nudge the board instead of sliding to the wall", async ({
  page,
}) => {
  await seed(page, board);
  await page.goto("/");
  await expect(page.getByTestId("score")).toBeVisible();
  await openPreferences(page);
  await expect(stepSwitch(page)).toHaveAttribute("aria-checked", "false");
  // An untouched run has no score to protect, so the switch applies at once.
  await stepSwitch(page).click();
  await expect(stepSwitch(page)).toHaveAttribute("aria-checked", "true");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.keyboard.press("ArrowLeft");
  // Classic mode would make this row 2, 8. One cell per move keeps three tiles.
  await expect(cells(page).nth(0)).toContainText("2");
  await expect(cells(page).nth(1)).toContainText("4");
  await expect(cells(page).nth(2)).toContainText("4");
  await expect.poll(() => savedMode(page)).toBe("step");

  await page.reload();
  await openPreferences(page);
  await expect(stepSwitch(page)).toHaveAttribute("aria-checked", "true");
});

test("switching mid-run asks to restart and cancelling changes nothing", async ({
  page,
}) => {
  await seed(page, board, {
    id: "seeded",
    startedAt: 1,
    moves: 3,
    undoMoves: null,
  });
  await page.goto("/");
  await expect(page.getByTestId("score")).toHaveText("40");
  await openPreferences(page);
  await stepSwitch(page).click();
  await expect(
    page.getByRole("heading", { name: "Switch move style?" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Keep playing" }).click();
  // Cancelling returns to Preferences with the run and the switch untouched.
  await expect(stepSwitch(page)).toHaveAttribute("aria-checked", "false");
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("score")).toHaveText("40");
  expect(await savedMode(page)).toBeUndefined();

  // Escape on the prompt abandons the change the same way.
  await openPreferences(page);
  await stepSwitch(page).click();
  await expect(
    page.getByRole("heading", { name: "Switch move style?" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(stepSwitch(page)).toHaveAttribute("aria-checked", "false");

  // Confirming switches the style and starts a fresh city.
  await stepSwitch(page).click();
  await page.getByRole("button", { name: "Switch and start fresh" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByTestId("score")).toHaveText("0");
  await expect.poll(() => savedMode(page)).toBe("step");
});

test("the weather switch stops and restarts the automatic changeover", async ({
  page,
}) => {
  await page.clock.install();
  // The changeover picks a weather at random; make it deterministic.
  await page.addInitScript(() => (Math.random = () => 0));
  await seed(page, board, undefined, { weather: "clear" });
  await page.goto("/");
  await expect(page.getByTestId("score")).toBeVisible();
  const weatherSwitch = page.getByRole("switch", { name: "Weather" });
  await openPreferences(page);
  await expect(weatherSwitch).toHaveAttribute("aria-checked", "true");

  await weatherSwitch.click();
  await expect(weatherSwitch).toHaveAttribute("aria-checked", "false");
  await expect
    .poll(async () => (await savedProgress(page)).weather)
    .toBe("off");
  // Well past the 45-90s changeover: off stays off.
  await page.clock.fastForward(180_000);
  await expect(weatherSwitch).toHaveAttribute("aria-checked", "false");
  expect((await savedProgress(page)).weather).toBe("off");

  // Back on, and the changeover picks up again from clear.
  await weatherSwitch.click();
  await expect(weatherSwitch).toHaveAttribute("aria-checked", "true");
  expect((await savedProgress(page)).weather).toBe("clear");
  await page.clock.fastForward(90_000);
  await expect
    .poll(async () => (await savedProgress(page)).weather)
    .not.toBe("clear");
  await expect(weatherSwitch).toHaveAttribute("aria-checked", "true");
});

test("preferences are a page on a phone and the chrome no longer duplicates them", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await seed(page, board);
  await page.goto("/");
  await preferencesButton(page).tap();
  await expect(page).toHaveURL(/#\/settings$/);
  await expect(page.locator(".mobile-settings")).toBeVisible();
  await stepSwitch(page).tap();
  await expect(stepSwitch(page)).toHaveAttribute("aria-checked", "true");
  await page.screenshot({
    path: "artifacts/screenshots/ui/settings-mobile.png",
  });
  await page.getByRole("button", { name: "Home" }).tap();
  await expect(page.locator(".mobile-start")).toBeVisible();
  await page.reload();
  await preferencesButton(page).tap();
  await expect(stepSwitch(page)).toHaveAttribute("aria-checked", "true");
  await context.close();
});

test("the desktop chrome moved its preferences into the dialog", async ({
  page,
}) => {
  await seed(page, board);
  await page.goto("/");
  await expect(page.getByTestId("score")).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Language" })).toHaveCount(0);
  await expect(page.getByRole("switch", { name: "Reduce motion" })).toHaveCount(
    0,
  );
  await openPreferences(page);
  await expect(page.getByRole("combobox", { name: "Language" })).toBeVisible();
  await expect(
    page.getByRole("switch", { name: "Reduce motion" }),
  ).toBeVisible();
  await expect(page.getByRole("switch", { name: "Weather" })).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Appearance" }),
  ).toBeVisible();
});
