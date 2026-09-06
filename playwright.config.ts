import { defineConfig } from "@playwright/test";
const PORT = Number(process.env.PORT ?? 5273);
export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1440, height: 1100 },
    launchOptions: {
      args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    },
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: true,
  },
  workers: 1,
});
