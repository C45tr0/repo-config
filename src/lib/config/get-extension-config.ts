import * as path from "path";

import IPackageConfig from "./i-package-config";
import IRepoConfig from "./i-repo-config";

import loadConfig from "./load-config";
import processExtensions from "./process-extensions";
import processConfig from "./process-config";

export default function getExtensionConfig(folderPaths: string[], ext: string) {
  let packageConf: IPackageConfig | null = null;
  let dir: string = "";

  for (const folderPath of folderPaths) {
    ({ packageConf, dir } = loadConfig(folderPath));

    if (Object.keys(packageConf).length > 0 && dir.includes(folderPath)) {
      break;
    }

    packageConf = null;
  }

  if (!packageConf) {
    throw new Error(
      `Extension not found: '${ext}' paths searched: ${JSON.stringify(
        folderPaths
      )}`
    );
  }

  if (packageConf.extends) {
    packageConf.extensions = processExtensions(packageConf.extends, dir);
  }

  return { extensionPath: dir, extensionConfig: processConfig(packageConf) };
}
