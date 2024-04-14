import { Databases } from "../types";
import { NpmCommands } from "../types/commandTypes";

export const npmExecutableCommands: NpmCommands = {
  npmNoop: () => "",
  npmInit: () => "npm init -y",
  npmInstallDeps: (deps: string[]) =>
    deps.length ? `npm i ${deps.join(" ")}` : "",
  npmInstallDevDeps: (deps: string[]) =>
    deps.length ? `npm i --save-dev ${deps.join(" ")}` : "",
  npmInitExpress: () => "npm i --reset-cache express cors",
  npmInitNest: () => `npm i -g @nestjs/cli && nest new . -p npm `,
  npmInitTypeScript: () => "npm i --save-dev @types/node typescript",
  npmInstallExpressTypes: () => "npm i --save-dev @types/express",
  npmInstallPgDriver: () => "npm i pg",
  npmInstallPgTypes: () => "npm i --save-dev @types/pg",
  npmInstallMySqlDriver: () => "npm i mysql",
  npmInstallMySqlTypes: () => "npm i --save-dev @types/mysql",
  npmInstallPrisma: () => "npm i @prisma/client",
  npmInstallTypeorm: () => "npm i typeorm",
  npmInitPrisma: (database: string) =>
    `npx prisma init --datasource-provider ${database}`,
};
