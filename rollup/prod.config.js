import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";

export default [
  {
    input: "./src/index.js",
    plugins: [
      babel({
        exclude: "node_modules/**",
      }),
      json(),
    ],
    output: {
      file: "./build/bundle.js",
      format: "es",
    },
  },
];
