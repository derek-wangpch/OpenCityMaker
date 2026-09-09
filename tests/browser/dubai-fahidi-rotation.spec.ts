import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

test("Al Fahidi centre alley through a full dark-mode rotation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const out = "artifacts/dubai-fahidi-rotation";
  await mkdir(out, { recursive: true });
  for (let angle = 0; angle < 360; angle += 30) {
    await page.goto(
      `/tests/fixtures/dubai-preview.html?tier=4&theme=dark&rotation=${(angle * Math.PI) / 180}`,
    );
    await page.waitForFunction(() => (window as any).__done);
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible();
    const data = await canvas.evaluate((el) =>
      (el as HTMLCanvasElement).toDataURL("image/png"),
    );
    await writeFile(
      `${out}/${angle}.png`,
      Buffer.from(data.split(",")[1], "base64"),
    );
  }
  expect(errors).toEqual([]);
});
