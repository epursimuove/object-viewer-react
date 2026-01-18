import { versions } from "~/util/util";
import type { Route } from "../../.react-router/types/app/routes/+types/about-page";
// import { enhancedPropertyTypes, originalPropertyTypes } from "~/types";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "NNM Object Viewer - About" },
        {
            name: "description",
            content: "Convenient visualisation of JSON objects as an object tree",
        },
    ];
}

export default function AboutPage() {
    return (
        <main id="about-page">
            <h1>About</h1>

            <p>
                <em>NNM Object Viewer</em> is a convenient tool that displays{" "}
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON">
                    JSON
                </a>{" "}
                data as an object tree. The tool handles objects and arrays.
            </p>

            <p>
                You automatically get helpful information about the actual data, which will help you
                analyse, examine and understand the content and compare it to other objects. The{" "}
                <em>NNM Object Viewer</em> can be of great help when fixing errors. You will most
                certainly save a lot of time, when having to work with JSON data, and also learn a
                lot on the way.
            </p>

            <h2>Disclaimer</h2>

            <p>
                As always, delivered as is, with the best of intentions, but no guarantees and no
                liabilities for errors.
            </p>

            <p>Best experience for me in January 2026 has been in the following browsers:</p>

            <ul>
                <li>
                    <em>macOS</em>
                </li>

                <ul>
                    <li>
                        <em>Google Chrome</em> <var>144.0</var>
                    </li>
                    <li>
                        (<em>Firefox</em> <var>147.0</var>)
                    </li>
                    <li>
                        (<em>Safari</em> <var>26.1</var>)
                    </li>
                </ul>

                <li>
                    <em>Android</em>
                </li>

                <ul>
                    <li>
                        <em>Firefox</em> <var>147.0</var>
                    </li>
                    <li>
                        <em>Google Chrome</em> <var>143.0</var>
                    </li>
                </ul>
            </ul>

            <h2>
                History of <em>NNM Object Viewer</em>
            </h2>

            <p>
                The first version of <em>NNM Object Viewer</em> was originally released in May 2025
                and created with React <var>19.1</var>, React router <var>7.6</var> and TypeScript{" "}
                <var>5.8</var>.
            </p>

            <h3>
                Current version <var>{versions.appVersion}</var>
            </h3>

            <ul>
                <li>
                    React: <var>{versions.reactVersion}</var>
                </li>
                <li>
                    React router: <var>{versions.reactRouterVersion}</var>
                </li>
                <li>
                    TypeScript: <var>{versions.typescriptVersion}</var>
                </li>
            </ul>

            <h2>Source code</h2>

            <p>
                The code is available at{" "}
                <a href="https://github.com/epursimuove/object-viewer-react">GitHub</a>.
            </p>

            <h2>Dedication</h2>

            <p>
                <em>NNM Object Viewer</em> is dedicated to my parents Anna-Lisa and Åke. ❤️
            </p>
        </main>
    );
}
