import * as path from "path";

export function chdir(fixtureName: string, testName: string) {
  process.chdir(
    path.resolve(__dirname, "..", "fixture", fixtureName, testName)
  );
}

export function chdirSetup(fixtureName: string) {
  return (testName: string) => chdir(fixtureName, testName);
}
