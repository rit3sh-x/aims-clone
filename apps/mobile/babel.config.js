module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "@workspace/rn-ui": "../../packages/rn-ui/src",
                        "@": "./src",
                    },
                },
            ],
        ],
    };
};