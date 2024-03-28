import { exec as nodeExec } from "node:child_process";
import util from "util";

import { logger } from "../logger";

export class ChildProcessBuilder {
  private query: string = "";
  private readonly executionHandler = null;
  constructor(customHandler?: any) {
    this.executionHandler = customHandler;
  }

  append(command: string): typeof this {
    if (!command) {
      return this;
    }
    if (!this.query) {
      this.query = command;
    } else {
      this.query = `${this.query} && ${command}`;
    }
    return this;
  }

  exec(): void {
    logger.info(`Executing query: ${this.query}`);
    nodeExec(this.query, (error, stdout) => {
      stdout && logger.info(stdout);
      error && logger.error(error);
    });
  }

  async execAsync(): Promise<any> {
    return util.promisify(require("node:child_process").exec)(this.query);
  }
}
