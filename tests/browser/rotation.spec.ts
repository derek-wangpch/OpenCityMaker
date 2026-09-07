import { expect, test, type Page } from "@playwright/test";
import { slide, type Direction } from "../../src/game/engine";

const clockwise = "Rotate board clockwise 45°";
const counterclockwise = "Rotate board counterclockwise 45°";
const initial = [0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0];
async function seed(page: Page, step = 0, board = initial, city = "beijing") {
  await page.addInitScript(
    ({ step, board, city }) => {
      if (!localStorage.getItem("citymaker:v1"))
        localStorage.setItem(
          "citymaker:v1",
          JSON.stringify({
            version: 1,
            city,
            locale: "en",
            boardRotationStep: step,
            weather: "off",
            showLabels: true,
            cities: {
              [city]: {
                run: { board, score: 0, status: "playing", undo: null },
                best: 0,
                discovered: [...new Set(board.filter(Boolean))],
              },
            },
          }),
        );
    },
    { step, board, city },
  );
}
async function saved(page: Page) {
  return page.evaluate(
    () =>
      new Promise<any>((resolve, reject) => {
        const request = indexedDB.open("citymaker", 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction("progress", "readonly");
          const read = tx.objectStore("progress").get("current");
          read.onsuccess = () => resolve(read.result);
          read.onerror = () => reject(read.error);
          tx.oncomplete = () => db.close();
        };
        request.onerror = () => reject(request.error);
      }),
  );
}
async function ready(page: Page) {
  await page.goto("/#/play");
  await expect(page.locator(".board-rotation")).toBeVisible();
  await expect.poll(async () => (await saved(page))?.city).toBeTruthy();
}
async function checkMove(page: Page, direction: Direction) {
  const expected = slide(initial, direction);
  await expect
    .poll(async () => (await saved(page)).cities.beijing.session.moves)
    .toBe(1);
  const run = (await saved(page)).cities.beijing.run;
  expect(run.score).toBe(expected.points);
  expect(run.undo.board).toEqual(initial);
  const additions = run.board.flatMap((value: number, i: number) => {
    if (expected.board[i]) {
      expect(value).toBe(expected.board[i]);
      return [];
    }
    return value ? [value] : [];
  });
  expect(additions).toHaveLength(1);
  expect([2, 4]).toContain(additions[0]);
}

test("rotation wraps, persists and leaves the complete run untouched", async ({
  page,
}) => {
  await seed(page);
  await ready(page);
  const original = (await saved(page)).cities;
  for (let step = 1; step <= 8; step++) {
    await page.getByRole("button", { name: clockwise, exact: true }).click();
    await expect(page.locator(".board-canvas")).toHaveAttribute(
      "data-rotation-step",
      String(step % 8),
    );
  }
  await page
    .getByRole("button", { name: counterclockwise, exact: true })
    .click();
  await expect.poll(async () => (await saved(page)).boardRotationStep).toBe(7);
  expect((await saved(page)).cities).toEqual(original);
  await page.reload();
  await expect(page.locator(".board-canvas")).toHaveAttribute(
    "data-rotation-step",
    "7",
  );
  await page.getByRole("button", { name: "02 Hong Kong" }).click();
  await expect(page.locator(".board-canvas")).toHaveAttribute(
    "data-rotation-step",
    "7",
  );
  await page.getByRole("button", { name: "01 Beijing" }).click();
  expect((await saved(page)).cities.beijing).toEqual(original.beijing);
});

// Expected logical direction of a screen-up input at each preset, independently
// specified so the browser test cannot pass by reusing the mapping under test.
const screenUp: Direction[] = [
  "up",
  "left",
  "left",
  "down",
  "down",
  "right",
  "right",
  "up",
];
for (let step = 0; step < 8; step++) {
  test(`screen-up keyboard and direction button at rotation ${step}`, async ({
    page,
  }) => {
    await seed(page, step);
    await ready(page);
    await page.keyboard.press("ArrowUp");
    await checkMove(page, screenUp[step]);
    await page.waitForTimeout(350);
    const before = (await saved(page)).cities.beijing.run;
    const expected = slide(before.board, screenUp[step]);
    await page.getByRole("button", { name: /^Move up / }).click();
    if (!expected.events.some((e) => e.from !== e.to)) {
      await expect(page.getByRole("status")).toContainText("No movement");
    } else {
      await expect
        .poll(async () => (await saved(page)).cities.beijing.session.moves)
        .toBe(2);
      expect((await saved(page)).cities.beijing.run.score).toBe(
        before.score + expected.points,
      );
    }
  });
  test(`screen-up touch at rotation ${step}`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await seed(page, step);
    await ready(page);
    const box = (await page.locator(".board-canvas canvas").boundingBox())!;
    const session = await context.newCDPSession(page);
    const x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      // A slightly imperfect vertical swipe still follows the intended axis.
      touchPoints: [{ x: x + 2, y: y - 130 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await checkMove(page, screenUp[step]);
    await context.close();
  });
}

test("rotating during a merge preserves its outcome and does not restart animation", async ({
  page,
}) => {
  await seed(page);
  await ready(page);
  // Dispatch both real DOM events in one task, before the 310ms move completes.
  await page.evaluate(() => {
    document.body.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        code: "ArrowLeft",
        bubbles: true,
      }),
    );
    (
      document.querySelector(
        'button[aria-label="Rotate board clockwise 45°"]',
      ) as HTMLButtonElement
    ).click();
  });
  await checkMove(page, "left");
  await expect(page.locator(".board-canvas")).toHaveAttribute(
    "data-rotation-step",
    "1",
  );
  await page.waitForTimeout(500);
  const before = (await saved(page)).cities;
  await page.evaluate(() => {
    (window as any).__rotationFrames = 0;
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => {
      (window as any).__rotationFrames++;
      return raf(cb);
    };
  });
  await page.getByRole("button", { name: clockwise, exact: true }).click();
  await page.waitForTimeout(400);
  expect(
    await page.evaluate(() => (window as any).__rotationFrames),
  ).toBeLessThan(3);
  expect((await saved(page)).cities).toEqual(before);
});

test("rotation cancels a held gesture and does not replay it on release", async ({
  page,
}) => {
  await seed(page);
  await ready(page);
  const box = (await page.locator(".board-canvas canvas").boundingBox())!;
  const before = (await saved(page)).cities;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.evaluate(() =>
    (
      document.querySelector(
        'button[aria-label="Rotate board clockwise 45°"]',
      ) as HTMLButtonElement
    ).click(),
  );
  await expect(page.locator(".board-canvas")).toHaveAttribute(
    "data-rotation-step",
    "1",
  );
  await page.mouse.move(
    box.x + box.width / 2 - 100,
    box.y + box.height / 2 - 100,
  );
  await page.mouse.up();
  expect((await saved(page)).cities).toEqual(before);
  await page.keyboard.press("ArrowUp");
  await checkMove(page, "left");
});

test("360px controls, back views, theme and responsive persistence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await seed(
    page,
    0,
    [128, 32, 16, 0, 512, 8, 64, 4, 0, 1024, 256, 2, 2, 4, 8, 16],
    "hongkong",
  );
  await ready(page);
  for (let step = 0; step < 8; step++) {
    if (step)
      await page.getByRole("button", { name: clockwise, exact: true }).click();
    await page.screenshot({
      path: `artifacts/screenshots/rotation/mobile-${step}.png`,
    });
  }
  for (const name of [clockwise, counterclockwise]) {
    const box = (await page
      .getByRole("button", { name, exact: true })
      .boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ colorScheme: "dark" });
  await page
    .getByRole("button", { name: "Weather · Off", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Weather · Clear", exact: true })
    .click();
  // Both the weather and CSS sky transition over three seconds.
  await page.waitForTimeout(3200);
  await page.screenshot({
    path: "artifacts/screenshots/rotation/mobile-dark-weather.png",
  });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(page.locator(".game-panel")).toBeVisible();
  await expect(page.locator(".board-canvas")).toHaveAttribute(
    "data-rotation-step",
    "7",
  );
  await page.screenshot({ path: "artifacts/screenshots/rotation/desktop.png" });
});
