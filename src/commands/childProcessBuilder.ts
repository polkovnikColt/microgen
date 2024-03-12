import { exec as nodeExec } from "node:child_process";
import { logger } from "../logger";

export class ChildProcessBuilder {
  private query: string = "";
  private readonly executionHandler = null;
  constructor(customHandler?: any) {
    this.executionHandler = customHandler;
  }

  append(command: string): typeof this {
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

  async execWithOutput(): Promise<any> {
    return new Promise((resolve, reject) => {
      nodeExec(this.query, (error, stdout) => {
        resolve(stdout);
        reject(error);
      });
    });
  }
}
