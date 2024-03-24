export const osExecutableCommands: Record<string, CallableFunction> = {
  changeDirectory: (path: string) => `cd ${path}`,
  copyFile: (toCopy: string, toInsert: string) => `cp -i ${toCopy} ${toInsert}`,
  copyDirectory: (toCopy: string, toInsert: string) =>
    `cp -r ${toCopy} ${toInsert}`,
  renameFile: () => ``,
  initGit: () => `git init`,
  createDirectory: (dir: string) => `mkdir ${dir}`,
  osNoop: () => "",
};
