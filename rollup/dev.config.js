import babel from "rollup-plugin-babel";
import json from "@rollup/plugin-json";
import run from "@rollup/plugin-run";

export default [
  {
    input: "./src/index.js",
    watch: {
      include: "./src/**",
      clearScreen: false,
      exclude: ["node_modules/**"],
    },
    plugins: [
      babel({
        exclude: "node_modules/**",
      }),
      json(),
      run(),
    ],
    output: {
      file: "./build/bundle.js",
      format: "es",
    },
  },
];

/**
 * OOC: https://hoangvvo.com/blog/node-es6-rollup
 */
