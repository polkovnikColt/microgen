export const npmExecutableCommands: Record<string, CallableFunction> = {
  npmNoop: () => "",
  npmInit: () => "npm init -y",
  npmInstallDeps: (deps: string[]) =>
    deps.length ? `npm i ${deps.join(" ")}` : "",
  npmInstallDevDeps: (deps: string[]) =>
    deps.length ? `npm i --save-dev ${deps.join(" ")}` : "",
  npmInitExpress: () => "npm i --reset-cache express cors",
  npmInitNest: () => `npm i -g @nestjs/cli && nest new . -p npm `,
  npmInitTypeScript: () => "npm i --save-dev @types/node typescript",
  npmInstallExpressTypes: () => "npm i --save-dev @types/express",
};
