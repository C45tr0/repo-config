import * as path from "path";

function chdir(fixtureName: string, testName: string) {
  process.chdir(
    path.resolve(__dirname, "..", "fixture", fixtureName, testName)
  );
}

export default function chdirSetup(fixtureName: string) {
  return (testName: string) => chdir(fixtureName, testName);
}
