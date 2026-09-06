/**
 * Rasterizes the home screen icons from public/favicon.svg, so the mark on an
 * iPhone Home Screen can never drift away from the browser favicon.
 *
 * iOS ignores the manifest's SVG icon, applies its own rounded mask, and
 * composites transparent pixels onto black. The page therefore paints the
 * mark's own background color edge to edge: the SVG's rounded corners vanish
 * into it and the OS mask cuts the real ones.
 *
 * Run with `npm run build:icons` after editing the favicon; the PNGs are
 * versioned so a normal install and build never needs a browser to do it.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const file = (name) =>
  fileURLToPath(new URL(`../public/${name}`, import.meta.url));
/** Background of the favicon's rounded plate, as the full-bleed page color. */
const BACKGROUND = "#284f43";
const icons = [
  // 180px is what iOS asks for as `apple-touch-icon`; 192 and 512 are the
  // manifest sizes browsers use for the same purpose on other platforms.
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

const svg = await readFile(file("favicon.svg"), "utf8");
const browser = await chromium.launch();
try {
  for (const { name, size } of icons) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    await page.setContent(
      `<!doctype html><style>
         html,body{margin:0;height:100%;background:${BACKGROUND}}
         svg{display:block;width:100%;height:100%}
       </style>${svg}`,
    );
    await writeFile(
      file(name),
      await page.screenshot({ omitBackground: false }),
    );
    await page.close();
    console.log(`${name} (${size}×${size})`);
  }
} finally {
  await browser.close();
}
