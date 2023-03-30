import { findSwcrc } from "./libs/swc";
import config from "./utils/config";
import { initArgv } from "./utils/functions";
import { logger } from "./utils/logger";
import fs from "fs";
export async function initialSetup() {
  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
      logger.info("\nExiting...");
      await config.killChild();
      if (config.config["--clean-on-exit"])
        await fs.promises.rm(config.config.out.path, { recursive: true });

      process.exit(0);
    });
  });
  config.setSwcrc(await findSwcrc());
  await initArgv();
}
