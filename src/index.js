#!/usr/bin/env node

import { initialSetup } from "./inital.setup";
import { initWatcher } from "./libs/chokidar";
import { logger } from "./utils/logger";

logger.info("initializing...")

async function main() {
  await initialSetup();
  await initWatcher();
}

main();
