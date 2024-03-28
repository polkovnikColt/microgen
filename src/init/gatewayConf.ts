import * as fs from "fs";
import { join } from "path";

import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";

const moduleExportsAppend = (src: string) => `
    // Map of aliases to service URLs
    // EXAMPLE DATA ONLY, CHANGE TO YOUR OWN CONFIG 
    // replace {{PORT}} with corresponding ports
    module.exports = ${src}
`;

export const initializeGateway = async () => {
  const microservicesLocalUrls: Record<string, string> =
    __PROJECT_METADATA__.microservices.reduce((acc, { name }) => {
      return {
        ...acc,
        [name]: `http://localhost:{{PORT}},`,
      };
    }, {});

  const serviceMapFileContent = moduleExportsAppend(
    JSON.stringify(microservicesLocalUrls)
  );

  const { projectPath } = __PROJECT_METADATA__;

  const gatewayPath = `${projectPath}/gateway`;

  await new ChildProcessBuilder()
    .append(osExecutableCommands.changeDirectory(projectPath))
    .append(osExecutableCommands.createDirectory(gatewayPath))
    .append(
      osExecutableCommands.copyDirectory(
        join(__dirname, "../assets/gateway/*"),
        gatewayPath
      )
    )
    .execAsync();

  await new ChildProcessBuilder()
    .append(osExecutableCommands.changeDirectory(gatewayPath))
    .append(npmExecutableCommands.npmInit())
    .append(npmExecutableCommands.npmInitExpress())
    .append(osExecutableCommands.initGit())
    .append(
      osExecutableCommands.copyFile(
        join(__dirname, "../assets/git/.gitignore"),
        gatewayPath
      )
    )
    .execAsync();

  fs.writeFileSync(
    `${projectPath}/gateway/serviceMap.js`,
    serviceMapFileContent
  );
};
