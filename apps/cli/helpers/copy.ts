/* eslint-disable import/no-extraneous-dependencies */
import { async as glob } from "fast-glob"
import path from "path"
import fs from "fs"

interface CopyOption {
  cwd?: string
  rename?: (basename: string) => string
}

const identity = (x: string) => x

export const copy = async (
  src: string | string[],
  dest: string,
  { cwd, rename = identity }: CopyOption = {},
) => {
  const source = typeof src === "string" ? [src] : src

  if (source.length === 0 || !dest) {
    throw new TypeError("`src` and `dest` are required")
  }

  const sourceFiles = await glob(source, {
    cwd,
    dot: true,
    absolute: false,
    stats: false,
  })

  console.log("sourceFiles", sourceFiles)

  const destRelativeToCwd = cwd ? path.resolve(cwd, dest) : dest

  return Promise.all(
    sourceFiles.map(async (p) => {
      const dirname = path.dirname(p)

      const basename = rename(path.basename(p))

      const from = cwd ? path.resolve(cwd, p) : p

      let to = path.join(destRelativeToCwd, dirname, basename)

      // Ensure the destination directory exists
      await fs.promises.mkdir(path.dirname(to), { recursive: true })

      return fs.promises.copyFile(from, to)
    }),
  )
}
