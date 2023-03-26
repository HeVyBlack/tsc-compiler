#!/usr/bin/env node
import { handleFileEvent, isADir, isDirEmpy } from "./utils/functions";
import path, { basename } from "path";
import chokidar from "chokidar";
import { Config } from "./utils/config";

export const config = new Config();

const main = () => {
  // Extract source and out dirs
  const [, , src, out] = process.argv;

  // Check src and out
  if (!src) {
    console.error("Source directory is needed");
    process.exit(1);
  }
  if (!out) {
    console.error("Out directory is needed");
    process.exit(1);
  }

  config.setAndCheckSource(src);
  config.setOut(out);
  config.setArgvs(process.argv);

  timeToWatch();
};

function timeToWatch() {
  const src = config.srcDir;
  const watcher = chokidar.watch(src);
  watcher.on("add", function (fpath) {
    handleFileEvent(fpath);
  });
  watcher
    .on("change", async function (fpath) {
      console.clear();
      handleFileEvent(fpath);
      if (config.argvs["--watch"]) console.log("\nWatching for changes...");
      if (config.argvs["--run"]) {
        await config.resetChildProcess();
      }
    })
    .on("ready", async () => {
      if (!config.argvs["--watch"]) await watcher.close();

      if (config.argvs["--run"]) await config.initChildProcess();

      console.log("\nWatching for changes...");
    });
}

main();
