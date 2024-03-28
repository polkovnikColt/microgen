import { join } from "path";

import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { ChildProcessBuilder, osExecutableCommands } from "../commands";
import { logger } from "../logger";

export const initializeDocker = (): Promise<any>[] => {
  const promises = __PROJECT_METADATA__.microservices
    .filter(({ dockerFile }) => dockerFile)
    .map(({ absolutePath }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(
          osExecutableCommands.copyFile(
            join(__dirname, "../assets/docker/Dockerfile"),
            absolutePath
          )
        )
        .execAsync();
    });

  logger.info("Initializing Dockerfile...");

  return promises;
};
