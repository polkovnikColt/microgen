export const osExecutableCommands = {
  changeDirectory: (path: string) => `cd ${path}`,
  copyFile: (toCopy: string, toInsert: string) => `cp -i ${toCopy} ${toInsert}`,
  renameFile: () => ``,
  initGit: () => "git init && echo "" >> tsc",
  osNoop: () => "",
};
