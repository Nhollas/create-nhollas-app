import { install } from "../helpers/install"
import { copy } from "../helpers/copy"

import path from "path"
import { bold } from "picocolors"

import { GetTemplateFileArgs, InstallTemplateArgs } from "./types"

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
  root,
  isOnline,
}: InstallTemplateArgs) => {
  /**
   * Copy the template files to the target directory.
   */
  const template = "default"
  console.log("\nInitializing project with template:", template, "\n")

  // TODO: Could this be, original has mode a third argument?
  const templatePath = path.join(__dirname, template)

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

  console.log("\nInstalling dependencies:")
  console.log()

  await install("npm", isOnline)
}

export * from "./types"
