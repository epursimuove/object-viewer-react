import {version as appVersion, packages} from "../../package-lock.json";
import type {Route} from "../../.react-router/types/app/routes/+types/about-page";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "NNM Object Viewer - About" },
        { name: "description", content: "Convenient visualisation of JSON objects as an object tree" },
    ];
}

export default function AboutPage() {
    return (
        <main>

            <h1>About</h1>
            
            <p>
                <em>NNM Object Viewer</em> is a convenient tool that displays a JSON object as an object tree. The tool handles objects and arrays.
            </p>
            
            <p>
                You automatically get helpful information about the actual data, which will help you analysing the content and comparing it to other objects.
            </p>
            
            
            <h2>Documentation</h2>

            <ul>
                <li>
                    Three types of rows are handled:
                    <ul>
                        <li>
                            Either a simple primitive property, i.e. a <em>leaf</em>.
                        </li>
                        <li>
                            Or a sub-object, a nested recursive object structure.
                        </li>
                        <li>
                            Or an array, also a nested recursive object structure, containing different sub-objects.
                        </li>
                    </ul>
                </li>
                
                <li>
                    The recursive structures objects and arrays are treated similar. An array can be seen as an object with the indexes as property names. Arrays and objects are handled as <em>object nodes</em>.
                </li>
                
                <li>
                    Properties are sorted ascending (for each level).
                </li>
                
                <li>
                    When clicking an object-header, that specific subtree is toggled. Only the <em>first</em> sublevel is visible when expanded, but <em>all</em> the sublevels are hidden when collapsed.
                </li>
                
                <li>
                    Makes educated guesses and assumptions about the (enhanced) types, i.e. CountryCode, LocalDate, Timestamp, Integer, etc, even if the guesses may be wrong sometimes. In this way we get much better information about the property values (most of the time). Guesses are made for string values and number values.
                    <ul>
                        <li>
                            Numbers - we can differentiate floating point numbers and integers.
                        </li>
                        <li>
                            Strings - for strings we can guess a lot from the format.
                        </li>
                    </ul>
                </li>
                
                <li>
                    When objects are collapsed, we try to assemble <em>identifying values</em> from the contained properties, so the objects can be easily distinguished. Property names used for these identifying values are "id", "name", etc.
                </li>

                <li>
                    Date and time.
                    <ul>
                        <li>
                            The UTC time zone is used for timestamps. No, there will probably not be any support for <a href="https://anders.nemonisimors.com/timestamps">timestamps</a> in other <a href="https://anders.nemonisimors.com/timeZones">time zones</a> in the future.
                        </li>

                        <li>
                            NB! The timestamp values are compared to the time when the object tree was <em>recalculated</em>, so these comparisons are not dynamically updated. You see the "now" value that is used in the <em>Statistics</em> section in the toolbar.
                        </li>

                        <li>
                            NB! The local date values are also "compared" to "now", to give you a ballpark guess. But don't take these comparisons too seriously, since they are not precise (and really are bad practice)! Local dates are compared against UTC (since we need some fixed point in time).
                        </li>
                    </ul>
                </li>
            </ul>
            
            
            <h3>Tips</h3>
            
            <p>
                A good way to see an overview of the tree structure, by getting rid of the "noise" from the leafs, is to "Expand all" rows and uncheck the "Show leafs". .
            </p>
            
            
            <h2>Current version <var>{appVersion}</var></h2>
            
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
            
            
            <h2>History</h2>
            
            <p>
                The first version of <em>NNM Object Viewer</em> was originally released in May 2025 and created with React <var>19.1</var>, React router <var>7.6</var> and TypeScript <var>5.8</var>.
            </p>
            
            <p>
                <em>NNM Object Viewer</em> is dedicated to my parents Anna-Lisa and Åke. ❤️
            </p>

        </main>
    );
}