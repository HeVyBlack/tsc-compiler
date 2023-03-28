import chokidar from "chokidar";
import config from "../utils/config";
import { handleFileCompilation } from "./swc";
import { logger } from "../utils/logger";

export async function initWatcher() {
  const watcher = chokidar.watch(config.config.src.path, {
    persistent: config.config["--watch"] || false,
  });

  watcher.on("add", async (p) => {
    await handleFileCompilation(p, "add");
  });

  watcher.on("change", async (p) => {
    console.clear();
    await handleFileCompilation(p, "change");
    if (!config.getCompError()) logger.info("Watching for changes...");
  });

  watcher.on("ready", async () => {
    if (config.getCompError()) return;
    if (config.config["--watch"]) logger.info("Watching for changes...");
    if (config.config["--run"]) await config.initChild();
  });
}
