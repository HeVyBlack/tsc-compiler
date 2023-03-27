import fs from "fs";
import { basename, dirname, extname, join } from "path";
import { config } from "..";
import * as swc from "@swc/core";

export function isADir(dpath) {
  const exists = fs.existsSync(dpath);
  const isDir = fs.lstatSync(dpath).isDirectory();
  return exists && isDir;
}

export function isDirEmpy(dpath) {
  const files = fs.readdirSync(dpath);
  const res = files;
  console.log(res);
}

export function createDir(dpath) {
  if (!fs.existsSync(dpath)) fs.mkdirSync(dpath);
}

export function changeExtension(fpath, extension) {
  const baseName = basename(fpath, extname(fpath));
  return join(dirname(fpath), baseName + extension);
}

export function newPath(fpath) {
  const srcName = config.srcName;
  const outName = config.outName;
  const pathSplit = fpath.split(process.cwd())[1];
  const pathReplace = pathSplit.replace(srcName, outName);
  const pathNew = join(process.cwd(), pathReplace);
  return pathNew;
}

export function compileFile(filePath) {
  return swc.transformFileSync(filePath);
}

export function handleFileEvent(filePath) {
  const newFilePath = newPath(filePath);
  const fileName = basename(filePath);
  const extFile = extname(filePath);
  const newDirPath = newPath(dirname(filePath));

  // Create Dir
  createDir(newDirPath);

  // Compile file
  if (extFile === ".ts" || extFile === ".js") {
    if (extFile === ".js") {
      // Check if a .ts file exists with the same name
      const aux = changeExtension(filePath, ".ts");
      if (fs.existsSync(aux)) return;
    }
    try {
      const { code, map } = compileFile(filePath);
      let newCode = code.replace(/.ts";/g, '.js";');

      if (map) {
        const mapName = fileName.split(extFile)[0].concat(".js.map");
        const mapPath = join(newDirPath, mapName);
        fs.writeFileSync(mapPath, map);
        newCode += `\n//# sourceMappingURL=${mapName}`;
      }
      fs.writeFileSync(changeExtension(newFilePath, ".js"), newCode);
    } catch (e) {
      console.error(e.message || e);
      if (!config.argvs["--watch"]) process.exit(1);
    }
  } else if (config.argvs["--copy-files"]) {
    fs.copyFileSync(filePath, newFilePath);
  }
}

export function getExitCode() {
  if (process.platform === "win32") {
    return "SIGINT";
  } else if (process.platform === "darwin") {
    return "SIGINT";
  } else if (process.platform === "linux") {
    return "SIGINT";
  } else {
    throw new Error("The OS is not supported!");
    process.exit(1);
  }
}
