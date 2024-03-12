import * as fs from "fs";
import { join } from "path";

import {
  osExecutableCommands,
  npmExecutableCommands,
  ChildProcessBuilder,
} from "../commands";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { MainConfigFile, MicroserviceConfig } from "../types";
import { logger } from "../logger";

export const getProjectConfigs = (dirPath: string): void => {
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

  const microservicesConfigs: MicroserviceConfig[] =
    parsedMainConfigFile.microservices;

  for (const config of microservicesConfigs) {
    const deepPath = join(path, config.name);

    __PROJECT_METADATA__.microservices.push({
      ...config,
      valid: true,
      folderName: config.name,
      absolutePath: deepPath,
    });

    if (fs.existsSync(deepPath)) {
      logger.warn(
        `Microservice ${config.name} already exists!!! If you want to regenerate if, please use --forced flag`
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
  __PROJECT_METADATA__.microservices.forEach(({ absolutePath }) => {
    new ChildProcessBuilder()
      .append(osExecutableCommands.changeDirectory(absolutePath))
      .append(npmExecutableCommands.npmInit())
      .exec();
  });
};
