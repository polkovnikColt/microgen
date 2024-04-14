import { join } from "path";
import { ObjectTypes, OsCommands } from "../types/commandTypes";

const ifExists = (
  path: string,
  executableCommand: string,
  typeFlag: ObjectTypes
) => {
  return `if [ ${typeFlag} ${path} ]; then
        echo "${path} exists."
      else
        ${executableCommand}
      fi`;
};

export const osExecutableCommands: OsCommands = {
  changeDirectory: (path: string) => `cd ${path}`,
  copyFile: (toCopy: string, toInsert: string, fileName: string) =>
    ifExists(
      join(toInsert, fileName),
      `cp -i -u ${toCopy} ${toInsert}`,
      ObjectTypes.FILE
    ),
  copyDirectory: (toCopy: string, toInsert: string) =>
    ifExists(toInsert, `cp -r -u ${toCopy} ${toInsert}`, ObjectTypes.DIR),
  renameFile: () => ``,
  initGit: () => `git init`,
  createDirectory: (dir: string) => `mkdir -p ${dir}`,
  rmRf: (dir: string) => `rm -rf ${dir}`,
  osNoop: () => "",
};
