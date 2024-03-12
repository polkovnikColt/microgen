import { MicroserviceConfig } from "./mainConfigFile";

export interface ProjectMetadata {
  mainFileName: string;
  projectPath: string;
  projectFolderName: string;
  microservices: MicroserviceConfig[];
}
