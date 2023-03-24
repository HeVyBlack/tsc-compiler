#!/usr/bin/env node

const swc = require("@swc/core");
const chokidar = require("chokidar");
const { extname, basename } = require("path");
const fs = require("fs");
const path = require("path");

const options = {
  "--copy-files": false,
};

async function main() {
  const argv = [...process.argv];

  argv.forEach((e) => {
    if (e in options) options[e] = true;
  });

  const [, , src, out] = argv;
  if (!src) throw new Error("Source directory is needed");
  if (!out) throw new Error("Out directory is needed");

  const srcDir = path.resolve(process.cwd(), src);
  const outDir = path.resolve(process.cwd(), out);

  if (!(await isAdir(src))) throw new Error("Source must be a directory!");

  await compile(srcDir, outDir);
}

async function compile(srcDir, outDir) {
  const srcDirName = srcDir.split(process.cwd())[1];
  const outDirName = outDir.split(process.cwd())[1];

  chokidar
    .watch(srcDir)
    .on("addDir", async (epath) => {
      try {
        if (await isDirEmpty(epath)) {
          return;
        }

        const newDirPath = path.join(
          process.cwd(),
          epath.split(process.cwd())[1].replace(srcDirName, outDirName)
        );

        if (!fs.existsSync(newDirPath)) fs.mkdirSync(newDirPath);
      } catch (e) {
        console.error(e);
      }
    })
    .on("add", async (epath) => {
      try {
        const fileName = basename(epath);

        const extName = extname(fileName);

        if (extName === ".ts") {
          const newFilePath = path.join(
            process.cwd(),
            epath
              .split(process.cwd())[1]
              .replace(srcDirName, outDirName)
              .replace(".ts", ".js")
          );

          const { code, map } = swc.transformFileSync(epath);
          const newCode = code.replace(/.ts";/g, '.js";');

          if (map) {
            const mapPath = newFilePath.concat(".map");
            const mapBaseName = basename(mapPath);
            fs.writeFileSync(mapPath, map);
            fs.writeFileSync(
              newFilePath,
              newCode.concat(`\n//# sourceMappingURL=${mapBaseName}`)
            );
          } else fs.writeFileSync(newFilePath, newCode);
        } else if (options["--copy-files"]) {
          const dest = path.join(
            process.cwd(),
            epath.split(process.cwd())[1].replace(srcDirName, outDirName)
          );
          fs.copyFileSync(epath, dest);
        }
      } catch (e) {
        console.error(e);
      }
    })
    .on("ready", () => {
      console.log("Compilation ready!");
      process.exit(0);
    });
}

async function isDirEmpty(dirname) {
  const files = await fs.promises.readdir(dirname);
  const res = files.length === 0;
  return res;
}

async function isAdir(dir) {
  const res = fs.existsSync(dir) && fs.lstatSync(dir).isDirectory();
  return res;
}

main();
