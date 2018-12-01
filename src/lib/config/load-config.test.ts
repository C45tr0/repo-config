import chdirSetup from "../../../test/helpers/chdir";

import loadConfig from "./load-config";

const chdir = chdirSetup("config");

test("returns default data if no config found", () => {
  chdir("no-config");

  expect(loadConfig()).toMatchSnapshot();
});

test("returns blank dir on top level config load", () => {
  chdir("package-only");

  expect(loadConfig().dir).toMatchSnapshot();
});

test("returns relative path on extenstion config load", () => {
  chdir("loads-extends");

  expect(loadConfig("node_modules/test-extend").dir).toMatchSnapshot();
});

test("throws error when custom config can't be found", () => {
  chdir("custom-config-not-found");

  expect(loadConfig).toThrowErrorMatchingSnapshot();
});

test("throws error when custom config can't be loaded", () => {
  chdir("custom-config-invalid");

  expect(loadConfig).toThrowErrorMatchingSnapshot();
});

test("throws error when repo.config.json can't be loaded", () => {
  chdir("config-invalid");

  expect(loadConfig).toThrowErrorMatchingSnapshot();
});
