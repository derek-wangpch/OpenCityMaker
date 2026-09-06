import { build } from "vite";
import { mkdir, copyFile, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const appid = process.env.WECHAT_APPID || "touristappid";
if (appid !== "touristappid" && !/^wx[0-9a-f]{16}$/i.test(appid))
  throw new Error(
    "WECHAT_APPID must be your wx + 16 hex character Mini Game AppID",
  );
const outDir = path.join(root, "dist-wechat");
await build({
  root,
  configFile: false,
  publicDir: false,
  build: {
    outDir,
    emptyOutDir: true,
    target: "es2018",
    minify: "esbuild",
    lib: {
      entry: path.join(root, "src/wechat/main.ts"),
      name: "CityMaker",
      formats: ["iife"],
      fileName: () => "game.js",
    },
  },
});
await mkdir(outDir, { recursive: true });
await copyFile(
  path.join(root, "wechat/game.json"),
  path.join(outDir, "game.json"),
);
await writeFile(
  path.join(outDir, "project.config.json"),
  JSON.stringify(
    {
      appid,
      projectname: "CityMaker",
      compileType: "game",
      miniprogramRoot: "./",
      setting: { es6: false, minified: false, urlCheck: true },
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Mini Game: ${outDir} (${(await stat(path.join(outDir, "game.js"))).size} bytes JS)`,
);
if (appid === "touristappid")
  console.warn(
    "Local prototype only: set WECHAT_APPID to build for preview/upload with your own account.",
  );
