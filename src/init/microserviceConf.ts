import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { Frameworks, Languages } from "../types";
import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";
import { logger } from "../logger";
import { join } from "path";

const frameworkConfigs: Record<string, CallableFunction> = {
  [Frameworks.EXPRESS]: npmExecutableCommands.npmInitExpress,
  [Frameworks.NEST]: npmExecutableCommands.npmInitNest,
  [Languages.TS]: npmExecutableCommands.npmInitTypeScript,
  [Languages.JS]: npmExecutableCommands.npmNoop,
  [Languages.DEFAULT]: npmExecutableCommands.npmNoop,
};

const copyFileConfigs: Record<string, CallableFunction> = {
  [Languages.JS]: osExecutableCommands.osNoop,
  [Languages.DEFAULT]: osExecutableCommands.osNoop,
  [Languages.TS]: osExecutableCommands.copyFile,
};

export const initializeServices = () => {
  __PROJECT_METADATA__.microservices.forEach(
    ({ absolutePath, framework, language }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(frameworkConfigs[framework]())
        .append(frameworkConfigs[language]())
        .append(osExecutableCommands.initGit())
        .exec();
    }
  );
};

export const copyConfigFiles = () => {
  __PROJECT_METADATA__.microservices.forEach(({ absolutePath, language }) => {
    new ChildProcessBuilder()
      .append(osExecutableCommands.changeDirectory(absolutePath))
      .append(
        osExecutableCommands.copyFile(
          join(__dirname, "../assets/git/.gitignore.asset.txt"),
          absolutePath
        )
      )
      .append(
        copyFileConfigs[language](
          join(__dirname, "../assets/typescript/tsconfig.json.asset.txt"),
          absolutePath
        )
      )
      .exec();
  });
};

export const onModulesInit = () => {
  logger.info("Initializing Microservices...");
  initializeServices();
  copyConfigFiles();
};
