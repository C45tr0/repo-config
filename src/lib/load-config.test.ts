import { chdirSetup } from "../../test/helpers/chdir";

import loadConfig from "./load-config";

const chdir = chdirSetup("load-config");

test("finds config in package.json", function findBasicConfig() {
  chdir("package-only");

  expect(loadConfig()).toEqual({ copy: { "random-file": "" } });
});

test("finds config at repo.config.json", function findBasicConfig() {
  chdir("config-only");

  expect(loadConfig()).toEqual({ copy: { "random-file": "" } });
});

test("finds custom config from package.json", function findBasicConfig() {
  chdir("custom-config");

  expect(loadConfig()).toEqual({ copy: { "random-file": "" } });
});

test("finds config in package.json and repo.config.json and merges", function findBasicConfig() {
  chdir("merge-config");

  expect(loadConfig()).toEqual({
    copy: { "random-file": "", "random-file2": "" },
    extends: ["test-extend", "test-extend2"]
  });
});

test("recurses extends and merges", function findBasicConfig() {
  chdir("loads-extends");

  expect(loadConfig()).toEqual({
    copy: { "random-file": "", "random-file2": "" },
    extends: ["test-extend", "test-extend2"]
  });
});
