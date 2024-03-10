export interface ProjectMetadata {
  projectPath: string;
  projectFolderName: string;
  microservices: {
    valid: boolean;
    folderName: string;
    absolutePath: string;
  }[];
}
