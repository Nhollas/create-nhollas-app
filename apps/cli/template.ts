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
      "@opentelemetry/api": "^1.9.0",
      "@opentelemetry/auto-instrumentations-node": "^0.56.1",
      "@opentelemetry/context-zone": "^1.30.1",
      "@opentelemetry/core": "^1.30.1",
      "@opentelemetry/exporter-trace-otlp-http": "^0.57.2",
      "@opentelemetry/instrumentation": "^0.57.2",
      "@opentelemetry/instrumentation-fetch": "^0.57.2",
      "@opentelemetry/resources": "^1.30.1",
      "@opentelemetry/sdk-node": "^0.57.2",
      "@opentelemetry/sdk-trace-node": "^1.30.1",
      "@opentelemetry/sdk-trace-web": "^1.30.1",
      "@opentelemetry/semantic-conventions": "^1.30.0",
      "@radix-ui/react-slot": "^1.1.2",
      "@tanstack/react-query": "^5.68.0",
      "class-variance-authority": "^0.7.1",
      clsx: "^2.1.1",
      "lucide-react": "^0.482.0",
      next: "15.2.2",
      react: "19.0.0",
      "react-dom": "19.0.0",
      "tailwind-merge": "^3.0.2",
      "tailwindcss-animate": "^1.0.7",
      zod: "^3.24.2",
    },
    devDependencies: {
      "@playwright/test": "^1.51.0",
      "@tailwindcss/postcss": "^4.0.14",
      "@testing-library/jest-dom": "^6.6.3",
      "@testing-library/react": "^16.2.0",
      "@types/node": "^22",
      "@types/react": "19.0.10",
      "@types/react-dom": "19.0.4",
      "@vitejs/plugin-react": "^4.3.4",
      dotenv: "^16.4.7",
      eslint: "^9.22.0",
      "eslint-config-next": "^15.2.2",
      "eslint-config-prettier": "^10.1.1",
      "eslint-plugin-jsx-a11y": "^6.10.2",
      "eslint-plugin-playwright": "^2.2.0",
      "eslint-plugin-prettier": "^5.2.3",
      "eslint-plugin-testing-library": "^7.1.1",
      "eslint-plugin-vitest": "^0.5.4",
      jsdom: "^26.0.0",
      msw: "^2.7.3",
      "npm-run-all": "^4.1.5",
      postcss: "^8.5.3",
      prettier: "^3.5.3",
      tailwindcss: "^4.0.14",
      typescript: "^5.8.2",
      "typescript-eslint": "^8.26.1",
      vitest: "^2.1.8",
    },
  }

  // Create a package.json file in the new project directory.
  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  )

  // Create docker-compose.yaml file in the new project directory.
  await fs.writeFile(
    path.join(root, "infra", "docker-compose.yaml"),
    `name: ${appName}
services:
  jaeger-all-in-one:
    image: jaegertracing/all-in-one:latest
    restart: always
    ports:
      - "16686:16686" # UI port
      - "14250" # Collector port

  otel-collector:
    image: otel/opentelemetry-collector:0.67.0
    restart: always
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4318:4318" # OTLP HTTP receiver
    depends_on:
      - jaeger-all-in-one

  nginx:
    image: nginx:1.24-alpine
    restart: always
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    ports:
      - "8080:80"
    depends_on:
      - otel-collector`,
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
