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
  console.clear();
  const src = config.srcDir;
  const watcher = chokidar.watch(src);
  watcher.on("add", function (fpath) {
    handleFileEvent(fpath);
  });
  watcher
    .on("change", function (fpath) {
      handleFileEvent(fpath);
      if (config.argvs["--watch"]) console.log("\nWatching for changes...");
    })
    .on("ready", function () {
      if (!config.argvs["--watch"]) {
        console.log("Exit...");
        process.exit(0);
      } else console.log("\nWatching for changes...");
    });
}

main();
