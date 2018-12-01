import * as path from "path";

import IRepoConfig from "./i-repo-config";

import getExtensionConfig from "./get-extension-config";

export default function processExtensions(pkgExtends: string[], dir: string) {
  const extensions: {
    [ext: string]: IRepoConfig;
  } = {};

  for (const extension of pkgExtends) {
    const { extensionPath, extensionConfig } = getExtensionConfig(
      [
        path.join(dir, "node_modules", extension),
        path.join("node_modules", extension)
      ],
      extension
    );
    extensions[extensionPath] = extensionConfig;
  }

  return extensions;
}
