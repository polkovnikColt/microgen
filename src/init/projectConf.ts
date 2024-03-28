import { __PROJECT_METADATA__ } from "../shared/projectMetadata";
import { initializeGateway } from "./gatewayConf";

export const onProjectInit = async () => {
  const { gateway } = __PROJECT_METADATA__;

  if (gateway) {
    await initializeGateway();
  }
};
