import { install } from "../helpers/install"
import { copy } from "../helpers/copy"

import { async as glob } from "fast-glob"
import os from "os"
import fs from "fs/promises"
import path from "path"
import { cyan, bold } from "picocolors"
import { Sema } from "async-sema"

import { GetTemplateFileArgs, InstallTemplateArgs } from "./types"

/**
 * Get the file path for a given file in a template, e.g. "next.config.js".
 */
export const getTemplateFile = ({
  template,
  mode,
  file,
}: GetTemplateFileArgs): string => {
  return path.join(__dirname, template, mode, file)
}

export const SRC_DIR_NAMES = [
  "app",
  "checkly",
  "components",
  "playwright",
  "public",
  "test",
  "instrumentation.node.ts",
  "instrumentation.ts",
  "middleware.ts",
]

/**
 * Install a Next.js internal template to a given `root` directory.
 */
export const installTemplate = async ({
  appName,
  root,
  packageManager,
  isOnline,
  srcDir,
  importAlias,
}: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`))

  const template = "default"

  /**
   * Copy the template files to the target directory.
   */
  console.log("\nInitializing project with template:", template, "\n")

  // TODO: Could this be, original has mode a third argument?
  const templatePath = path.join(__dirname, template)

  console.log("Copying files from:", templatePath)
  const copySource = ["**"]

  await copy(copySource, root, {
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
        case "vscode":
        case "eslintrc.json": {
          return `.${name}`
        }
        // README.md is ignored by webpack-asset-relocator-loader used by ncc:
        // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
        case "README-template.md": {
          return "README.md"
        }
        default: {
          return name
        }
      }
    },
  })

  const tsconfigFile = path.join(root, "tsconfig.json")
  await fs.writeFile(
    tsconfigFile,
    (await fs.readFile(tsconfigFile, "utf8"))
      .replace(
        `"@/*": ["./*"]`,
        srcDir ? `"@/*": ["./src/*"]` : `"@/*": ["./*"]`,
      )
      .replace(`"@/*":`, `"${importAlias}":`),
  )

  // update import alias in any files if not using the default
  if (importAlias !== "@/*") {
    const files = await glob("**/*", {
      cwd: root,
      dot: true,
      stats: false,
      // We don't want to modify compiler options in [ts/js]config.json
      // and none of the files in the .git folder
      ignore: ["tsconfig.json", "jsconfig.json", ".git/**/*"],
    })

    const writeSema = new Sema(8, { capacity: files.length })
    await Promise.all(
      files.map(async (file) => {
        await writeSema.acquire()
        const filePath = path.join(root, file)
        if ((await fs.stat(filePath)).isFile()) {
          await fs.writeFile(
            filePath,
            (await fs.readFile(filePath, "utf8")).replace(
              new RegExp(`@/`, "g"),
              `${importAlias.replace(/\*/g, "")}`,
            ),
          )
        }
        await writeSema.release()
      }),
    )

    const vitestConfigFile = path.join(root, "vitest.config.mts")

    // Remove ending /* from the import alias
    await fs.writeFile(
      vitestConfigFile,
      (await fs.readFile(vitestConfigFile, "utf8")).replace(
        `find: "@"`,
        `find: "${importAlias.slice(0, -2)}"`,
      ),
    )
  }

  if (srcDir) {
    await fs.mkdir(path.join(root, "src"), { recursive: true })
    await Promise.all(
      SRC_DIR_NAMES.map(async (file) => {
        await fs
          .rename(path.join(root, file), path.join(root, "src", file))
          .catch((err) => {
            if (err.code !== "ENOENT") {
              throw err
            }
          })
      }),
    )

    // Change components.json     "css": "app/globals.css",

    const componentsFile = path.join(root, "components.json")

    await fs.writeFile(
      componentsFile,
      (await fs.readFile(componentsFile, "utf8")).replace(
        `"css": "app/globals.css"`,
        `"css": "src/app/globals.css"`,
      ),
    )

    const vitestConfigFile = path.join(root, "vitest.config.mts")

    await fs.writeFile(
      vitestConfigFile,
      (await fs.readFile(vitestConfigFile, "utf8")).replace(
        `replacement: resolve(__dirname, ".")`,
        `replacement: resolve(__dirname, "./src")`,
      ),
    )

    await fs.writeFile(
      vitestConfigFile,
      (await fs.readFile(vitestConfigFile, "utf8")).replace(
        `"app/**/*.test.{ts,tsx}"`,
        `"src/**/*.test.{ts,tsx}"`,
      ),
    )

    // // Change the `Get started by editing pages/index` / `app/page` to include `src`
    // const indexPageFile = path.join("app", `(routes)`, `page.tsx`);

    // await fs.writeFile(
    //   indexPageFile,
    //   (await fs.readFile(indexPageFile, "utf8")).replace(
    //     "app/(routes)/page",
    //     "src/app/(routes)/page"
    //   )
    // );

    const tailwindConfigFile = path.join(root, "tailwind.config.js")
    await fs.writeFile(
      tailwindConfigFile,
      (await fs.readFile(tailwindConfigFile, "utf8")).replace(
        /\.\/(\w+)\/\*\*\/\*\.\{js,ts,jsx,tsx,mdx\}/g,
        "./src/$1/**/*.{js,ts,jsx,tsx,mdx}",
      ),
    )

    // const jestConfigPath = path.join(root, "jest.config.mjs");
    // let jestConfigContent = await fs.readFile(jestConfigPath, "utf-8");

    // // Replace the moduleNameMapper property
    // jestConfigContent = jestConfigContent.replace(
    //   `"^@/(.*)$": "<rootDir>/$1"`,
    //   `"^@/(.*)$": "<rootDir>/src/$1"`
    // );

    // jestConfigContent = jestConfigContent.replace(
    //   /"<rootDir>\/\*\*\/\*\.(test|spec)\.(ts|tsx)"/g,
    //   `"<rootDir>/src/**/*.$1.$2"`
    // );

    // // Write the updated content back to the jest.config.mjs file
    // await fs.writeFile(jestConfigPath, jestConfigContent);

    const playwrightConfigPath = path.join(root, "playwright.config.ts")
    let playwrightConfigContent = await fs.readFile(
      playwrightConfigPath,
      "utf-8",
    )

    // Replace the testDir property
    playwrightConfigContent = playwrightConfigContent.replace(
      `testDir: "./playwright"`,
      `testDir: "./src/playwright"`,
    )

    // Replace the globalSetup property
    playwrightConfigContent = playwrightConfigContent.replace(
      `globalSetup: require.resolve("./playwright/global-setup.ts")`,
      `globalSetup: require.resolve("./src/playwright/global-setup.ts")`,
    )

    // Replace the globalTeardown property
    playwrightConfigContent = playwrightConfigContent.replace(
      `globalTeardown: require.resolve("./playwright/global-teardown.ts")`,
      `globalTeardown: require.resolve("./src/playwright/global-teardown.ts")`,
    )

    // Write the updated content back to the playwright config file
    await fs.writeFile(playwrightConfigPath, playwrightConfigContent)

    const playwrightSetupPath = path.join(root, "src", "playwright", "setup.ts")

    // replace "src/playwright/state" with "playwright/state"

    await fs.writeFile(
      playwrightSetupPath,
      (await fs.readFile(playwrightSetupPath, "utf8")).replace(
        `"playwright/state"`,
        `"src/playwright/state"`,
      ),
    )

    // Read the .eslintignore file
    // const eslintignorePath = path.join(root, ".eslintignore");
    // let eslintignoreContent = await fs.readFile(eslintignorePath, "utf-8");

    // // Add the src/ prefix to the 'components/ui' line
    // eslintignoreContent = eslintignoreContent.replace(
    //   /^components\/ui/gm,
    //   "src/components/ui"
    // );

    // Write the updated content back to the .eslintignore file
    // await fs.writeFile(eslintignorePath, eslintignoreContent);
  }

  const elint = srcDir
    ? "eslint --fix --ext .js,.ts,.tsx ./src --ignore-path .eslintignore"
    : "eslint --fix --ext .js,.ts,.tsx ./ --ignore-path .eslintignore"

  /** Create a package.json for the new project and write it to disk. */
  const packageJson: any = {
    name: appName,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "next dev",
      build: "next build",
      start: "next start",
      playwright: "playwright test",
      "test:e2e": "npm-run-all build playwright",
      "test:vitest": "vitest run --reporter=verbose",
      "test:coverage": "vitest --coverage",
      prettier:
        'prettier --ignore-path .gitignore --write "**/*.+(js|json|ts|tsx)"',
      format: "npm run prettier -- --write",
      "check:lint": elint,
      "check:types": "tsc --project tsconfig.json --pretty --noEmit",
      "check:format": "npm run prettier -- --list-different",
      "validate-and-test":
        "npm-run-all check:types check:format check:lint test:vitest test:e2e",
      validate: "npm-run-all check:types check:lint check:format",
      prepare: "husky",
    },
    /**
     * Default dependencies.
     */
    dependencies: {
      "@clerk/nextjs": "^4.29.12",
      "@hookform/resolvers": "^3.3.4",
      "@launchdarkly/node-server-sdk": "^9.2.2",
      "@opentelemetry/exporter-trace-otlp-http": "^0.50.0",
      "@opentelemetry/resources": "^1.23.0",
      "@opentelemetry/sdk-node": "^0.51.1",
      "@opentelemetry/sdk-trace-node": "^1.23.0",
      "@opentelemetry/semantic-conventions": "^1.23.0",
      "@radix-ui/react-alert-dialog": "^1.0.5",
      "@radix-ui/react-icons": "^1.3.0",
      "@radix-ui/react-label": "^2.0.2",
      "@radix-ui/react-slot": "^1.0.2",
      "@tanstack/react-query": "^5.29.0",
      axios: "^1.6.8",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.1.0",
      "framer-motion": "^11.0.25",
      "lucide-react": "^0.365.0",
      next: "^14.1.4",
      "next-themes": "^0.3.0",
      react: "^18.2.0",
      "react-dom": "^18",
      "react-error-boundary": "^4.0.13",
      "react-hook-form": "^7.51.2",
      "react-textarea-autosize": "^8.5.3",
      sonner: "^1.4.41",
      "tailwind-merge": "^2.2.2",
      "tailwindcss-animate": "^1.0.7",
      zod: "^3.22.4",
    },
    devDependencies: {
      "@faker-js/faker": "^8.4.1",
      "@next/eslint-plugin-next": "^14.1.4",
      "@playwright/test": "^1.43.0",
      "@testing-library/jest-dom": "^6.4.2",
      "@testing-library/react": "^14.2.2",
      "@types/node": "^20",
      "@types/react": "^18.2.74",
      "@types/react-dom": "^18",
      "@typescript-eslint/eslint-plugin": "^7.5.0",
      "@typescript-eslint/parser": "^7.5.0",
      "@vitejs/plugin-react": "^4.2.1",
      autoprefixer: "^10.4.19",
      checkly: "^4.6.3",
      dotenv: "^16.4.5",
      eslint: "^8.57.0",
      "eslint-config-next": "^14.1.4",
      "eslint-config-prettier": "^9.1.0",
      "eslint-import-resolver-typescript": "^3.6.1",
      "eslint-plugin-import": "^2.29.1",
      "eslint-plugin-jsx-a11y": "^6.8.0",
      "eslint-plugin-playwright": "^1.5.4",
      "eslint-plugin-prettier": "^5.1.3",
      "eslint-plugin-react": "^7.34.1",
      "eslint-plugin-react-hooks": "^4.6.0",
      "eslint-plugin-testing-library": "^6.2.0",
      husky: "^9.0.11",
      jsdom: "^24.0.0",
      msw: "^2.2.13",
      "npm-run-all": "^4.1.5",
      postcss: "^8.4.38",
      prettier: "^3.2.5",
      tailwindcss: "^3.4.3",
      typescript: "^5.4.4",
      undici: "^6.11.1",
      vitest: "^1.4.0",
    },
  }

  const devDeps = Object.keys(packageJson.devDependencies).length
  if (!devDeps) delete packageJson.devDependencies

  await fs.writeFile(
    path.join(root, "package.json"),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  )

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

export * from "./types"
