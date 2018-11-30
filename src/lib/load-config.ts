import * as path from "path";
import * as fs from "fs";
import * as merge from "deepmerge";

import * as pkgConf from "pkg-conf";

interface ProcessingConfig {
  /**
   * Used to load a custom config file
   */
  config?: string;

  /**
   * Load modules
   */
  extends?: string[];

  /**
   * Extension configs
   */
  extensions?: {
    [subPkg: string]: PackageConfig;
  };

  /**
   * Files to copy to new repo
   */
  filesToCopy?: {
    [destPath: string]: string | false;
  };

  /**
   * Commands available to run
   */
  commands?: {
    [cmd: string]: string | string[];
  };
}

export interface PackageConfig {
  /**
   * Files to copy to new repo
   */
  files?: {
    [destPath: string]: string | false;
  };

  /**
   * Commands available to run
   */
  cmds?: {
    [cmd: string]: Array<{ loc: string; cmd: string }>;
  };
}

const PACKAGE_CONFIG_KEY = "repo-config";
const CONFIG_FILE_NAME = "repo.config.json";

export default function loadConfig(folderPath?: string, ext?: string) {
  let packageConf = pkgConf.sync<ProcessingConfig>(PACKAGE_CONFIG_KEY, {
    skipOnFalse: true,
    cwd: folderPath
  });
  const filepath = pkgConf.filepath(packageConf);
  const dir = filepath === null ? process.cwd() : path.dirname(filepath);
  const configFile = path.join(dir, CONFIG_FILE_NAME);

  if (folderPath && !dir.includes(folderPath)) {
    throw new Error(`Module not found: ${ext}`);
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
    packageConf.extensions = {};

    for (const extension of packageConf.extends) {
      const extensionPath = path.join("node_modules", extension);
      packageConf.extensions[extensionPath] = loadConfig(
        extensionPath,
        extension
      );
    }
  }

  return processConfig(packageConf);
}

function processConfig(cfg: ProcessingConfig): PackageConfig {
  const files = cfg.filesToCopy || {};
  const cmds: {
    [cmd: string]: Array<{ loc: string; cmd: string }>;
  } = {};

  if (cfg.commands) {
    for (const cmd of Object.keys(cfg.commands)) {
      cmds[cmd] = [];

      if (!Array.isArray(cfg.commands[cmd])) {
        cmds[cmd].push({ loc: "local", cmd: cfg.commands[cmd] as string });
      } else {
        for (const localCmd of cfg.commands[cmd]) {
          cmds[cmd].push({ loc: "local", cmd: localCmd });
        }
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
                `Two or more configs are trying to copy the same file: ${file} from source 1: ${
                  files[file]
                } and source 2: ${filePath}`
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
