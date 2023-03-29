import { findSwcrc } from "./libs/swc";
import config from "./utils/config";
import { initArgv } from "./utils/functions";
import { logger } from "./utils/logger";

export async function initialSetup() {
  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
      logger.info("\nExiting...");
      await config.killChild();
      process.exit(0);
    });
  });
  config.setSwcrc(await findSwcrc());
  await initArgv();
}
