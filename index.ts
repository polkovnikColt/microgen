#!/usr/bin/env node

import { extractAllConfigFiles, initNodeProjects } from "./src/init";
import { parseArgs } from "./src/parsers";
import { __PROJECT_METADATA__ } from "./src/shared/projectMetadata";

const { flags, variables } = parseArgs<{ path: string }>(process.argv);

if (!variables.path) {
  throw new Error('No path specified, you should use "-path=" variable!');
}

const configFiles = extractAllConfigFiles(variables.path);
console.log(configFiles);
console.log(__PROJECT_METADATA__);

initNodeProjects();
