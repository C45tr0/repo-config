import IRepoConfig from "./i-repo-config";

export default interface IPackageConfig {
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
    [subPkg: string]: IRepoConfig;
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
