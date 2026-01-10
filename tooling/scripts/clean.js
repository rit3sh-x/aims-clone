const fs = require("fs/promises");
const path = require("path");
const os = require("os");

const ROOT = process.cwd();
const HOME = os.homedir();

const targets = [
    "node_modules",
    ".expo",
    ".turbo",
    ".next",
    ".parcel-cache",
];

const homeTargets = [
    path.join(HOME, ".expo"),
    path.join(HOME, ".gradle", "caches"),
    path.join(HOME, ".android", "build-cache"),
];

async function remove(p) {
    try {
        await fs.rm(p, { recursive: true, force: true });
        console.log("✔ removed", p);
    } catch { }
}

async function removeWorkspaceNodeModules(folder) {
    const dir = path.join(ROOT, folder);
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const e of entries) {
            if (e.isDirectory()) {
                await remove(path.join(dir, e.name, "node_modules"));
                await remove(path.join(dir, e.name, ".expo"));
            }
        }
    } catch { }
}

async function main() {
    for (const t of targets) {
        await remove(path.join(ROOT, t));
    }

    await removeWorkspaceNodeModules("packages");
    await removeWorkspaceNodeModules("apps");

    for (const t of homeTargets) {
        await remove(t);
    }

    console.log("\n🧹 Expo / Metro / Android caches fully cleaned\n");
}

main();