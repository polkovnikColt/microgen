import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { Frameworks, Languages } from "../types";
import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";

export const initializeNestApps = () => {
  __PROJECT_METADATA__.microservices
    .filter(({ framework }) => framework === Frameworks.NEST)
    .forEach(({ absolutePath, name }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInitNest(name))
        .exec();
    });
};

export const initializeExpressApps = () => {
  __PROJECT_METADATA__.microservices
    .filter(({ framework }) => framework === Frameworks.EXPRESS)
    .forEach(({ absolutePath, language }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInitExpress())
        .append(
          language === Languages.TS
            ? npmExecutableCommands.npmInstallExpressTypes()
            : ""
        )
        .exec();
    });
};

export const onModulesInit = () => {
  //   initializeNestApps();
  initializeExpressApps();
};
