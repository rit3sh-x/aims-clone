const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const rnUiPath = path.resolve(workspaceRoot, "packages/rn-ui");

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname);

config.watchFolders = [workspaceRoot, rnUiPath];

config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
    path.join(projectRoot, "node_modules"),
    path.join(workspaceRoot, "node_modules"),
];

config.resolver.extraNodeModules = {
    "@workspace/rn-ui": rnUiPath,
};

module.exports = withUniwindConfig(config, {
    cssEntryFile: "../../packages/rn-ui/src/styles/globals.css",
    dtsFile: "./uniwind-types.d.ts",
});