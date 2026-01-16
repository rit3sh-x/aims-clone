import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
    server: {
        port: 3000,
    },
    plugins: [
        viteTsConfigPaths({
            projects: ["./tsconfig.json"],
        }),
        nitro(),
        devtools(),
        tanstackStart(),
        viteReact(),
        tailwindcss(),
    ],
});

export default config;
