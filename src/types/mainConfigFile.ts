export enum Frameworks {
  EXPRESS = "express",
  NEST = "nest",
}

export enum Languages {
  JS = "js",
  TS = "ts",
  DEFAULT = "default",
}

export enum Databases {
  POSTGRES = "psql",
  MYSQL = "mysql",
}

export enum ORMs {
  PRISMA = "prisma",
  TYPEORM = "typeorm",
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
  database: {
    driver: Databases;
    orm: ORMs;
  };
}

export interface MainConfigFile {
  appName: string;
  externalModules?: string[];
  gateway?: boolean;
  projectPath: string;
  microservices: MicroserviceConfig[];
}
