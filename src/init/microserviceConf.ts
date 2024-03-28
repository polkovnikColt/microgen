import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { Frameworks, Languages } from "../types";
import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";
import { logger } from "../logger";
import { initializeTypescript } from "./typescriptConf";
import { join } from "path";
import { printChildProcessOutput } from "../utils";
import { initializeDocker } from "./dockerConf";

const frameworkConfigs: Record<string, CallableFunction> = {
  [Frameworks.EXPRESS]: npmExecutableCommands.npmInitExpress,
  [Frameworks.NEST]: npmExecutableCommands.npmInitNest,
  [Languages.TS]: npmExecutableCommands.npmInitTypeScript,
  [Languages.JS]: npmExecutableCommands.npmNoop,
  [Languages.DEFAULT]: npmExecutableCommands.npmNoop,
};

export const initializeServices = (): Promise<any>[] => {
  const promises = __PROJECT_METADATA__.microservices
    .filter(({ exists }) => !exists)
    .map(({ absolutePath, framework, language }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(frameworkConfigs[framework]())
        .append(frameworkConfigs[language]())
        .append(osExecutableCommands.initGit())
        .execAsync();
    });

  logger.info("Initializing frameworks...");

  return promises;
};

export const copyConfigFiles = (): Promise<any>[] => {
  const promises = __PROJECT_METADATA__.microservices
    .filter(({ framework, exists }) => framework !== Frameworks.NEST && !exists)
    .map(({ absolutePath }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(
          osExecutableCommands.copyFile(
            join(__dirname, "../assets/git/.gitignore"),
            absolutePath
          )
        )
        .execAsync();
    });

  logger.info("Copying files...");

  return promises;
};

export const installDeps = (): Promise<any>[] => {
  const promises = __PROJECT_METADATA__.microservices.map(
    ({ absolutePath, deps, devDeps }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInstallDeps(deps))
        .append(npmExecutableCommands.npmInstallDevDeps(devDeps))
        .execAsync();
    }
  );
  logger.info("Installing dependencies...");

  return promises;
};

export const copyMVCFiles = (): Promise<any>[] => {
  const promises = __PROJECT_METADATA__.microservices
    .filter(({ framework, exists }) => framework !== Frameworks.NEST && !exists)
    .map(({ absolutePath, language, framework }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(osExecutableCommands.createDirectory("src"))
        .append(
          osExecutableCommands.copyDirectory(
            join(__dirname, `../assets/${framework}/${language}/*`),
            join(absolutePath, "src")
          )
        )
        .execAsync();
    });
  logger.info("Copying main server files...");

  return promises;
};

export const onModulesInit = async () => {
  logger.info("Initializing Microservices...");

  const responsesInitServices = await Promise.all(initializeServices());
  printChildProcessOutput(responsesInitServices);

  const responsesInitTypeScript = await Promise.all(initializeTypescript());
  printChildProcessOutput(responsesInitTypeScript);

  const responsesCopyFiles = await Promise.all(copyConfigFiles());
  printChildProcessOutput(responsesCopyFiles);

  const responsesCopyMVCFiles = await Promise.all(copyMVCFiles());
  printChildProcessOutput(responsesCopyMVCFiles);

  const responsesInstallDeps = await Promise.all(installDeps());
  printChildProcessOutput(responsesInstallDeps);

  const responsesInitDocker = await Promise.all(initializeDocker());
  printChildProcessOutput(responsesInitDocker);
};
