import jsxA11yPlugin from "eslint-plugin-jsx-a11y"
import vitestPlugin from "eslint-plugin-vitest"
import playwrightPlugin from "eslint-plugin-playwright"
import prettierPlugin from "eslint-plugin-prettier"
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config(
  {
    ignores: [".next"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.e2e.ts"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    plugins: { vitest: vitestPlugin },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.e2e.ts"],
    plugins: { playwright: playwrightPlugin },
    rules: {
      ...playwrightPlugin.configs.recommended.rules,
      "playwright/expect-expect": "off",
    },
  },
)
