import processConfig from "./process-config";

test("processes top level config", () => {
  expect(
    processConfig({
      commands: {
        lint: ["yarn prettier", "yarn tslint2"]
      },
      filesToCopy: {
        "tsconfig.json": "files/tsconfig.json"
      }
    })
  ).toMatchSnapshot();
});

test("processes extension configs", () => {});
