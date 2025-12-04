import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import replace from "@rollup/plugin-replace";
import path from "path";
import { resolvePckPath } from "../utils";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    replace({
      __DEV__: true,
      preventAssignment: true,
    }),
    react(),
  ],
  resolve: {
    alias: [
      {
        find: "react",
        replacement: resolvePckPath("react"),
      },
      {
        find: "react-dom",
        replacement: resolvePckPath("react-dom"),
      },
      {
        find: "hostConfig",
        replacement: path.resolve(
          __dirname,
          "../../packages/react-dom/src/hostConfig.ts"
        ),
      },
    ],
  },
});
