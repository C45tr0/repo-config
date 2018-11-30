import { chdirSetup } from "../../test/helpers/chdir";

import loadConfig from "./load-config";

const chdir = chdirSetup("load-config");

test("finds config in package.json", function findBasicConfig() {
  chdir("package-only");

  expect(loadConfig()).toEqual([
    "./",
    {
      cmds: {
        "random-command": [{ loc: "local", cmd: "random-command" }]
      },
      files: { "random-file": "random-file.txt" }
    }
  ]);
});

test("finds config at repo.config.json", function findBasicConfig() {
  chdir("config-only");

  expect(loadConfig()).toEqual([
    "./",
    {
      cmds: {
        "random-command": [{ loc: "local", cmd: "random-command" }]
      },
      files: { "random-file": "random-file.txt" }
    }
  ]);
});

test("finds custom config from package.json", function findBasicConfig() {
  chdir("custom-config");

  expect(loadConfig()).toEqual([
    "./",
    {
      cmds: {
        "random-command": [{ loc: "local", cmd: "random-command" }]
      },
      files: { "random-file": "random-file.txt" }
    }
  ]);
});

test("finds config in package.json and repo.config.json and merges", function findBasicConfig() {
  chdir("merge-config");

  expect(loadConfig()).toEqual([
    "./",
    {
      cmds: {
        "random-command": [{ cmd: "random-command", loc: "local" }],
        "random-command2": [
          { cmd: "random-command2", loc: "local" },
          { cmd: "random-command3", loc: "node_modules/test-extend" }
        ],
        "random-command3": [
          { cmd: "random-command3", loc: "node_modules/test-extend2" }
        ]
      },
      files: {
        "random-file": "random-file.txt",
        "random-file2": "random-file2.txt",
        "random-file3": "node_modules/test-extend2/random-file3.txt"
      }
    }
  ]);
});

test("recurses extends and merges", function findBasicConfig() {
  chdir("loads-extends");

  expect(loadConfig()).toEqual([
    "./",
    {
      cmds: {
        "random-command": [
          { cmd: "random-command", loc: "node_modules/test-extend" }
        ]
      },
      files: {
        "random-file": "node_modules/test-extend/random-file.txt",
        "random-file2": "node_modules/test-extend2/random-file2.txt"
      }
    }
  ]);
});

test("recurses extends and merges with hierarchy node_modules", function findBasicConfig() {
  chdir("loads-extends-hierarchy");

  expect(loadConfig()).toEqual([
    "./",
    {
      cmds: {
        "random-command": [
          { cmd: "random-command", loc: "node_modules/test-extend" }
        ]
      },
      files: {
        "random-file": "node_modules/test-extend/random-file.txt",
        "random-file2":
          "node_modules/test-extend/node_modules/test-extend2/random-file2.txt"
      }
    }
  ]);
});

test("invalid extension name", function findBasicConfig() {
  chdir("invalid-extension");

  expect(loadConfig).toThrowErrorMatchingSnapshot();
});
