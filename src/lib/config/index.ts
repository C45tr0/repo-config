import * as path from "path";

import IRepoConfig from "./i-repo-config";

import loadConfig from "./load-config";
import getExtensionConfig from "./get-extension-config";
import processConfig from "./process-config";
import processExtensions from "./process-extensions";

export default function getConfig(): IRepoConfig {
  const { packageConf, dir } = loadConfig();

  if (Object.keys(packageConf).length === 0) {
    throw new Error("No config found");
  }

  if (packageConf.extends) {
    packageConf.extensions = processExtensions(packageConf.extends, dir);
  }

  return processConfig(packageConf);
}
