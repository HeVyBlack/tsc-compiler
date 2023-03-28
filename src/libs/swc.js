import path from "path";
import {
  changeExtension,
  createDirSync,
  newPath,
} from "../utils/functions";
import fs from "fs";
import config from "../utils/config";
import { logger } from "../utils/logger";
import { transformFileSync } from "@swc/core";

export async function handleFileCompilation(p, event) {
  const extFile = path.extname(p);
  let newFilePath = newPath(p);
  const fileName = path.basename(p);

  const newDirPath = newPath(path.dirname(p));

  createDirSync(newDirPath);

  if (extFile !== ".ts") {
    if (!config.config["--copy-files"]) return;
    if (fileName === ".js") {
      const aux = changeExtension(p, ".ts");
      if (await fs.promises.stat(aux)) return;
    }
    return await fs.promises.copyFile(p, newFilePath);
  }
  try {
    const { code, map } = transformFileSync(p);

    if (!code) {
      if (config.config["--no-empy-files"] && event !== "change") return;
    }

    newFilePath = changeExtension(newFilePath, ".js");

    let newCode = code.replace(/.ts";/g, '.js";');

    if (map) {
      const mapName = fileName + ".map";
      const mapPath = newFilePath + ".map";
      newCode += `\n//# sourceMappingURL=${mapName}`;
      await fs.promises.writeFile(mapPath, map);
    }

    await fs.promises.writeFile(newFilePath, newCode);
    config.setCompError(false);

    console.clear();
    if (event !== "add") config.resetChild();
  } catch (e) {
    console.log(e);
    config.setCompError(true);
    logger.error(e.message || e);
    config.killChild();
  }
}
