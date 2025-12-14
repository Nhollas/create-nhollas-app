import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"

export default defineConfig({
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
  root: ".",

  define: {
    "process.env": JSON.stringify({}),
  },
  test: {
    globals: true,
    exclude: ["**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["html"],
      include: ["**/*.tsx"],
    },
    projects: [
      {
        extends: true,
        test: {
          setupFiles: "./vitest.setup.ts",
          include: ["src/**/*.server.{test,spec}.ts"],
          name: { label: "server", color: "green" },
          environment: "node",
        },
      },
      {
        extends: true,
        plugins: [react()],
        test: {
          setupFiles: "./vitest.browser.setup.ts",
          include: ["src/**/*.browser.{test,spec}.{ts,tsx}"],
          name: { label: "browser", color: "blue" },
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
})
