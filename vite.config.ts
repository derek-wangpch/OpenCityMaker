import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Declared narrowly rather than pulling in @types/node, which would put Node
// globals in scope for `src` as well.
declare const process: { env: Record<string, string | undefined> };
const PORT = Number(process.env.PORT ?? 5273);
export default defineConfig({
  plugins: [react()],
  // Dedicated port: the default 5173 collides with other local dev servers.
  // strictPort makes a conflict fail loudly instead of silently serving another app.
  // PORT lets a second checkout run its own server; without it, Playwright's
  // reuseExistingServer would quietly test this checkout against the other one.
  server: { port: PORT, strictPort: true },
  preview: { port: PORT, strictPort: true },
  build: { rollupOptions: { output: { manualChunks: { three: ["three"] } } } },
});
