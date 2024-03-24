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

const frameworkConfigs: Record<string, CallableFunction> = {
  [Frameworks.EXPRESS]: npmExecutableCommands.npmInitExpress,
  [Frameworks.NEST]: npmExecutableCommands.npmInitNest,
  [Languages.TS]: npmExecutableCommands.npmInitTypeScript,
  [Languages.JS]: npmExecutableCommands.npmNoop,
  [Languages.DEFAULT]: npmExecutableCommands.npmNoop,
};

export const initializeServices = () => {
  __PROJECT_METADATA__.microservices
    .filter(({ exists }) => !exists)
    .forEach(({ absolutePath, framework, language }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(frameworkConfigs[framework]())
        .append(frameworkConfigs[language]())
        .append(osExecutableCommands.initGit())
        .exec();
    });
};

export const copyConfigFiles = () => {
  __PROJECT_METADATA__.microservices.forEach(({ absolutePath }) => {
    new ChildProcessBuilder()
      .append(osExecutableCommands.changeDirectory(absolutePath))
      .append(
        osExecutableCommands.copyFile(
          join(__dirname, "../assets/git/.gitignore"),
          absolutePath
        )
      )
      .exec();
  });
};

export const installDeps = () => {
  __PROJECT_METADATA__.microservices.forEach(
    ({ absolutePath, deps, devDeps }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInstallDeps(deps))
        .append(npmExecutableCommands.npmInstallDevDeps(devDeps))
        .exec();
    }
  );
};

export const copyMVCFiles = () => {
  __PROJECT_METADATA__.microservices
    .filter(({ framework, exists }) => framework !== Frameworks.NEST && !exists)
    .forEach(({ absolutePath, language, framework }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(osExecutableCommands.createDirectory("src"))
        .append(
          osExecutableCommands.copyDirectory(
            join(__dirname, `../assets/${framework}/${language}/*`),
            join(absolutePath, "src")
          )
        )
        .exec();
    });
};

export const onModulesInit = () => {
  logger.info("Initializing Microservices...");
  initializeServices();

  setTimeout(() => {
    logger.info("Initializing languages settings...");
    initializeTypescript();
  }, 5000);

  setTimeout(() => {
    logger.info("Copying config files...");
    copyConfigFiles();
  }, 10000);

  setTimeout(() => {
    logger.info("Copying MVC files...");
    copyMVCFiles();
  }, 20000);

  setTimeout(() => {
    logger.info("Installing deps...");
    installDeps();
  }, 30000);
};
