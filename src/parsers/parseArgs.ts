import { ParsedArgs } from "../types";

export const parseArgs = <T>(args: string[]): ParsedArgs<T> => {
  const slicedArgs: string[] = args.slice(1);
  const parsedArgs: ParsedArgs<T> = {
    flags: [],
    variables: {} as T,
  };
  for (const arg of slicedArgs) {
    if (arg.startsWith("--")) {
      const rawArg: string = arg.replace("--", "");
      parsedArgs.flags.push(rawArg);
    } else if (arg.startsWith("-")) {
      const [key, value]: string[] = arg.replace("-", "").split("=");
      parsedArgs.variables = {
        ...parsedArgs.variables,
        [key]: value,
      };
    }
  }
  return parsedArgs;
};
