import path from "path";
import fs from "fs";
import isValidPath from "is-valid-path";
import config from "./config";
import { logger } from "./logger";

export async function initArgv() {
  if (process.argv.length === 2) {
    logger.error("Source and Output directories are needed!");
    process.exit(1);
  }

  const [, , src, out] = process.argv;

  if (!src) {
    logger.error("Source directorie is needed!");
    process.exit(1);
  }

  if (!out) {
    logger.error("Output directorie is needed!");
    process.exit(1);
  }

  config.config.src = await checkSourceDir(src);
  config.config.out = checkOutDir(out);

  if (process.argv.length === 4) return;

  for (let i = 4; i < process.argv.length; i++) {
    if (process.argv[i] in setArgvs) {
      const arg = process.argv[i];
      if (arg in setArgvs) {
        config.config[arg] = setArgvs[arg]();
      }
    }
  }

  return;
}

async function checkSourceDir(src) {
  const srcDir = path.resolve(src);
  // Check if exists
  await fs.promises.stat(srcDir).catch((e) => {
    logger.error("Source file doesn't exists!");
    process.exit(1);
  });

  return {
    path: srcDir,
    basename: path.basename(srcDir),
  };
}

function checkOutDir(out) {
  if (!isValidPath(out)) {
    logger.error("Provied a valid Out directory!");
    process.exit(1);
  }
  const outDir = path.resolve(out);
  return {
    path: outDir,
    basename: path.basename(outDir),
  };
}

const setArgvs = {
  "--copy-files"() {
    return true;
  },
  "--watch"() {
    return true;
  },
  "--run"() {
    const fileToRun = process.argv[process.argv.indexOf("--run") + 1];
    if (!isValidPath(fileToRun)) {
      logger.error("Provied a valid path for file!");
      process.exit(1);
    }

    if (!fileToRun) {
      logger.error("File to run is needed!");
      process.exit(1);
    }

    const filePath = path.resolve(fileToRun);

    const fileExt = path.extname(filePath);

    if (!fileExt || fileExt !== ".js") {
      logger.error("File to run must be a .js file!");
      process.exit(1);
    }

    return filePath;
  },
  "--clean-on-exit"() {
    ["SIGINT", "SIGTERM"].forEach((signal) => {
      process.on(signal, async () => {
        logger.error("\nExiting...");
        await fs.promises.rm(config.config.out.path, { recursive: true });
        process.exit(0);
      });
    });
    return true;
  },
  "--no-empy-files"() {
    return true;
  },
};

export function newPath(p) {
  const srcName = config.config.src.basename;
  const outName = config.config.out.basename;

  const pathSplit = p.split(process.cwd())[1];
  const pathReplace = pathSplit.replace(srcName, outName);
  const pathNew = path.join(process.cwd(), pathReplace);

  return pathNew;
}

export async function createDir(p) {
  fs.promises.mkdir(p).catch((e) => {
    if (e.code === "EEXIST") return;
    logger.error(e);
    process.exit(1);
  });
}

export async function createDirSync(p) {
  try {
    fs.mkdirSync(p);
  } catch (e) {
    if (e.code === "EEXIST") return;
    logger.error(e);
    process.exit(1);
  }
}

export function changeExtension(file, ext) {
  const baseName = path.basename(file, path.extname(file));
  return path.join(path.dirname(file), baseName + ext);
}
