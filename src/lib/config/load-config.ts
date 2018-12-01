import * as path from "path";
import * as fs from "fs";
import * as merge from "deepmerge";
import * as pkgConf from "pkg-conf";

import IPackageConfig from "./i-package-config";

const PACKAGE_CONFIG_KEY = "repo-config";
const CONFIG_FILE_NAME = "repo.config.json";

export default function loadConfig(folderPath?: string) {
  let packageConf = pkgConf.sync<IPackageConfig>(PACKAGE_CONFIG_KEY, {
    skipOnFalse: true,
    cwd: folderPath
  });
  const filepath = pkgConf.filepath(packageConf);
  let dir = "";

  if (filepath) {
    dir = path
      .dirname(filepath)
      .replace(`${process.cwd()}${path.sep}`, "")
      .replace(process.cwd(), "");
  }

  if (packageConf.config) {
    const customConfigFile = path.join(dir, packageConf.config);

    if (!fs.existsSync(customConfigFile)) {
      throw new Error(
        `Custom config file not found at path: ${customConfigFile}`
      );
    }

    try {
      packageConf = merge(
        packageConf,
        JSON.parse(fs.readFileSync(customConfigFile, "utf8"))
      );
    } catch (err) {
      throw Object.assign(
        new Error(`Invalid custom config file: ${customConfigFile}`),
        {
          parent: err
        }
      );
    }
    delete packageConf.config;
  } else {
    const configFile = path.join(dir, CONFIG_FILE_NAME);

    if (fs.existsSync(configFile)) {
      try {
        packageConf = merge(
          packageConf,
          JSON.parse(fs.readFileSync(configFile, "utf8"))
        );
      } catch (err) {
        throw Object.assign(new Error(`Invalid config file: ${configFile}`), {
          parent: err
        });
      }
    }
  }

  return { packageConf, dir };
}
