import { join } from "path";

import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { ChildProcessBuilder, osExecutableCommands } from "../commands";
import { logger } from "../logger";

export const initializeDocker = (): Promise<any>[] => {
  logger.info("Initializing Dockerfile...");

  const promises = __PROJECT_METADATA__.microservices
    .filter(({ dockerFile }) => dockerFile)
    .map(({ absolutePath, database }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(
          osExecutableCommands.copyFile(
            join(__dirname, "../assets/docker/Dockerfile"),
            absolutePath,
            "Dockerfile"
          )
        )
        .append(
          !database
            ? osExecutableCommands.copyFile(
                join(__dirname, "../assets/docker/docker-compose.yaml"),
                absolutePath,
                "docker-compose.yaml"
              )
            : osExecutableCommands.osNoop()
        )
        .execAsync();
    });

  return promises;
};
