import { logger } from "../logger";
import { ChildProcessOutput } from "../types";

export const printChildProcessOutput = (out: ChildProcessOutput[]) => {
  for (const { stdout, stderr } of out) {
    stdout && logger.info(stdout);
    stderr && logger.error(stderr);
  }
};
