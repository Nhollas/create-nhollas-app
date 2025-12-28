import { install } from "./helpers/install"
import { copy } from "./helpers/copy"
import path from "path"
import { bold, cyan } from "picocolors"
import fs from "fs/promises"
import os from "os"

import { PackageManager } from "./helpers/get-pkg-manager"

export type TemplateType = "default"

export interface GetTemplateFileArgs {
  template: TemplateType
  file: string
}

export interface InstallTemplateArgs {
  appName: string
  root: string
  isOnline: boolean
  packageManager: PackageManager
}

/**
 * Get the file path for a given file in a template, e.g. "next.config.js".
 */
export const getTemplateFile = ({
  template,
  file,
}: GetTemplateFileArgs): string => {
  return path.join(__dirname, template, file)
}

/**
 * Install a Next.js internal template to a given `root` directory.
 */
export const installTemplate = async ({
  appName,
  root,
  isOnline,
  packageManager,
}: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`))
  console.log()
  /**
   * Copy the template files to the target directory.
   */
  const template = "default"
  const templatePath = path.join(__dirname, "templates", template)

  console.log("Initializing project with template:", template)

  await copy("**", root, {
    cwd: templatePath,
  })

  /** Create a package.json for the new project and write it to disk. */
  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      test: "pnpm test:unit && pnpm test:e2e",
      "test:unit": "vitest run",
      "test:unit:watch": "vitest",
      "test:e2e": "pnpm build && pnpm playwright",
      "test:coverage": "vitest run --coverage",
      playwright: "playwright test",
      lint: "eslint",
      "lint:fix": "eslint --fix",
      typecheck: "tsc --project tsconfig.json --pretty --noEmit",
      "format:check":
        'prettier --ignore-path .gitignore --check "**/*.+(js|json|ts|tsx)"',
      format:
        'prettier --ignore-path .gitignore --write "**/*.+(js|json|ts|tsx)"',
      validate: "pnpm typecheck && pnpm lint && pnpm format:check",
      fix: "pnpm lint:fix && pnpm format",
      "validate:test": "pnpm validate && pnpm test",
    },
    dependencies: {
      "@radix-ui/react-slot": "^1.2.4",
      "@tanstack/react-query": "^5.90.12",
      "class-variance-authority": "^0.7.1",
      clsx: "^2.1.1",
      "lucide-react": "^0.561.0",
      next: "^16.0.10",
      react: "19.2.3",
      "react-dom": "19.2.3",
      "tailwind-merge": "^3.4.0",
      zod: "^4.1.13",
    },
    devDependencies: {
      "@playwright/test": "^1.57.0",
      "@tailwindcss/postcss": "^4.1.18",
      "@types/node": "^25.0.2",
      "@types/react": "19.2.7",
      "@types/react-dom": "19.2.3",
      "@vitejs/plugin-react": "^5.1.2",
      "@vitest/browser-playwright": "^4.0.15",
      "@vitest/coverage-v8": "^4.0.15",
      "@vitest/eslint-plugin": "^1.5.2",
      eslint: "^9.39.2",
      "eslint-config-next": "^16.0.10",
      "eslint-plugin-jsx-a11y": "^6.10.2",
      "eslint-plugin-playwright": "^2.4.0",
      jsdom: "^27.3.0",
      msw: "^2.12.4",
      playwright: "^1.57.0",
      postcss: "^8.5.6",
      prettier: "^3.7.4",
      tailwindcss: "^4.1.18",
      "tw-animate-css": "^1.4.0",
      typescript: "^5.9.3",
      "typescript-eslint": "^8.49.0",
      vitest: "^4.0.15",
      "vitest-browser-react": "^2.0.2",
    },
  }

  // Create a package.json file in the new project directory.
  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  )

  const devDeps = Object.keys(packageJson.devDependencies).length

  console.log()
  console.log("\nInstalling dependencies:")
  for (const dependency in packageJson.dependencies)
    console.log(`- ${cyan(dependency)}`)

  if (devDeps) {
    console.log("\nInstalling devDependencies:")
    for (const dependency in packageJson.devDependencies)
      console.log(`- ${cyan(dependency)}`)
  }
  console.log()

  await install(packageManager, isOnline)
}
