#!/usr/bin/env node

import { logger } from "./src/logger";
import { onModulesInit, onProjectInit } from "./src/init";
import { getProjectConfigs, initializeNodeProjects } from "./src/init";
import { parseArgs } from "./src/parsers";
import { __PROJECT_METADATA__ } from "./src/shared/projectMetadata";

const { flags, variables } = parseArgs<{ path: string }>(process.argv);

if (!variables.path) {
  logger.error('No path specified, you should use "-path=" variable!');
  throw new Error('No path specified, you should use "-path=" variable!');
}

getProjectConfigs(variables.path);

const bootstrap = async () => {
  await Promise.all(initializeNodeProjects());
  await onModulesInit();
  await onProjectInit();
};

bootstrap();
