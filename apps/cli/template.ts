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

  /*

    templatePath /Users/nhollas/Documents/Github/create-nhollas-app/apps/cli/dist/default/templates
    root /Users/nhollas/Documents/Github/create-nhollas-app/apps/cli/dist/my-app
  */

  await copy("**", root, {
    cwd: templatePath,
    rename(name) {
      switch (name) {
        case "gitignore":
        case "gitattributes":
        case "eslintignore":
        case "eslintrc.js":
        case "prettierrc":
        case "prettierignore":
        case "env.example":
        case "vscode": {
          return `.${name}`
        }
        default: {
          return name
        }
      }
    },
  })

  /** Create a package.json for the new project and write it to disk. */
  const packageJson = {
    name: appName,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: {
      dev: "next dev --turbopack",
      build: "next build",
      start: "next start",
      test: "npm-run-all test:unit test:e2e",
      "test:unit": "vitest run --reporter=verbose",
      "test:e2e": "npm-run-all build playwright",
      "test:coverage": "vitest --coverage",
      playwright: "playwright test",
      lint: "eslint --fix",
      typecheck: "tsc --project tsconfig.json --pretty --noEmit",
      format:
        'prettier --ignore-path .gitignore --write --list-different "**/*.+(js|json|ts|tsx)"',
      validate: "npm-run-all typecheck lint format",
      "validate:test": "npm-run-all validate test",
    },
    dependencies: {
      "@opentelemetry/auto-instrumentations-node": "^0.55.0",
      "@opentelemetry/context-zone": "^1.30.0",
      "@opentelemetry/core": "^1.30.0",
      "@opentelemetry/exporter-trace-otlp-http": "^0.57.0",
      "@opentelemetry/instrumentation": "^0.57.0",
      "@opentelemetry/instrumentation-fetch": "^0.57.0",
      "@opentelemetry/resources": "^1.30.0",
      "@opentelemetry/sdk-node": "^0.57.0",
      "@opentelemetry/sdk-trace-node": "^1.30.0",
      "@opentelemetry/sdk-trace-web": "^1.30.0",
      "@opentelemetry/semantic-conventions": "^1.28.0",
      clsx: "^2.1.1",
      next: "15.1.3",
      react: "19.0.0",
      "react-dom": "19.0.0",
      "tailwind-merge": "^2.6.0",
      "tailwindcss-animate": "^1.0.7",
      zod: "^3.24.1",
    },
    devDependencies: {
      "@playwright/test": "^1.49.1",
      "@testing-library/jest-dom": "^6.6.3",
      "@testing-library/react": "^16.1.0",
      "@types/lodash.isequal": "^4.5.8",
      "@types/node": "^22",
      "@types/react": "19.0.2",
      "@types/react-dom": "19.0.2",
      "@vitejs/plugin-react": "^4.3.4",
      dotenv: "^16.4.7",
      eslint: "^9.17.0",
      "eslint-config-next": "^15.1.3",
      "eslint-config-prettier": "^9.1.0",
      "eslint-plugin-jsx-a11y": "^6.10.2",
      "eslint-plugin-playwright": "^2.1.0",
      "eslint-plugin-prettier": "^5.2.1",
      "eslint-plugin-tailwindcss": "^3.17.5",
      "eslint-plugin-testing-library": "^7.1.1",
      "eslint-plugin-vitest": "^0.5.4",
      jsdom: "^25.0.1",
      "lodash.isequal": "^4.5.0",
      msw: "^2.7.0",
      "npm-run-all": "^4.1.5",
      prettier: "^3.4.2",
      tailwindcss: "^3.4.17",
      typescript: "^5.7.2",
      "typescript-eslint": "^8.19.0",
      vitest: "^2.1.8",
    },
  }

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
