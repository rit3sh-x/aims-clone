const { defineConfig } = require("eslint/config");

const { config: baseConfig } = require("@workspace/eslint-config/base");
const { reactConfig } = require("@workspace/eslint-config/react-library");

module.exports = defineConfig(
  {
    ignores: [".nitro/**", ".output/**", ".tanstack/**"],
  },
  ...baseConfig,
  reactConfig,
);