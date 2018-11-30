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

export default function loadConfig(
  folderPaths?: string[],
  ext?: string
): [string, PackageConfig] {
  folderPaths = folderPaths || [process.cwd()];

  let packageConf: ProcessingConfig | null = null;
  let foundPath: string | null = null;
  let filepath: string | null;
  let dir: string = "";
  let configFile: string;

  for (const folderPath of folderPaths) {
    packageConf = pkgConf.sync<ProcessingConfig>(PACKAGE_CONFIG_KEY, {
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

function processConfig(cfg: ProcessingConfig): PackageConfig {
  const files = cfg.filesToCopy || {};
  const cmds: {
    [cmd: string]: Array<{ loc: string; cmd: string }>;
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
