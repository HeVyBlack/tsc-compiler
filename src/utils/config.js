import { spawn } from "child_process";
import { logger } from "./logger";
let fileError = false;

let child = null;
class Config {
  config = {
    src: { path: null, basename: null },
    out: { path: null, basename: null },
  };
  setCompError(bool) {
    fileError = bool;
  }
  getCompError() {
    return fileError;
  }
  async initChild() {
    if (!this.config["--run"]) return;
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
}

const config = new Config();

export default config;
