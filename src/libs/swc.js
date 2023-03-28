import path from "path";
import { changeExtension, createDirSync, newPath } from "../utils/functions";
import fs from "fs";
import config from "../utils/config";
import { logger } from "../utils/logger";
import { transformFileSync } from "@swc/core";
import { typeCheck } from "./typescript";

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

  if (config.config["--type-check"])
    if (!(await typeCheck([p], config.getTsConfig()))) return;

  await compileFile({ p, event, newFilePath, fileName });
}

async function compileFile({ p, event, newFilePath, fileName }) {
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

    if (event !== "add") config.resetChild();

    return true;
  } catch (e) {
    config.setCompError(true);
    logger.error(e.message || e);
    config.killChild();
    return false;
  }
}
