import path from "path";
import { isADir } from "./functions";
export class Config {
  srcDir;
  srcName;
  outDir;
  outName;

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
    "--run": (arg) => {
      const fileToRun = arg[arg.indexOf("--run") + 1];

      if (!fileToRun) {
        console.error("Please, set a file to run!");
        process.exit(1);
      }

      const fileToRunPath = path.resolve(process.cwd(), fileToRun);
      this.argvs["--run"] = fileToRunPath;
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
}
