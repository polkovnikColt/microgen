export const osExecutableCommands = {
  changeDirectory: (path: string) => `cd ${path}`,
  copyFile: (toCopy: string, toInsert: string) => `cp ${toCopy} ${toInsert}`,
};
