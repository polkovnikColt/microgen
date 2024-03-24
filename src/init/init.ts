import * as fs from "fs";
import { join } from "path";

import {
  osExecutableCommands,
  npmExecutableCommands,
  ChildProcessBuilder,
} from "../commands";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import {
  Frameworks,
  Languages,
  MainConfigFile,
  MicroserviceConfig,
} from "../types";
import { logger } from "../logger";
import { validateFile } from "../validate";

export const getProjectConfigs = (dirPath: string): void => {
  //TODO - FIX path
  const path = join(__dirname, `../../../../${dirPath}`);

  logger.info(`Reading path for current project ${path}`);

  __PROJECT_METADATA__.projectPath = path;
  __PROJECT_METADATA__.projectFolderName = dirPath;

  const mainConfigFile = fs.readFileSync(
    `${path}/${__PROJECT_METADATA__.mainFileName}`,
    {
      encoding: "utf8",
    }
  );

  const parsedMainConfigFile = JSON.parse(mainConfigFile) as MainConfigFile;

  validateFile(parsedMainConfigFile);

  const microservicesConfigs: MicroserviceConfig[] =
    parsedMainConfigFile.microservices;

  for (const config of microservicesConfigs) {
    const deepPath = join(path, config.name);

    __PROJECT_METADATA__.microservices.push({
      ...config,
      language:
        config.language ??
        (config.framework === Frameworks.NEST && Languages.DEFAULT),
      exists: fs.existsSync(`${deepPath}/package.json`),
      folderName: config.name,
      absolutePath: deepPath,
    });

    if (fs.existsSync(deepPath)) {
      logger.warn(
        `Microservice ${config.name} already exists!!! If you want to override it, please use --override flag`
      );
    }

    if (!fs.existsSync(deepPath)) {
      try {
        logger.info(`Create ${config.name} microservice...`);
        fs.mkdirSync(`${path}/${config.name}`);
        logger.info(`Microservice ${config.name} created successfully`);
      } catch (e) {
        const { message } = e as Error;
        logger.error(
          `Error when creating ${config.name}!!! Reason: ${message}`
        );
      }
    }
  }
};

export const initializeNodeProjects = (): void => {
  __PROJECT_METADATA__.microservices
    .filter(({ framework }) => framework !== Frameworks.NEST)
    .forEach(({ absolutePath }) => {
      new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(npmExecutableCommands.npmInit())
        .exec();
    });
};
