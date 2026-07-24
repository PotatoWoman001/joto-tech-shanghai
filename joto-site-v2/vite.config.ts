import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminOrigin = (env.ADMIN_API_ORIGIN || "https://admin.jotoai.com").replace(/\/$/, "");
  const apiProxy = {
    target: adminOrigin,
    changeOrigin: true,
    secure: true,
    headers: {
      "X-Forwarded-Host": "jotoglobal.com",
      "X-Forwarded-Proto": "https",
    },
  };

  return {
    base: mode === "github-pages" ? "/joto-tech-shanghai/" : "/",
    plugins: [react()],
    server: {
      proxy: {
        "/api/captcha": apiProxy,
        "/api/contact": apiProxy,
      },
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: "./src/test/setup.ts",
      css: true,
      exclude: ["functions/**", "node_modules/**", "dist/**"],
    },
  };
});
