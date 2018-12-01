import chdirSetup from "../../../test/helpers/chdir";

import getConfig from ".";

const chdir = chdirSetup("config");

test("throws error when no config found", () => {
  chdir("no-config");

  expect(getConfig).toThrowErrorMatchingSnapshot();
});

test("finds config in package.json", () => {
  chdir("package-only");

  expect(getConfig()).toMatchSnapshot();
});

test("finds config at repo.config.json", () => {
  chdir("config-only");

  expect(getConfig()).toMatchSnapshot();
});

test("finds custom config from package.json", () => {
  chdir("custom-config");

  expect(getConfig()).toMatchSnapshot();
});

test("finds config in package.json and repo.config.json and merges", () => {
  chdir("merge-config");

  expect(getConfig()).toMatchSnapshot();
});

test("recurses extends and merges", () => {
  chdir("loads-extends");

  expect(getConfig()).toMatchSnapshot();
});

test("recurses extends and merges with hierarchy node_modules", () => {
  chdir("loads-extends-hierarchy");

  expect(getConfig()).toMatchSnapshot();
});

test("throws error when no extension config found", () => {
  chdir("invalid-extension");

  expect(getConfig).toThrowErrorMatchingSnapshot();
});

test("throws error when files conflict", () => {
  chdir("files-conflict");

  expect(getConfig).toThrowErrorMatchingSnapshot();
});
