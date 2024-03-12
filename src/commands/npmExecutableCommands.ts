export const npmExecutableCommands = {
  npmInit: () => "npm init -y",
  npmInitExpress: () => "npm i --reset-cache express",
  npmInitNest: (projectName: string) =>
    `npm i -g @nestjs/cli && nest new ${projectName}`,
  npmInitTypeScript: () => "npm i --save-dev @types/node typescript",
  npmInstallExpressTypes: () => "npm i --reset-cache --save-dev @types/express",
};
