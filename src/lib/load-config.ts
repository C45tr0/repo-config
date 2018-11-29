import * as pkgConf from "pkg-conf";

interface PackageConfig {
  extends: string[];
}

export default function loadConfig() {
  const packageConf = pkgConf.sync<PackageConfig>("repo-config", {
    skipOnFalse: true
  });
  console.log("Base Conf: ", packageConf);

  if (packageConf && packageConf.extends) {
    packageConf.extends.forEach(pkg => {
      console.log(pkg);
    });
  }

  return packageConf;
}
