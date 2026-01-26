const { defineConfig, globalIgnores } = require("eslint/config");
const { config: baseConfig } = require("@workspace/eslint-config/base");
const { reactConfig } = require("@workspace/eslint-config/react-library");
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...baseConfig,
  ...reactConfig,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
