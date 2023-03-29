import { spawn } from "child_process";
import { logger } from "./logger";
let fileError = false;

let child = null;

let tsConfig = null;

let swcrc = null;

class Config {
  config = {
    src: { path: null, basename: null },
    out: { path: null, basename: null },
  };
  setSwcrc(options) {
    swcrc = options;
  }
  getSwcrc() {
    return swcrc;
  }
  setCompError(bool) {
    fileError = bool;
  }
  getCompError() {
    return fileError;
  }
  async initChild() {
    if (!this.config["--run"]) return;
    console.clear();
    child = spawn("node", [this.config["--run"]], {
      stdio: "inherit",
    });
    child.on("spawn", (data) => {
      logger.info("The process is initialising...");
    });
    child.on("message", (data) => {
      logger.info(data);
    });
    child.on("error", (data) => {
      logger.error(data);
    });
  }
  async resetChild() {
    if (!child) {
      await this.initChild();
      return;
    } else {
      child.kill();
      await this.initChild();
    }
  }
  killChild() {
    if (!child) return;
    child.kill();
  }
  setTsConfig(json) {
    tsConfig = json;
  }
  getTsConfig() {
    return tsConfig;
  }
}

const config = new Config();

export default config;
