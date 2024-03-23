export enum Frameworks {
  EXPRESS = "express",
  NEST = "nest",
}

export enum Languages {
  JS = "js",
  TS = "ts",
  DEFAULT = "default",
}

export interface MicroserviceConfig {
  name: string;
  framework: Frameworks;
  valid: boolean;
  folderName: string;
  absolutePath: string;
  language: Languages;
}

export interface MainConfigFile {
  appName: string;
  externalModules?: { name: string; path: string }[];
  microservices: MicroserviceConfig[];
}
