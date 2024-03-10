import * as fs from "fs";
import { join } from "path";
import { exec } from "node:child_process";

import { osExecutableCommands, npmExecutableCommands } from "../commands";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";

export const extractAllConfigFiles = (dirPath: string) => {
  const path = join(__dirname, `../../../../${dirPath}`);

  __PROJECT_METADATA__.projectPath = path;
  __PROJECT_METADATA__.projectFolderName = dirPath;

  const mainConfigFile = fs.readFileSync(`${path}/main.json`, {
    encoding: "utf8",
  });

  let configs: { main: string; [key: string]: string } = {
    main: mainConfigFile,
  };
  const wholeDirectory: string[] = fs.readdirSync(path);
  const foldersOnly = wholeDirectory.filter(
    (elem) => !fs.statSync(`${path}/${elem}`).isFile()
  );
  for (const folder of foldersOnly) {
    const deepPath: string = join(path, folder);

    __PROJECT_METADATA__.microservices.push({
      valid: true,
      folderName: folder,
      absolutePath: deepPath,
    });

    const microConfig = fs.readFileSync(deepPath + "/micro.json", {
      encoding: "utf8",
    });

    configs = { ...configs, [folder]: microConfig };
  }

  return configs;
};

export const initNodeProjects = () => {
  __PROJECT_METADATA__.microservices.map(({ absolutePath }) => {
    exec(
      `${osExecutableCommands.changeDirectory(
        absolutePath
      )} && ${npmExecutableCommands.npmInit()}`
    );
  });
};
