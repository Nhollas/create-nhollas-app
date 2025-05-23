import { defineWorkspace } from "vitest/config"

export default defineWorkspace([
  {
    extends: "vitest.config.mts",
    test: {
      setupFiles: "./vitest.setup.ts",
      include: [
        "src/server/**/*.{test,spec}.ts",
        "src/**/*.server.{test,spec}.ts",
      ],
      name: "server",
      environment: "node",
    },
  },
  {
    extends: "vitest.config.mts",
    optimizeDeps: {
      include: [
        "vitest-browser-react",
        "lucide-react",
        "next/image",
        "next/link",
        "@radix-ui/react-slot",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
      ],
    },
    test: {
      setupFiles: "./vitest.browser.setup.ts",
      include: [
        "src/browser/**/*.{test,spec}.{ts,tsx}",
        "src/**/*.browser.{test,spec}.{ts,tsx}",
      ],
      name: "browser",
      browser: {
        enabled: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
    },
  },
])
