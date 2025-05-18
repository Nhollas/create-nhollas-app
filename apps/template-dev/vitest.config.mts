import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
  define: {
    "process.env": JSON.stringify({}),
  },
  root: ".",
  test: {
    globals: true,
    exclude: ["**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["html"],
      include: ["**/*.tsx"],
    },
  },
})
