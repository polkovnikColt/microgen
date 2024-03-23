#!/usr/bin/env node

import { logger } from "./src/logger";
import { initializeTypescript, onModulesInit } from "./src/init";
import { getProjectConfigs, initializeNodeProjects } from "./src/init";
import { parseArgs } from "./src/parsers";
import { __PROJECT_METADATA__ } from "./src/shared/projectMetadata";

const { flags, variables } = parseArgs<{ path: string }>(process.argv);

if (!variables.path) {
  logger.error('No path specified, you should use "-path=" variable!');
  throw new Error('No path specified, you should use "-path=" variable!');
}

getProjectConfigs(variables.path);
initializeNodeProjects();
// initializeTypescript();
onModulesInit();
