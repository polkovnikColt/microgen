import { MicroserviceConfig } from "./mainConfigFile";

export interface ProjectMetadata {
  mainFileName: string;
  projectPath: string;
  projectFolderName: string;
  gateway?: boolean;
  externalModules?: string[];
  microservices: MicroserviceConfig[];
}
