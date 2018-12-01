export default interface IRepoConfig {
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
    [cmd: string]: Array<{
      loc: string;
      cmd: string;
    }>;
  };
}
