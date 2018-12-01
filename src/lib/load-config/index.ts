import * as path from "path";
import * as fs from "fs";
import * as merge from "deepmerge";
import * as pkgConf from "pkg-conf";

import IPackageConfig from "./i-package-config";
import IRepoConfig from "./i-repo-config";

import processConfig from "./process-config";

const PACKAGE_CONFIG_KEY = "repo-config";
const CONFIG_FILE_NAME = "repo.config.json";

export default function loadConfig(
  folderPaths?: string[],
  ext?: string
): [string, IRepoConfig] {
  folderPaths = folderPaths || [process.cwd()];

  let packageConf: IPackageConfig | null = null;
  let foundPath: string | null = null;
  let filepath: string | null;
  let dir: string = "";
  let configFile: string;

  for (const folderPath of folderPaths) {
    packageConf = pkgConf.sync<IPackageConfig>(PACKAGE_CONFIG_KEY, {
      skipOnFalse: true,
      cwd: folderPath
    });

    filepath = pkgConf.filepath(packageConf);
    dir = (filepath === null ? folderPath : path.dirname(filepath))
      .replace(process.cwd(), "./")
      .replace(".//", "./")
      .replace("./", "");
    configFile = path.join(folderPath, CONFIG_FILE_NAME);

    if (packageConf.config) {
      const customConfigFile = path.join(dir, packageConf.config);

      try {
        packageConf = merge(
          packageConf,
          JSON.parse(fs.readFileSync(customConfigFile, "utf8"))
        );
        console;
      } catch (err) {
        throw Object.assign(new Error(`Invalid custom config file: `), {
          parent: err
        });
      }
      delete packageConf.config;
    } else {
      if (fs.existsSync(configFile)) {
        packageConf = merge(
          packageConf,
          JSON.parse(fs.readFileSync(configFile, "utf8"))
        );
      }
    }

    if (
      Object.keys(packageConf).length > 0 &&
      (!ext || dir.includes(folderPath))
    ) {
      foundPath = folderPath;
      break;
    }

    packageConf = null;
  }

  if (ext) {
    if ((foundPath && !dir.includes(foundPath)) || !packageConf) {
      console.log(dir, foundPath);
      throw new Error(
        `Extension not found: '${ext}' paths searched: ${JSON.stringify(
          folderPaths
        )}`
      );
    }
  } else if (!packageConf) {
    throw new Error("No config found");
  }

  if (packageConf.extends) {
    packageConf.extensions = {};

    for (const extension of packageConf.extends) {
      const [extensionPath, extensionConfig] = loadConfig(
        [
          path.join(dir, "node_modules", extension),
          path.join("node_modules", extension)
        ],
        extension
      );
      packageConf.extensions[extensionPath] = extensionConfig;
    }
  }

  return [dir ? dir : "./", processConfig(packageConf)];
}
