// Type definitions for pkg-conf 2.1
// Project: https://github.com/sindresorhus/pkg-conf#readme
// Definitions by: Jorge Gonzalez <https://github.com/jorgegonzalez>
// Definitions by: William O'Dell <https://github.com/c45tr0>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

declare namespace pkgConf {
  interface Options {
    // Directory to start looking up for a package.json file.
    // Default: process.cwd()
    cwd?: string;
    // Default config.
    defaults?: object;
    // Skip package.json files that have the namespaced config explicitly set to false.
    skipOnFalse?: boolean;
  }

  // Returns the config.
  function sync<T = any>(namespace: string, options?: Options): T;
  // Pass in the config returned from any of the above methods.
  // Returns the filepath to the package.json file or null when not found.
  function filepath(config: any): string | null;
}

// Returns a Promise for the config.
declare function pkgConf<T>(
  namespace: string,
  options?: pkgConf.Options
): Promise<T>;

export = pkgConf;
