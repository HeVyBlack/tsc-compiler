import path from "path";
import { isADir } from "./functions";
import { spawn } from "child_process";
export class Config {
  srcDir;
  srcName;
  outDir;
  outName;

  child = null;

  argvs = {
    "--copy-files": false,
    "--watch": false,
    "--run": null,
  };

  argvsToSet = {
    "--copy-files": () => {
      this.argvs["--copy-files"] = true;
    },
    "--watch": () => {
      this.argvs["--watch"] = true;
    },
    "--run": async (arg) => {
      const fileToRun = arg[arg.indexOf("--run") + 1];

      if (!fileToRun) {
        console.error("File to run is required!");
        process.exit(1);
      }

      const pathFile = path.resolve(process.cwd(), fileToRun);

      const fileExt = path.extname(pathFile);

      if (!fileExt || fileExt !== ".js") {
        console.error("File to run must be a .js file!");
        process.exit(1);
      }

      if (!fileToRun) {
        console.error("Please, set a file to run!");
        process.exit(1);
      }

      this.argvs["--run"] = pathFile;
    },
  };

  constructor() {}

  setAndCheckSource(src) {
    this.srcDir = path.resolve(process.cwd(), src);
    if (!isADir(this.srcDir)) {
      console.error("Source must be a valid directory!");
      process.exit(1);
    }
    this.srcName = path.basename(this.srcDir);
  }

  setOut(out) {
    this.outDir = path.resolve(process.cwd(), out);
    this.outName = path.basename(this.outDir);
  }

  setArgvs(arg) {
    arg.forEach((a) => {
      if (a in this.argvs) {
        this.argvsToSet[a](arg);
      }
    });
  }

  getArgvs() {
    return this.argvs;
  }

  async initChildProcess() {
    this.child = spawn("node", [this.argvs["--run"]]);

    this.child.stdout.on("data", (data) => {
      console.log(`\n${data}`);
    });

    this.child.stderr.on("data", (data) => {
      console.error(`\n${data}`);
    });
  }

  async resetChildProcess() {
    if (!this.child) return;
    await this.child.kill();
    this.child = null;
    await this.initChildProcess();
  }
}
