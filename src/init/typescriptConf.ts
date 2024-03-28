import { join } from "node:path";

import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { Languages, Frameworks } from "../types";
import { logger } from "../logger";

const frameworkConfigs: Record<string, CallableFunction> = {
  [Frameworks.EXPRESS]: npmExecutableCommands.npmInstallExpressTypes,
  [Frameworks.NEST]: npmExecutableCommands.npmNoop,
};

export const initializeTypescript = (): Promise<any>[] => {
  const promises = __PROJECT_METADATA__.microservices
    .filter(({ language, exists }) => language === Languages.TS && !exists)
    .map(({ absolutePath, framework }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInitTypeScript())
        .append(frameworkConfigs[framework]())
        .append(
          osExecutableCommands.copyFile(
            join(__dirname, "../assets/typescript/tsconfig.json"),
            absolutePath
          )
        )
        .execAsync();
    });

  logger.info("Installing typescript");

  return promises;
};
