import chdirSetup from "../../../test/helpers/chdir";

import loadConfig from ".";

const chdir = chdirSetup("load-config");

test("finds config in package.json", () => {
  chdir("package-only");

  expect(loadConfig()).toMatchSnapshot();
});

test("finds config at repo.config.json", () => {
  chdir("config-only");

  expect(loadConfig()).toMatchSnapshot();
});

test("finds custom config from package.json", () => {
  chdir("custom-config");

  expect(loadConfig()).toMatchSnapshot();
});

test("finds config in package.json and repo.config.json and merges", () => {
  chdir("merge-config");

  expect(loadConfig()).toMatchSnapshot();
});

test("recurses extends and merges", () => {
  chdir("loads-extends");

  expect(loadConfig()).toMatchSnapshot();
});

test("recurses extends and merges with hierarchy node_modules", () => {
  chdir("loads-extends-hierarchy");

  expect(loadConfig()).toMatchSnapshot();
});

test("invalid extension name", () => {
  chdir("invalid-extension");

  expect(loadConfig).toThrowErrorMatchingSnapshot();
});
