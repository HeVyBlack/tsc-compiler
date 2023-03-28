import ts from "typescript";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";
import config from "../utils/config";

export function readDefaultTsConfig(
  tsConfigPath = path.join(process.cwd(), "tsconfig.json")
) {
  let compilerOptions = {
    target: ts.ScriptTarget.ES2016,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node16,
    sourceMap: true,
    esModuleInterop: true,
  };

  if (!tsConfigPath) {
    return compilerOptions;
  }

  const fullTsConfigPath = path.resolve(tsConfigPath);

  if (!fs.existsSync(fullTsConfigPath)) {
    return compilerOptions;
  }

  try {
    const { config } = ts.readConfigFile(fullTsConfigPath, ts.sys.readFile);

    const { options, errors, fileNames } = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      path.dirname(fullTsConfigPath)
    );
    if (!errors.length) {
      compilerOptions = options;
      compilerOptions.files = fileNames;
    } else {
      logger.error(
        `Convert compiler options from json failed, ${errors
          .map((d) => d.messageText)
          .join("\n")}`
      );
    }
  } catch (e) {
    logger.error(`Read ${tsConfigPath} failed: ${e.message}`);
  }

  return compilerOptions;
}

export async function typeCheck(fileNames, options) {
  const program = ts.createProgram(fileNames, options);

  let allDiagnostics = ts.getPreEmitDiagnostics(program);

  if (!allDiagnostics.length) {
    return true;
  } else {
    logger.info(
      ts.formatDiagnosticsWithColorAndContext(allDiagnostics, {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: ts.sys.useCaseSensitiveFileNames
          ? (filename) => filename
          : (filename) => filename.toLowerCase(),
        getNewLine: () => ts.sys.newLine,
      })
    );
    config.setCompError(true);
    return false;
  }
}
