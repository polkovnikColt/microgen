import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import {
  ChildProcessBuilder,
  npmExecutableCommands,
  osExecutableCommands,
} from "../commands";
import { join } from "path";
import { EventBrokers, Languages } from "../types";
import { printChildProcessOutput } from "../utils";
import { logger } from "../logger";

const eventBrokerConf: Record<EventBrokers, CallableFunction> = {
  [EventBrokers.KAFKA]: npmExecutableCommands.npmInstallKafka,
  [EventBrokers.RABBITMQ]: npmExecutableCommands.npmInstallRabbitmq,
};

const eventBrokerTypesConf: Record<
  string,
  Record<EventBrokers, CallableFunction>
> = {
  [Languages.JS]: {
    [EventBrokers.KAFKA]: npmExecutableCommands.npmNoop,
    [EventBrokers.RABBITMQ]: npmExecutableCommands.npmNoop,
  },
  [Languages.TS]: {
    [EventBrokers.KAFKA]: npmExecutableCommands.npmInstallKafkaTypes,
    [EventBrokers.RABBITMQ]: npmExecutableCommands.npmInstallRabbitmqTypes,
  },
};

export const initializeMQ = async (): Promise<any> => {
  const { projectPath, eventBroker } = __PROJECT_METADATA__;

  logger.info("Initializing event broker ");

  const mqPath = join(projectPath, "messageQueue");

  const promise = await new ChildProcessBuilder()
    .append(osExecutableCommands.changeDirectory(projectPath))
    .append(osExecutableCommands.createDirectory(mqPath))
    .append(
      osExecutableCommands.copyDirectory(
        join(__dirname, `../assets/mq/${eventBroker!.driver}/messageQueue/*`),
        mqPath
      )
    )
    .append(osExecutableCommands.changeDirectory(mqPath))
    .append(osExecutableCommands.initGit())
    .execAsync();

  printChildProcessOutput(promise);
  return setTimeout(() => Promise.resolve(), 3000);
};

export const initializeMQPerModule = (): Promise<any>[] => {
  const { eventBroker } = __PROJECT_METADATA__;

  logger.info("Initializing event broker per module");

  const createEventBrokerPath = (absolutePath: string) =>
    join(absolutePath, "eventBroker");

  const promises = __PROJECT_METADATA__.microservices.map(
    ({ absolutePath, language }) => {
      return new ChildProcessBuilder()
        .append(osExecutableCommands.changeDirectory(absolutePath))
        .append(
          osExecutableCommands.createDirectory(
            createEventBrokerPath(absolutePath)
          )
        )
        .append(
          osExecutableCommands.copyDirectory(
            join(
              __dirname,
              `../assets/mq/${eventBroker!.driver}/${language}/eventBroker/*`
            ),
            createEventBrokerPath(absolutePath)
          )
        )
        .append(eventBrokerConf[eventBroker!.driver]())
        .append(eventBrokerTypesConf[language][eventBroker!.driver]())
        .execAsync();
    }
  );

  return promises;
};
