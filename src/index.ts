import * as minimist from "minimist";

import loadConfig from "./lib/load-config";

const argz = minimist(process.argv.slice(2));

console.log("Loaded Conf: ", loadConfig());

switch (argz._[0]) {
  case "run":
    console.log("Running Command: ", argz._[1]);
    break;
  case "setup":
    console.log("Running Setup");
    break;
  default:
    console.log("Running Default");
    break;
}
