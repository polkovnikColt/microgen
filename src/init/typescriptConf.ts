import { join } from "node:path";

import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { Languages, Frameworks } from "../types";

const frameworkConfigs: Record<string, CallableFunction> = {
  [Frameworks.EXPRESS]: npmExecutableCommands.npmInstallExpressTypes,
  [Frameworks.NEST]: npmExecutableCommands.npmNoop,
};

export const initializeTypescript = (): void => {
  __PROJECT_METADATA__.microservices
    .filter(({ language, exists }) => language === Languages.TS && !exists)
    .forEach(({ absolutePath, framework }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInitTypeScript())
        .append(frameworkConfigs[framework]())
        .append(
          osExecutableCommands.copyFile(
            join(__dirname, "../assets/typescript/tsconfig.json"),
            absolutePath
          )
        )
        .exec();
    });
};
