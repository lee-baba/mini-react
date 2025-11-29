import {
  getPackageJson,
  resolvePckPath,
  getBaseRullupPlugins,
} from "../utils.js";
import generatePackageJson from "rollup-plugin-generate-package-json";
import alias from "@rollup/plugin-alias";

const { name, module } = getPackageJson("react-dom");
const pkgPath = resolvePckPath(name);
const pkgDistPath = resolvePckPath(name, true);

export default [
  {
    input: `${pkgPath}/${module}`,
    output: [
      {
        file: `${pkgDistPath}/index.js`,
        name: "index.js",
        format: "umd",
      },
      {
        file: `${pkgDistPath}/client.js`,
        name: "client.js",
        format: "umd",
      },
    ],
    plugins: [
      ...getBaseRullupPlugins(),
      alias({
        entries: {
          hostConfig: `${pkgPath}/src/hostConfig.ts`,
        },
      }),
      generatePackageJson({
        inputFolder: pkgPath,
        outputFolder: pkgDistPath,
        baseContents: ({ name, description, version }) => {
          return {
            name,
            description,
            version,
            main: "index.js",
            peerDependencies: {
              react: version,
            },
          };
        },
      }),
    ],
  },
];
