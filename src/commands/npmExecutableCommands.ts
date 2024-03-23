export const npmExecutableCommands = {
  npmNoop: () => "",
  npmInit: () => "npm init -y",
  npmInitExpress: () => "npm i --reset-cache express --save-dev nodemon",
  npmInitNest: () => `npm i -g @nestjs/cli && nest new . -p npm`,
  npmInitTypeScript: () => "npm i --save-dev @types/node typescript",
  npmInstallExpressTypes: () => "npm i --reset-cache --save-dev @types/express",
};
