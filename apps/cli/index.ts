import { cyan, green, red, yellow, bold, blue } from "picocolors"
import Commander from "commander"
import Conf from "conf"
import path from "path"
import prompts from "prompts"
import type { InitialReturnValue } from "prompts"
import { createApp, DownloadError } from "./create-app"
import { validateNpmName } from "./helpers/validate-pkg"
import { isFolderEmpty } from "./helpers/is-folder-empty"
import fs from "fs"

let projectPath: string = ""

const handleSigTerm = () => process.exit(0)

process.on("SIGINT", handleSigTerm)
process.on("SIGTERM", handleSigTerm)

const onPromptState = (state: {
  value: InitialReturnValue
  aborted: boolean
  exited: boolean
}) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write("\x1B[?25h")
    process.stdout.write("\n")
    process.exit(1)
  }
}

const program = new Commander.Command("create-nhollas-app")
  .version("0.1.0")
  .arguments("<project-directory>")
  .usage(`${green("<project-directory>")} [options]`)
  .action((name) => {
    projectPath = name
  })
  .allowUnknownOption()
  .parse(process.argv)

const packageManager = "npm"

async function run(): Promise<void> {
  const conf = new Conf({ projectName: "create-nhollas-app" })

  if (program.resetPreferences) {
    conf.clear()
    console.log(`Preferences reset successfully`)
    return
  }

  if (typeof projectPath === "string") {
    projectPath = projectPath.trim()
  }

  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: "text",
      name: "path",
      message: "What is your project named?",
      initial: "my-app",
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)))
        if (validation.valid) {
          return true
        }
        return "Invalid project name: " + validation.problems[0]
      },
    })

    if (typeof res.path === "string") {
      projectPath = res.path.trim()
    }
  }

  if (!projectPath) {
    console.log(
      "\nPlease specify the project directory:\n" +
        `  ${cyan(program.name())} ${green("<project-directory>")}\n` +
        "For example:\n" +
        `  ${cyan(program.name())} ${green("my-next-app")}\n\n` +
        `Run ${cyan(`${program.name()} --help`)} to see all options.`,
    )
    process.exit(1)
  }

  const resolvedProjectPath = path.resolve(projectPath)
  const projectName = path.basename(resolvedProjectPath)

  const validation = validateNpmName(projectName)
  if (!validation.valid) {
    console.error(
      `Could not create a project called ${red(
        `"${projectName}"`,
      )} because of npm naming restrictions:`,
    )

    validation.problems.forEach((p) =>
      console.error(`    ${red(bold("*"))} ${p}`),
    )
    process.exit(1)
  }

  if (program.example === true) {
    console.error(
      "Please provide an example name or url, otherwise remove the example option.",
    )
    process.exit(1)
  }

  /**
   * Verify the project dir is empty or doesn't exist
   */
  const root = path.resolve(resolvedProjectPath)
  const appName = path.basename(root)
  const folderExists = fs.existsSync(root)

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  const example = typeof program.example === "string" && program.example.trim()
  const preferences = (conf.get("preferences") || {}) as Record<
    string,
    boolean | string
  >

  try {
    await createApp({
      appPath: resolvedProjectPath,
    })
  } catch (reason) {
    if (!(reason instanceof DownloadError)) {
      throw reason
    }

    const res = await prompts({
      onState: onPromptState,
      type: "confirm",
      name: "builtin",
      message:
        `Could not download "${example}" because of a connectivity issue between your machine and GitHub.\n` +
        `Do you want to use the default template instead?`,
      initial: true,
    })
    if (!res.builtin) {
      throw reason
    }

    await createApp({
      appPath: resolvedProjectPath,
    })
  }
  conf.set("preferences", preferences)
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
