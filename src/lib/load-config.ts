import * as path from "path";
import * as fs from "fs";
import * as merge from "deepmerge";

import * as pkgConf from "pkg-conf";

interface PackageConfig {
  /**
   * Used to load a custom config file
   */
  config?: string;

  /**
   * Load modules
   */
  extends?: string[];
}

const PACKAGE_CONFIG_KEY = "repo-config";
const CONFIG_FILE_NAME = "repo.config.json";

export default function loadConfig(folderPath?: string) {
  let packageConf = pkgConf.sync<PackageConfig>(PACKAGE_CONFIG_KEY, {
    skipOnFalse: true,
    cwd: folderPath
  });
  const filepath = pkgConf.filepath(packageConf);
  const dir = filepath === null ? process.cwd() : path.dirname(filepath);
  const configFile = path.join(dir, CONFIG_FILE_NAME);

  if (folderPath && !dir.includes(folderPath)) {
    throw new Error(
      `Module not found: ${folderPath.substr("node_modules/".length)}`
    );
  }

  if (packageConf.config) {
    try {
      packageConf = merge(
        packageConf,
        JSON.parse(fs.readFileSync(path.join(dir, packageConf.config), "utf8"))
      );
      console;
    } catch (err) {
      throw Object.assign(new Error("Invalid custom config file"), {
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

  if (packageConf.extends) {
    packageConf.extends.forEach(pkg => {
      packageConf = merge(
        packageConf,
        loadConfig(path.join("node_modules", pkg))
      );
    });
  }

  return packageConf;
}
