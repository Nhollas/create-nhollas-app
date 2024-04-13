#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
import { cyan, green, red, yellow, bold, blue } from "picocolors";
import Commander from "commander";
import Conf from "conf";
import path from "path";
import prompts from "prompts";
import type { InitialReturnValue } from "prompts";
import checkForUpdate from "update-check";
import { createApp, DownloadError } from "./create-app";
import { getPkgManager } from "./helpers/get-pkg-manager";
import { validateNpmName } from "./helpers/validate-pkg";
import packageJson from "./package.json";
import ciInfo from "ci-info";
import { isFolderEmpty } from "./helpers/is-folder-empty";
import fs from "fs";

let projectPath: string = "";

const handleSigTerm = () => process.exit(0);

process.on("SIGINT", handleSigTerm);
process.on("SIGTERM", handleSigTerm);

const onPromptState = (state: {
  value: InitialReturnValue;
  aborted: boolean;
  exited: boolean;
}) => {
  if (state.aborted) {
    // If we don't re-enable the terminal cursor before exiting
    // the program, the cursor will remain hidden
    process.stdout.write("\x1B[?25h");
    process.stdout.write("\n");
    process.exit(1);
  }
};

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments("<project-directory>")
  .usage(`${green("<project-directory>")} [options]`)
  .action((name) => {
    projectPath = name;
  })
  .option(
    "--ts, --typescript",
    `

  Initialize as a TypeScript project. (default)
`
  )
  .option(
    "--js, --javascript",
    `

  Initialize as a JavaScript project.
`
  )
  .option(
    "--tailwind",
    `

  Initialize with Tailwind CSS config. (default)
`
  )
  .option(
    "--eslint",
    `

  Initialize with eslint config.
`
  )
  .option(
    "--app",
    `

  Initialize as an App Router project.
`
  )
  .option(
    "--src-dir",
    `

  Initialize inside a \`src/\` directory.
`
  )
  .option(
    "--import-alias <alias-to-configure>",
    `

  Specify import alias to use (default "@/*").
`
  )
  .option(
    "--use-npm",
    `

  Explicitly tell the CLI to bootstrap the application using npm
`
  )
  .option(
    "--use-pnpm",
    `

  Explicitly tell the CLI to bootstrap the application using pnpm
`
  )
  .option(
    "--use-yarn",
    `

  Explicitly tell the CLI to bootstrap the application using Yarn
`
  )
  .option(
    "--use-bun",
    `

  Explicitly tell the CLI to bootstrap the application using Bun
`
  )
  .option(
    "-e, --example [name]|[github-url]",
    `

  An example to bootstrap the app with. You can use an example name
  from the official Next.js repo or a GitHub URL. The URL can use
  any branch and/or subdirectory
`
  )
  .option(
    "--example-path <path-to-example>",
    `

  In a rare case, your GitHub URL might contain a branch name with
  a slash (e.g. bug/fix-1) and the path to the example (e.g. foo/bar).
  In this case, you must specify the path to the example separately:
  --example-path foo/bar
`
  )
  .option(
    "--reset-preferences",
    `

  Explicitly tell the CLI to reset any stored preferences
`
  )
  .allowUnknownOption()
  .parse(process.argv);

const packageManager = !!program.useNpm
  ? "npm"
  : !!program.usePnpm
    ? "pnpm"
    : !!program.useYarn
      ? "yarn"
      : !!program.useBun
        ? "bun"
        : getPkgManager();

async function run(): Promise<void> {
  const conf = new Conf({ projectName: "create-next-app" });

  if (program.resetPreferences) {
    conf.clear();
    console.log(`Preferences reset successfully`);
    return;
  }

  if (typeof projectPath === "string") {
    projectPath = projectPath.trim();
  }

  if (!projectPath) {
    const res = await prompts({
      onState: onPromptState,
      type: "text",
      name: "path",
      message: "What is your project named?",
      initial: "my-app",
      validate: (name) => {
        const validation = validateNpmName(path.basename(path.resolve(name)));
        if (validation.valid) {
          return true;
        }
        return "Invalid project name: " + validation.problems[0];
      },
    });

    if (typeof res.path === "string") {
      projectPath = res.path.trim();
    }
  }

  if (!projectPath) {
    console.log(
      "\nPlease specify the project directory:\n" +
        `  ${cyan(program.name())} ${green("<project-directory>")}\n` +
        "For example:\n" +
        `  ${cyan(program.name())} ${green("my-next-app")}\n\n` +
        `Run ${cyan(`${program.name()} --help`)} to see all options.`
    );
    process.exit(1);
  }

  const resolvedProjectPath = path.resolve(projectPath);
  const projectName = path.basename(resolvedProjectPath);

  const validation = validateNpmName(projectName);
  if (!validation.valid) {
    console.error(
      `Could not create a project called ${red(
        `"${projectName}"`
      )} because of npm naming restrictions:`
    );

    validation.problems.forEach((p) =>
      console.error(`    ${red(bold("*"))} ${p}`)
    );
    process.exit(1);
  }

  if (program.example === true) {
    console.error(
      "Please provide an example name or url, otherwise remove the example option."
    );
    process.exit(1);
  }

  /**
   * Verify the project dir is empty or doesn't exist
   */
  const root = path.resolve(resolvedProjectPath);
  const appName = path.basename(root);
  const folderExists = fs.existsSync(root);

  if (folderExists && !isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const example = typeof program.example === "string" && program.example.trim();
  const preferences = (conf.get("preferences") || {}) as Record<
    string,
    boolean | string
  >;
  /**
   * If the user does not provide the necessary flags, prompt them for whether
   * to use TS or JS.
   */
  if (!example) {
    const defaults: typeof preferences = {
      typescript: true,
      eslint: true,
      tailwind: true,
      app: true,
      srcDir: false,
      importAlias: "@/*",
      customizeImportAlias: false,
    };
    const getPrefOrDefault = (field: string) =>
      preferences[field] ?? defaults[field];

    const typescript = true;

    program.typescript = Boolean(typescript);
    program.javascript = !Boolean(typescript);
    preferences.typescript = Boolean(typescript);

    const eslint = true;

    program.eslint = Boolean(eslint);
    preferences.eslint = Boolean(eslint);

    const tailwind = true;

    program.tailwind = Boolean(tailwind);
    preferences.tailwind = Boolean(tailwind);

    if (
      !process.argv.includes("--src-dir") &&
      !process.argv.includes("--no-src-dir")
    ) {
      if (ciInfo.isCI) {
        program.srcDir = getPrefOrDefault("srcDir");
      } else {
        const styledSrcDir = blue("`src/` directory");
        const { srcDir } = await prompts({
          onState: onPromptState,
          type: "toggle",
          name: "srcDir",
          message: `Would you like to use ${styledSrcDir}?`,
          initial: getPrefOrDefault("srcDir"),
          active: "Yes",
          inactive: "No",
        });
        program.srcDir = Boolean(srcDir);
        preferences.srcDir = Boolean(srcDir);
      }
    }

    const appRouter = true;

    program.app = Boolean(appRouter);

    if (
      typeof program.importAlias !== "string" ||
      !program.importAlias.length
    ) {
      if (ciInfo.isCI) {
        // We don't use preferences here because the default value is @/* regardless of existing preferences
        program.importAlias = defaults.importAlias;
      } else {
        const styledImportAlias = blue("import alias");

        const { customizeImportAlias } = await prompts({
          onState: onPromptState,
          type: "toggle",
          name: "customizeImportAlias",
          message: `Would you like to customize the default ${styledImportAlias} (${defaults.importAlias})?`,
          initial: getPrefOrDefault("customizeImportAlias"),
          active: "Yes",
          inactive: "No",
        });

        if (!customizeImportAlias) {
          // We don't use preferences here because the default value is @/* regardless of existing preferences
          program.importAlias = defaults.importAlias;
        } else {
          const { importAlias } = await prompts({
            onState: onPromptState,
            type: "text",
            name: "importAlias",
            message: `What ${styledImportAlias} would you like configured?`,
            initial: getPrefOrDefault("importAlias"),
            validate: (value) =>
              /.+\/\*/.test(value)
                ? true
                : "Import alias must follow the pattern <prefix>/*",
          });
          program.importAlias = importAlias;
          preferences.importAlias = importAlias;
        }
      }
    }
  }

  try {
    await createApp({
      appPath: resolvedProjectPath,
      packageManager,
      srcDir: program.srcDir,
      importAlias: program.importAlias,
    });
  } catch (reason) {
    if (!(reason instanceof DownloadError)) {
      throw reason;
    }

    const res = await prompts({
      onState: onPromptState,
      type: "confirm",
      name: "builtin",
      message:
        `Could not download "${example}" because of a connectivity issue between your machine and GitHub.\n` +
        `Do you want to use the default template instead?`,
      initial: true,
    });
    if (!res.builtin) {
      throw reason;
    }

    await createApp({
      appPath: resolvedProjectPath,
      packageManager,
      srcDir: program.srcDir,
      importAlias: program.importAlias,
    });
  }
  conf.set("preferences", preferences);
}

const update = checkForUpdate(packageJson).catch(() => null);

async function notifyUpdate(): Promise<void> {
  try {
    const res = await update;
    if (res?.latest) {
      const updateMessage =
        packageManager === "yarn"
          ? "yarn global add create-next-app"
          : packageManager === "pnpm"
            ? "pnpm add -g create-next-app"
            : packageManager === "bun"
              ? "bun add -g create-next-app"
              : "npm i -g create-next-app";

      console.log(
        yellow(bold("A new version of `create-next-app` is available!")) +
          "\n" +
          "You can update by running: " +
          cyan(updateMessage) +
          "\n"
      );
    }
    process.exit();
  } catch {
    // ignore error
  }
}

run()
  .then(notifyUpdate)
  .catch(async (reason) => {
    console.log();
    console.log("Aborting installation.");
    if (reason.command) {
      console.log(`  ${cyan(reason.command)} has failed.`);
    } else {
      console.log(
        red("Unexpected error. Please report it as a bug:") + "\n",
        reason
      );
    }
    console.log();

    await notifyUpdate();

    process.exit(1);
  });
