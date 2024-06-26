import { join } from "path";
import * as fs from "fs";

import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { logger } from "../logger";
import { Databases, Languages, ORMs } from "../types";

const databaseConfig: Record<string, CallableFunction> = {
  [Databases.POSTGRES]: npmExecutableCommands.npmInstallPgDriver,
  [Databases.MYSQL]: npmExecutableCommands.npmInstallMySqlDriver,
};

const driverLanguagesConf: Record<
  string,
  Record<Databases, CallableFunction>
> = {
  [Languages.JS]: {
    [Databases.POSTGRES]: npmExecutableCommands.npmNoop,
    [Databases.MYSQL]: npmExecutableCommands.npmNoop,
  },
  [Languages.TS]: {
    [Databases.POSTGRES]: npmExecutableCommands.npmInstallPgTypes,
    [Databases.MYSQL]: npmExecutableCommands.npmInstallMySqlTypes,
  },
};

const ormConf: Record<ORMs, CallableFunction> = {
  [ORMs.PRISMA]: npmExecutableCommands.npmInstallPrisma,
  [ORMs.TYPEORM]: npmExecutableCommands.npmInstallTypeorm,
};

const ormInitConf: Record<ORMs, CallableFunction> = {
  [ORMs.PRISMA]: npmExecutableCommands.npmInitPrisma,
  [ORMs.TYPEORM]: npmExecutableCommands.npmNoop,
};

const databaseAliases: Record<Databases, string> = {
  [Databases.MYSQL]: "mysql",
  [Databases.POSTGRES]: "postgresql",
};

export const initializeDatabase = (): Promise<any>[] => {
  logger.info("Initializing database...");

  const promises = __PROJECT_METADATA__.microservices
    .filter(({ database }) => database)
    .map(({ absolutePath, database, language }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(
          osExecutableCommands.copyFile(
            join(
              __dirname,
              `../assets/databases/${database.driver}/docker-compose.yaml`
            ),
            absolutePath,
            "docker-compose.yaml"
          )
        )
        .append(databaseConfig[database.driver]())
        .append(driverLanguagesConf[language][database.driver]())

        .execAsync();
    });

  return promises;
};

export const initOrm = (): Promise<any>[] => {
  logger.info("Initializing orm clients...");

  const prismaExists = (absolutePath: string) =>
    fs.existsSync(join(absolutePath, "prisma"));

  const promises = __PROJECT_METADATA__.microservices
    .filter(({ database }) => database?.orm)
    .map(({ absolutePath, database }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(
          database.orm
            ? ormConf[database.orm]()
            : npmExecutableCommands.npmNoop()
        )
        .append(
          !prismaExists(absolutePath)
            ? ormInitConf[database.orm](databaseAliases[database.driver])
            : npmExecutableCommands.npmNoop()
        )
        .execAsync();
    });

  return promises;
};
