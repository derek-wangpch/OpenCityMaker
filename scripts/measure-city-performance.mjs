// Usage: node scripts/measure-city-performance.mjs /path/to/four-city/dist
// Build both versions first. This script serves immutable production files and
// alternates fresh browser contexts; external font requests are blocked in both.
import { createServer } from "node:http";
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";

if (!process.argv[2])
  throw Error("Pass the preserved four-city dist directory");
const roots = {
  baseline: path.resolve(process.argv[2]),
  current: path.resolve("dist"),
};
const servers = [];
const output = {
  measuredAt: new Date().toISOString(),
  renderer: "Chromium / SwiftShader",
  viewport: "1440x1100",
  method:
    "One warmup per version, then five alternating fresh contexts. External requests blocked equally. goto to visible discovery image.",
  versions: {},
};
async function serve(root) {
  const server = createServer(async (req, res) => {
    try {
      const name = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const target = path.resolve(
        root,
        "." + (name === "/" ? "/index.html" : name),
      );
      if (!target.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      };
      res.setHeader(
        "Content-Type",
        types[path.extname(target)] ?? "application/octet-stream",
      );
      res.end(await readFile(target));
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}
async function rss(browser) {
  const session = await browser.newBrowserCDPSession();
  try {
    const { processInfo } = await session.send("SystemInfo.getProcessInfo");
    const ids = processInfo.map((p) => p.id).join(",");
    const text = execFileSync("ps", ["-o", "rss=", "-p", ids], {
      encoding: "utf8",
    });
    return (
      Math.round(
        (text
          .trim()
          .split(/\s+/)
          .reduce((sum, n) => sum + Number(n), 0) /
          1024) *
          10,
      ) / 10
    );
  } finally {
    await session.detach();
  }
}
const launch = () =>
  chromium.launch({
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
const origins = {};
let browser;
try {
  for (const [label, root] of Object.entries(roots)) {
    origins[label] = await serve(root);
    const assets = [];
    for (const name of await readdir(path.join(root, "assets"))) {
      if (!/\.(js|css)$/.test(name)) continue;
      const data = await readFile(path.join(root, "assets", name));
      assets.push({
        name,
        bytes: data.length,
        gzipBytes: gzipSync(data).length,
      });
    }
    output.versions[label] = {
      assets,
      totalJsBytes: assets
        .filter((a) => a.name.endsWith(".js"))
        .reduce((n, a) => n + a.bytes, 0),
      totalJsGzipBytes: assets
        .filter((a) => a.name.endsWith(".js"))
        .reduce((n, a) => n + a.gzipBytes, 0),
      loadsMs: [],
    };
  }
  browser = await launch();
  output.browserVersion = browser.version();
  for (let i = -1; i < 5; i++)
    for (const label of ["baseline", "current"]) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1100 },
      });
      await context.route("**/*", (route) =>
        route.request().url().startsWith(origins[label])
          ? route.continue()
          : route.abort(),
      );
      const page = await context.newPage();
      const start = performance.now();
      await page.goto(origins[label]);
      await page.locator(".discovery-image img").waitFor({ state: "visible" });
      const elapsed = Math.round(performance.now() - start);
      if (i >= 0) output.versions[label].loadsMs.push(elapsed);
      await context.close();
    }
  await browser.close();
  browser = undefined;
  for (const label of ["baseline", "current"]) {
    browser = await launch();
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
    });
    await page.route("**/*", (route) =>
      route.request().url().startsWith(origins[label])
        ? route.continue()
        : route.abort(),
    );
    await page.goto(origins[label] + "/?gallery");
    await page.waitForFunction(
      (expected) =>
        document.querySelectorAll(".atlas-card img").length === expected,
      label === "baseline" ? 44 : 132,
      { timeout: 120000 },
    );
    await page
      .locator(".atlas-card img")
      .evaluateAll((images) => Promise.all(images.map((img) => img.decode())));
    const session = await page.context().newCDPSession(page);
    await session.send("Performance.enable");
    await session.send("HeapProfiler.collectGarbage");
    const metrics = await session.send("Performance.getMetrics");
    const count = await page.locator(".atlas-card img").count();
    output.versions[label].gallery = {
      cards: count,
      retainedJsHeapMiB:
        Math.round(
          (metrics.metrics.find((m) => m.name === "JSHeapUsedSize").value /
            1048576) *
            10,
        ) / 10,
      summedProcessRssMiB: await rss(browser),
      decodedRgbaEstimateMiB:
        Math.round(((count * 280 * 260 * 4) / 1048576) * 10) / 10,
    };
    output.versions[label].medianMs = [...output.versions[label].loadsMs].sort(
      (a, b) => a - b,
    )[2];
    await browser.close();
    browser = undefined;
  }
  output.memoryCaveat =
    "RSS sums all CDP-reported Chromium processes and double-counts shared pages; it is not Chrome Task Manager private footprint or physical-phone GPU memory. RGBA is an estimate, not measured allocation.";
  await writeFile(
    "docs/qa/city-performance.json",
    JSON.stringify(output, null, 2) + "\n",
  );
  for (const [label, value] of Object.entries(output.versions))
    console.log(
      label,
      JSON.stringify({
        medianMs: value.medianMs,
        loadsMs: value.loadsMs,
        gallery: value.gallery,
        totalJsBytes: value.totalJsBytes,
      }),
    );
} finally {
  await browser?.close();
  for (const server of servers)
    await new Promise((resolve) => server.close(resolve));
}
