import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

test.use({
  viewport: { width: 390, height: 844 },
  launchOptions: { args: ["--use-angle=default"] },
});
for (const theme of ["light", "dark"] as const) {
  test(`Emirates Towers facades at phone size in ${theme}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
      route.abort(),
    );
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
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
                board: [
                  512, 16, 64, 32, 32, 512, 16, 64, 64, 32, 512, 16, 16, 64, 32,
                  512,
                ],
                score: 4096,
                status: "playing",
                undo: null,
              },
              best: 4096,
              discovered: [2, 4, 8, 16, 32, 64, 128, 256, 512],
            },
          },
        }),
      ),
    );
    const out = `artifacts/dubai-emirates-facades/${theme}`;
    await mkdir(out, { recursive: true });
    const session = await page.context().newCDPSession(page);
    const capture = async (name: string) => {
      const { data } = await session.send("Page.captureScreenshot", {
        format: "png",
      });
      await writeFile(`${out}/${name}.png`, Buffer.from(data, "base64"));
    };
    await page.goto("/");
    await page.getByRole("button", { name: "Play", exact: true }).click();
    await expect(page.locator(".mobile-game")).toBeVisible();
    await capture("board");
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await page
      .getByRole("button", { name: "Landmark atlas", exact: true })
      .click();
    await page.locator(".atlas-card").nth(8).click();
    const canvas = page.locator(".model-view canvas");
    await expect(canvas).toBeVisible();
    const box = (await canvas.boundingBox())!;
    for (let i = 0; i < 4; i++) {
      await capture(`rotation-${i}`);
      await page.mouse.move(box.x + 55, box.y + 120);
      await page.mouse.down();
      await page.mouse.move(box.x + 155, box.y + 120);
      await page.mouse.up();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
