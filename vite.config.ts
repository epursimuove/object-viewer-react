import { Temporal } from "@js-temporal/polyfill";
import { reactRouter } from "@react-router/dev/vite";
import { readFileSync } from "fs";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig(({mode}) => ({
//   base: mode === "production" ? '/projects/objectViewer/' : '/',
//   plugins: [reactRouter(), tsconfigPaths()],
// }));

const buildTime = Temporal.Now.instant();

const version = JSON.parse(
    readFileSync(new URL("./package.json", import.meta.url), "utf-8")
).version;

const lockFilePath = path.resolve(__dirname, "package-lock.json");
const lockFileContent = JSON.parse(readFileSync(lockFilePath, "utf-8"));

function getDependencyVersion(dependencyName: string): string {
    const packagePath = `node_modules/${dependencyName}`;
    return lockFileContent.packages?.[packagePath]?.version ?? "unknown";
}

export default defineConfig({
    base: "/projects/objectViewer/",
    plugins: [reactRouter(), tsconfigPaths()],

    define: {
        __BUILD_TIME__: JSON.stringify(buildTime),
        __APP_VERSION__: JSON.stringify(version),
        __REACT_VERSION__: JSON.stringify(getDependencyVersion("react")),
        __REACT_ROUTER_VERSION__: JSON.stringify(getDependencyVersion("react-router")),
        __TYPESCRIPT_VERSION__: JSON.stringify(getDependencyVersion("typescript")),
    },
});

// export default defineConfig({
//   base: '/projects/objectViewer/',
//   plugins: [reactRouter(), tsconfigPaths()],
// });
