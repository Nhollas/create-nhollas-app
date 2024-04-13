/* eslint-disable import/no-extraneous-dependencies */
import { async as glob } from "fast-glob";
import path from "path";
import fs from "fs";

interface CopyOption {
  cwd?: string;
  rename?: (basename: string) => string;
}

const identity = (x: string) => x;

export const copy = async (
  src: string | string[],
  dest: string,
  { cwd, rename = identity }: CopyOption = {}
) => {
  const source = typeof src === "string" ? [src] : src;

  if (source.length === 0 || !dest) {
    throw new TypeError("`src` and `dest` are required");
  }

  const sourceFiles = await glob(source, {
    cwd,
    dot: true,
    absolute: false,
    stats: false,
  });

  console.log("Source files", sourceFiles);

  const destRelativeToCwd = cwd ? path.resolve(cwd, dest) : dest;

  console.log("Source files", sourceFiles);

  const prefixDotWhitelist = ["vscode"];

  const prefixFolderWithDot = (
    dirname: string,
    basename: string,
    destRelativeToCwd: string
  ) => {
    return path.join(destRelativeToCwd, "." + dirname, basename);
  };

  return Promise.all(
    sourceFiles.map(async (p) => {
      const dirname = path.dirname(p);

      console.log("Dirname", dirname);

      const basename = rename(path.basename(p));

      console.log("Basename", basename);

      const from = cwd ? path.resolve(cwd, p) : p;

      console.log("From", from);
      let to = path.join(destRelativeToCwd, dirname, basename);

      console.log("To", to);

      if (prefixDotWhitelist.includes(dirname)) {
        console.log(
          "prefixFolderWithDot",
          prefixFolderWithDot(dirname, basename, destRelativeToCwd)
        );

        to = prefixFolderWithDot(dirname, basename, destRelativeToCwd);
      }

      // Ensure the destination directory exists
      await fs.promises.mkdir(path.dirname(to), { recursive: true });

      return fs.promises.copyFile(from, to);
    })
  );
};
