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
  devDeps: string[];
}

export interface MainConfigFile {
  appName: string;
  externalModules?: { name: string; path: string }[];
  microservices: MicroserviceConfig[];
}
