import { printChildProcessOutput } from "../utils";
import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { initializeGateway } from "./gatewayConf";
import { initializeMQ, initializeMQPerModule } from "./mqConf";

export const onProjectInit = async () => {
  const { gateway, eventBroker } = __PROJECT_METADATA__;

  if (gateway) {
    await initializeGateway();
  }

  if (eventBroker) {
    await initializeMQ();
    const responses = await Promise.all(initializeMQPerModule());
    printChildProcessOutput(responses);
  }
};
