#!/usr/bin/env node
import { handleFileEvent, isADir, isDirEmpy } from "./utils/functions";
import path, { basename } from "path";
import chokidar from "chokidar";
import { Config } from "./utils/config";
import fs from "fs";

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
      if (!config.argvs["--watch"]) {
        console.log("Compilation complete!");
        await watcher.close();
      } else console.log("\nWatching for changes...");

      if (config.argvs["--run"]) await config.initChildProcess();
    });
}

process.on("exit", async () => {
  if (config.argvs["--clean-on-exit"]) {
    fs.rmSync(config.outDir, { recursive: true }, (e) => {
      if (e) {
        console.error(e);
        process.exit(1);
      } else {
        console.log("Clean exit complete!");
        process.exit(0);
      }
    });
  }
  process.exit(0);
});

process.on(config.exitCode, () => {
  if (config.argvs["--clean-on-exit"]) {
    fs.rmSync(config.outDir, { recursive: true }, (e) => {
      console.log("HOLA");
      if (e) {
        console.error(e);
        process.exit(1);
      } else {
        console.log("Clean exit complete!");
        process.exit(0);
      }
    });
  }
  process.exit(0);
});

main();
