#!/usr/bin/env node

import { initialSetup } from "./inital.setup";
import { initWatcher } from "./libs/watcher";

async function main() {
  await initialSetup();
  await initWatcher();
}

main();
