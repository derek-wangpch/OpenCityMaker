import { mkdir, writeFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";
test.setTimeout(600000);
test.use({
  viewport: { width: 390, height: 844 },
  launchOptions: { args: ["--use-angle=default"] },
});
test("Dubai early tiers remain distinct on a crowded phone board", async ({
  page,
}) => {
  // Font delivery is external to model QA; use the installed fallback fonts.
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  const captureSession = await page.context().newCDPSession(page);
  const capture = async ({ path }: { path: string }) => {
    const { data } = await captureSession.send("Page.captureScreenshot", {
      format: "png",
    });
    await mkdir("artifacts/dubai-readability", { recursive: true });
    await writeFile(path, Buffer.from(data, "base64"));
  };
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() =>
    localStorage.setItem(
      "citymaker:v1",
      JSON.stringify({
        version: 1,
        locale: "en",
        city: "dubai",
        cities: {
          dubai: {
            run: {
              board: [2, 4, 8, 16, 4, 16, 2, 8, 8, 2, 16, 4, 16, 8, 4, 2],
              score: 4096,
              status: "playing",
              undo: null,
            },
            best: 4096,
            discovered: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
          },
        },
      }),
    ),
  );
  await page.goto("/", { waitUntil: "domcontentloaded" });
  console.log("Phone page loaded");
  await expect(page.locator("h1")).toContainText("Dubai");
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await expect(page.locator(".mobile-game")).toBeVisible();
  console.log("Phone board visible");
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight,
    ),
  ).toBe(true);
  await capture({
    path: "artifacts/dubai-readability/mobile-board.png",
  });
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page
    .getByRole("button", { name: "Landmark atlas", exact: true })
    .click();
  await expect(page.locator(".atlas-card")).toHaveCount(11);
  for (const tier of [4, 3, 2, 1]) {
    await page
      .locator(".atlas-card")
      .nth(tier - 1)
      .click();
    const canvas = page.locator(".model-view canvas");
    await expect(canvas).toBeVisible();
    await capture({
      path: `artifacts/dubai-readability/mobile-tier-${tier}.png`,
    });
    const bounds = await canvas.boundingBox();
    expect(bounds).not.toBeNull();
    await page.mouse.move(bounds!.x + 55, bounds!.y + 120);
    await page.mouse.down();
    await page.mouse.move(bounds!.x + 255, bounds!.y + 120);
    await page.mouse.up();
    await capture({
      path: `artifacts/dubai-readability/rotated-tier-${tier}.png`,
    });
    await page.keyboard.press("Escape");
    console.log(`Reviewed tier ${tier}`);
  }
  expect(errors).toEqual([]);
});
