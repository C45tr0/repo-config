import * as path from "path";

import IPackageConfig from "./i-package-config";
import IRepoConfig from "./i-repo-config";

export default function processConfig(cfg: IPackageConfig): IRepoConfig {
  const files = cfg.filesToCopy || {};
  const cmds: {
    [cmd: string]: Array<{
      loc: string;
      cmd: string;
    }>;
  } = {};

  if (cfg.commands) {
    for (const cmd of Object.keys(cfg.commands)) {
      cmds[cmd] = [];
      if (!Array.isArray(cfg.commands[cmd])) {
        // Have to cast even with the check..
        cfg.commands[cmd] = [cfg.commands[cmd] as string];
      }
      for (const localCmd of cfg.commands[cmd]) {
        cmds[cmd].push({ loc: "local", cmd: localCmd });
      }
    }
  }

  if (cfg.extensions) {
    for (const ext of Object.keys(cfg.extensions)) {
      // Needed as there is an issue with typescript and dynamic keys with null checks as of 3.2
      const extensionConfig = cfg.extensions[ext];
      if (extensionConfig.files) {
        for (const file of Object.keys(extensionConfig.files)) {
          // Again needed due to dynamic key
          const fileValue = extensionConfig.files[file];
          if (files[file] === false || fileValue === false) {
            files[file] = false;
          } else {
            const filePath = fileValue.includes("node_modules")
              ? fileValue
              : path.join(ext, fileValue);
            if (files[file]) {
              throw new Error(
                `Two or more configs are trying to copy the same file: '${file}' from source 1: '${
                  files[file]
                }' and source 2: '${filePath}'`
              );
            }
            files[file] = filePath;
          }
        }
      }

      if (extensionConfig.cmds) {
        for (const cmd of Object.keys(extensionConfig.cmds)) {
          if (!cmds[cmd]) {
            cmds[cmd] = [];
          }
          for (const extensionCmd of extensionConfig.cmds[cmd]) {
            cmds[cmd].push({
              loc: extensionCmd.loc.includes("node_modules")
                ? extensionCmd.loc
                : ext,
              cmd: extensionCmd.cmd
            });
          }
        }
      }
    }
  }

  return { files, cmds };
}
