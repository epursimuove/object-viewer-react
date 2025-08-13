import { version as appVersion, packages } from "../../package-lock.json";
import type { Route } from "../../.react-router/types/app/routes/+types/about-page";

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
        <main>
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
                analysing the content and comparing it to other objects.
            </p>

            <h2>Documentation</h2>

            <ul>
                <li>
                    Two types of rows are handled:
                    <ul>
                        <li>
                            Either a <em>simple primitive property</em>, i.e. a <em>leaf</em>.
                        </li>
                        <li>
                            Or a <em>nested recursive object structure</em>, which can be either an{" "}
                            <em>object</em> or an <em>array</em>. These two recursive structures,
                            called <em>object nodes</em>, are treated similar. An array can be seen
                            as an object with the indexes as property names.
                        </li>
                        {/* <ul>
                            <li>
                                A sub-object.
                            </li>
                            <li>
                                An array.
                            </li>
                        </ul> */}
                    </ul>
                </li>

                <li>Properties are sorted ascending (for each level).</li>

                <li>
                    When clicking on an object node row, the underlying subtree is toggled. By
                    default, <em>all</em> the sublevels are displayed when expanded and hidden when
                    collapsed. By shift-clicking you can expand only the <em>first</em> sublevel.
                </li>

                <li>
                    Makes educated guesses and assumptions about the (enhanced) types, i.e.
                    CountryCode, LocalDate, Timestamp, Integer, EmailAddress, URL, Locale, etc, even
                    if the guesses may be wrong sometimes. In this way we get much better
                    information about the property values (most of the time). Guesses are made for
                    string values and number values. You see examples of these assumptions in the
                    default JSON object, which is displayed when entering/reloading site.
                    <ul>
                        <li>
                            Numbers - we can differentiate floating point numbers and integers. We
                            also assume that numbers in a "good range" represent epoch values.
                        </li>
                        <li>Strings - for strings we can guess a lot from the format.</li>
                    </ul>
                </li>

                <li>
                    When objects are collapsed, we try to assemble <em>identifying values</em> from
                    the contained properties, so the objects can be easily distinguished. Property
                    names used for these identifying values are "id", "name", etc.
                </li>

                <li>
                    Date and time.
                    <ul>
                        <li>
                            The <a href="https://anders.nemonisimors.com/currentTime">UTC</a> time
                            zone is used for timestamps. No, there will probably not be any support
                            for <a href="https://anders.nemonisimors.com/timestamps">timestamps</a>{" "}
                            in other{" "}
                            <a href="https://anders.nemonisimors.com/timeZones">time zones</a> in
                            the future.
                        </li>

                        <li>
                            Epoch values can be either in seconds or milliseconds. The range for
                            seconds is <code>[1000000000, 3000000000]</code> and the range for
                            milliseconds is <code>[1000000000000, 3000000000000]</code>. The ranges
                            roughly correspond to epoch values in the years 2001 to 2064.
                        </li>

                        <li>
                            NB! The timestamp and epoch values are compared to the time when the
                            object tree was <em>recalculated</em>, so these comparisons are not
                            dynamically updated. You see the "now" value that is used in the{" "}
                            <em>Statistics</em> section in the toolbar.
                        </li>

                        <li>
                            NB! The local date values are also "compared" to "now", to give you a
                            ballpark guess. But don't take these comparisons too seriously, since
                            they are not precise (and really are bad practice)! Local dates are
                            compared against UTC (since we need some fixed point in time).
                        </li>
                    </ul>
                </li>
            </ul>

            <h3>Suspicious values</h3>

            <p>
                Strings containing extra whitespaces often result in errors. So when a string value
                contains whitespaces in the beginning or end, or if there are multiple consecutive
                whitespaces in the middle, the string value is marked as suspicious. The value is
                red, and by hovering the value, you get information about why it is suspicious.
            </p>

            <h3>Arithmetic aggregation</h3>

            <p>
                For arrays of type <code>number[]</code> or <code>Integer[]</code>, convenient
                values (<em>sum</em>, <em>min</em>, <em>max</em>, <em>mean</em> and <em>median</em>)
                are calculated automatically for you. These values are displayed in a popup, when
                you hover over the <code>number[]</code> or <code>Integer[]</code> labels.
            </p>

            <h3>History of objects</h3>

            <p>
                Your seven last viewed JSON objects are stored in your local storage, so you can
                easily toggle between them.
            </p>

            <p>
                The history items are tagged with convenient color markers, so they can easily be
                distinguished. Eight different colors are used, so the combinations of the two
                colors are 64 (8&times;8).
            </p>

            <h3>Marking and goto lines</h3>

            <p>
                You can easily mark lines and scroll to them. If several lines are defined, the
                scrolling is to the first line. Some examples of the syntax that is supported:
            </p>

            <ul>
                <li>
                    <code>10</code>, mark and scroll to line 10.
                </li>
                <li>
                    <code>10-</code>, mark lines from 10 to end and scroll to line 10.
                </li>
                <li>
                    <code>-10</code>, mark lines from 1 to 10 and scroll to line 1.
                </li>
                <li>
                    <code>10 20 30</code>, mark lines 10, 20, and 30 and scroll to line 10.
                </li>
                <li>
                    <code>10-20 30-40</code>, mark lines 10 to 20 and lines 30 to 40 and scroll to
                    line 10.
                </li>
            </ul>

            <h3>Tips</h3>

            <p>
                A good way to see an overview of the tree structure, by getting rid of the "noise"
                from the leaves, is to "Expand all" rows and uncheck the "Show leaves".
            </p>

            <h2>
                Current version <var>{appVersion}</var>
            </h2>

            <ul>
                <li>
                    React: <var>{packages["node_modules/react"].version}</var>
                </li>
                <li>
                    React router: <var>{packages["node_modules/react-router"].version}</var>
                </li>
                <li>
                    TypeScript: <var>{packages["node_modules/typescript"].version}</var>
                </li>
            </ul>

            <h2>
                History of <em>NNM Object Viewer</em>
            </h2>

            <p>
                The first version of <em>NNM Object Viewer</em> was originally released in May 2025
                and created with React <var>19.1</var>, React router <var>7.6</var> and TypeScript{" "}
                <var>5.8</var>.
            </p>

            <p>
                The code is available at{" "}
                <a href="https://github.com/epursimuove/object-viewer-react">GitHub</a>.
            </p>

            <p>
                <em>NNM Object Viewer</em> is dedicated to my parents Anna-Lisa and Åke. ❤️
            </p>
        </main>
    );
}
