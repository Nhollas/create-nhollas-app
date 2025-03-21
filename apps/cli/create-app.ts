/* eslint-disable import/no-extraneous-dependencies */
import { green } from "picocolors"
import fs from "fs"
import path from "path"
import { isFolderEmpty } from "./helpers/is-folder-empty"
import { getOnline } from "./helpers/is-online"
import { isWriteable } from "./helpers/is-writeable"
import { installTemplate } from "./template"
import { PackageManager } from "./helpers/get-pkg-manager"

export async function createApp({
  appPath,
  packageManager,
}: {
  appPath: string
  packageManager: PackageManager
}): Promise<void> {
  const root = path.resolve(appPath)

  if (!(await isWriteable(path.dirname(root)))) {
    console.error(
      "The application path is not writable, please check folder permissions and try again.",
    )
    console.error(
      "It is likely you do not have write permissions for this folder.",
    )
    process.exit(1)
  }

  const appName = path.basename(root)

  fs.mkdirSync(root, { recursive: true })

  if (!isFolderEmpty(root, appName)) {
    process.exit(1)
  }

  const isOnline = await getOnline()

  console.log(`Creating a new Next.js app in ${green(root)}.`)
  console.log()
  process.chdir(root)
  /**
   * If an example repository is not provided for cloning, proceed
   * by installing from a template.
   */
  await installTemplate({
    root,
    isOnline,
    packageManager,
    appName,
  })

  console.log(`${green("Success!")} Created ${appName} at ${appPath}`)
}
