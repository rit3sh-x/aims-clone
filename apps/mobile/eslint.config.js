const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

const { config: baseConfig } = require("@workspace/eslint-config/base");
const { reactConfig } = require("@workspace/eslint-config/react-library");

module.exports = defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**", 'dist/*'],
  },
  expoConfig,
  ...baseConfig,
  reactConfig,
);