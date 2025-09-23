import { type RouteConfig, index, route, prefix } from "@react-router/dev/routes";

export default [
    ...prefix(`/projects/objectViewer`, [
        index("routes/object-viewer-page.tsx"),
        // route("object-viewer","routes/object-viewer-page.tsx"),
        route("docs", "routes/documentation-page.tsx"),
        route("about", "routes/about-page.tsx"),
    ]),
    // index("routes/home.tsx"),
    // index("routes/object-viewer-page.tsx"),
    // // route("object-viewer","routes/object-viewer-page.tsx"),
    // route("about","routes/about-page.tsx"),
] satisfies RouteConfig;
