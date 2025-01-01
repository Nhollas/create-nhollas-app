#!/usr/bin/env node
import { cyan, red, bold } from "picocolors"
import { Command } from "commander"
import path from "path"
import { createApp } from "./create-app"
import { validateNpmName } from "./helpers/validate-pkg"
import { isFolderEmpty } from "./helpers/is-folder-empty"
import fs from "fs"
import { getPkgManager, PackageManager } from "./helpers/get-pkg-manager"

let projectPath: string = ""

const handleSigTerm = () => process.exit(0)

process.on("SIGINT", handleSigTerm)
process.on("SIGTERM", handleSigTerm)

const program = new Command("create-nhollas-app")
  .version("0.1.0")
  .argument("<directory>", "Project directory")
  .usage("<directory> [options]")
  .action((name) => {
    const validation = validateNpmName(path.basename(path.resolve(name)))
    if (!validation.valid) {
      console.error(
        `Could not create a project called ${red(
          `"${name}"`,
        )} because of npm naming restrictions:`,
      )

      validation.problems.forEach((p) =>
        console.error(`    ${red(bold("*"))} ${p}`),
      )
      process.exit(1)
    }

    projectPath = name
  })
  .option(
    "--use-npm",
    "Explicitly tell the CLI to bootstrap the application using npm.",
  )
  .option(
    "--use-pnpm",
    "Explicitly tell the CLI to bootstrap the application using pnpm.",
  )
  .parse(process.argv)

async function run(): Promise<void> {
  const options = program.opts()

  const packageManager: PackageManager = !!options.useNpm
    ? "npm"
    : !!options.usePnpm
      ? "pnpm"
      : getPkgManager()

  /**
   * Verify the project dir is empty or doesn't exist
   */
  const resolvedProjectPath = path.resolve(projectPath)
  const root = path.resolve(resolvedProjectPath)
  const appName = path.basename(root)
  const folderExists = fs.existsSync(root)

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  await createApp({
    appPath: resolvedProjectPath,
    packageManager,
  })
}

run().catch(async (reason) => {
  console.log()
  console.log("Aborting installation.")
  if (reason.command) {
    console.log(`  ${cyan(reason.command)} has failed.`)
  } else {
    console.log(
      red("Unexpected error. Please report it as a bug:") + "\n",
      reason,
    )
  }
  console.log()

  process.exit(1)
})
