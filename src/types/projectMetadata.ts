import { EventBrokers, MicroserviceConfig } from "./mainConfigFile";

export interface ProjectMetadata {
  mainFileName: string;
  projectPath: string;
  projectFolderName: string;
  gateway?: boolean;
  exists?: boolean;
  eventBroker?: {
    driver: EventBrokers;
  };
  externalModules?: string[];
  microservices: MicroserviceConfig[];
}
