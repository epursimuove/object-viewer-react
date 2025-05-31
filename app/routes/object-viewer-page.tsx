import {ObjectViewer} from "~/object-viewer/object-viewer";
import type {Route} from "../../.react-router/types/app/routes/+types/object-viewer-page";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "NNM Object Viewer" },
        { name: "description", content: "Convenient visualisation of JSON objects as an object tree" },
    ];
}

export default function ObjectViewerPage() {
    return <ObjectViewer />;
}