import { Temporal } from "@js-temporal/polyfill";
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig(({mode}) => ({
//   base: mode === "production" ? '/projects/objectViewer/' : '/',
//   plugins: [reactRouter(), tsconfigPaths()],
// }));

const buildTime = Temporal.Now.instant();

export default defineConfig({
    base: "/projects/objectViewer/",
    plugins: [reactRouter(), tsconfigPaths()],

    define: {
        __BUILD_TIME__: JSON.stringify(buildTime),
    },
});

// export default defineConfig({
//   base: '/projects/objectViewer/',
//   plugins: [reactRouter(), tsconfigPaths()],
// });
