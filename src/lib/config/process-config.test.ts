import processConfig from "./process-config";

test("throws error when files conflict", () => {
  expect(() => {
    processConfig({
      extensions: {
        "node_modules/extension1": {
          files: {
            "tsconfig.json": "node_modules/extension1/files/tsconfig.json"
          }
        },
        "node_modules/extension2": {
          files: {
            "tsconfig.json": "node_modules/extension2/files/tsconfig.json"
          }
        }
      }
    });
  }).toThrowErrorMatchingSnapshot();
});

test("allow config to remove file", () => {
  expect(
    processConfig({
      extensions: {
        "node_modules/extension1": {
          files: {
            "tsconfig.json": false
          }
        },
        "node_modules/extension2": {
          files: {
            "tsconfig.json": "node_modules/extension2/files/tsconfig.json"
          }
        }
      }
    })
  ).toMatchSnapshot();
});

test("processes extension configs", () => {});
