export interface NpmCommands {
  npmNoop: () => string;
  npmInit: () => string;
  npmInstallDeps: (deps: string[]) => string;
  npmInstallDevDeps: (deps: string[]) => string;
  npmInitExpress: () => string;
  npmInitNest: () => string;
  npmInitTypeScript: () => string;
  npmInstallExpressTypes: () => string;
  npmInstallPgDriver: () => string;
  npmInstallPgTypes: () => string;
  npmInstallMySqlDriver: () => string;
  npmInstallMySqlTypes: () => string;
  npmInstallPrisma: () => string;
  npmInstallTypeorm: () => string;
  npmInitPrisma: (database: string) => string;
  npmInstallRabbitmq: () => string;
  npmInstallRabbitmqTypes: () => string;
  npmInstallKafka: () => string;
  npmInstallKafkaTypes: () => string;
}

export interface OsCommands {
  changeDirectory: (path: string) => string;
  copyFile: (toCopy: string, toInsert: string, fileName: string) => string;
  copyDirectory: (toCopy: string, toInsert: string) => string;
  renameFile: () => string;
  initGit: () => string;
  createDirectory: (dir: string) => string;
  osNoop: () => string;
  rmRf: (dir: string) => string;
}

export enum ObjectTypes {
  FILE = "-f",
  DIR = "-d",
}
