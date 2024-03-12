import { exec } from "node:child_process";
import { join } from "node:path";

import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { Languages } from "../types";

export const initializeTypescript = (): void => {
  __PROJECT_METADATA__.microservices
    .filter(({ language }) => language === Languages.TS)
    .forEach(({ absolutePath }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInitTypeScript())
        .append(
          osExecutableCommands.copyFile(
            join(__dirname, "../assets/typescript/tsconfig.json"),
            absolutePath
          )
        )
        .exec();
    });
};
