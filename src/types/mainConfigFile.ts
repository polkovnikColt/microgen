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
  exists: boolean;
  folderName: string;
  absolutePath: string;
  language: Languages;
  deps: string[];
  dockerFile?: boolean;
  devDeps: string[];
}

export interface MainConfigFile {
  appName: string;
  externalModules?: string[];
  gateway?: boolean;
  projectPath: string;
  microservices: MicroserviceConfig[];
}
