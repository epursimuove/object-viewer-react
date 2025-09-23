import type { Route } from "./+types/documentation-page";
import { enhancedPropertyTypes, originalPropertyTypes } from "~/types";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "NNM Object Viewer - Documentation" },
        {
            name: "description",
            content: "Convenient visualisation of JSON objects as an object tree",
        },
    ];
}

export default function DocumentationPage() {
    return (
        <main id="documentation-page">
            <h1>Documentation</h1>

            <p>
                Basic documentation and many examples can also be found in the{" "}
                <strong>default JSON object</strong>, which is displayed when entering/reloading
                site.
            </p>

            <h2>Basics</h2>

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
                            as an object with the indexes (0, 1, 2, ...) as property names.
                        </li>
                    </ul>
                </li>

                <li>Properties are sorted ascending (for each level).</li>

                <li>
                    When clicking on an object node row, the underlying subtree is toggled. By
                    default, <em>all</em> the sublevels are displayed when expanded and hidden when
                    collapsed. By cmd-clicking (on macOS) you can expand only the <em>first</em>{" "}
                    sublevel.
                </li>

                <li>
                    Makes educated guesses and assumptions about the (enhanced) property types, i.e.
                    CountryCode, LocalDate, Timestamp, Integer, EmailAddress, URL, Locale, etc, even
                    if the guesses may be wrong sometimes. In this way we get much better
                    information about the property values (most of the time). Guesses are made for
                    string values and number values. Many examples of these assumptions are
                    displayed in the <em>default JSON object</em>.
                    <ul>
                        <li>
                            Numbers - we can differentiate floating point numbers and integers. We
                            also assume that numbers in a "good range" represent epoch values or
                            HTTP status codes.
                        </li>
                        <li>
                            Strings - for strings we can guess <em>a lot</em> from the format of the
                            property values. Most of the enhanced property types are guessed from
                            strings.
                        </li>
                    </ul>
                </li>

                <li>
                    For objects, we try to assemble <em>identifying values</em> from the contained
                    properties, so the objects can be easily distinguished. Property names used for
                    these identifying values are for example "id", "name", "x", "y", "z", "width",
                    "height" and "depth".
                </li>

                <li>
                    Date and time.
                    <ul>
                        <li>
                            The <a href="https://anders.nemonisimors.com/currentTime">UTC</a> time
                            zone is (the only one) used for timestamps. No, there will probably not
                            be any support for{" "}
                            <a href="https://anders.nemonisimors.com/timestamps">timestamps</a> in
                            other <a href="https://anders.nemonisimors.com/timeZones">time zones</a>{" "}
                            in the future.
                        </li>

                        <li>
                            Epoch values can be either in seconds or milliseconds. The range for
                            seconds is <code>[1000000000, 3000000000]</code> and the range for
                            milliseconds is <code>[1000000000000, 3000000000000]</code>. These
                            ranges roughly correspond to epoch values from September 2001 to January
                            2065.
                        </li>

                        <li>
                            NB! The timestamp and epoch values are compared to the time when the
                            object tree was <em>recalculated</em>, so these comparisons are not
                            dynamically updated. You see the "now" value that is used in the{" "}
                            <em>Statistics</em> section in the toolbar.
                        </li>

                        <li>
                            NB! The <em>local date</em> values are also "compared" to "now", to give
                            you a ballpark guess. But don't take these comparisons too seriously,
                            since they are not precise (and really are bad practice)! Local dates
                            are compared against{" "}
                            <a href="https://anders.nemonisimors.com/currentTime">UTC</a> (since we
                            need some fixed point in time).
                        </li>
                    </ul>
                </li>
            </ul>

            <h2>Suspicious values</h2>

            <p>
                Strings containing extra whitespaces often result in errors. So when a string value
                contains whitespaces in the beginning or end, or if there are multiple consecutive
                whitespaces in the middle, the string value is marked as suspicious.
            </p>

            <p>
                When guessing that a string defines a <em>regular expression</em> (i.e. the enhanced
                property type is <code>RegExp</code>), the syntax of the expression may be invalid.
                In those cases the property value is marked as suspicious.
            </p>

            <h3>Property values</h3>

            <p>
                The property value is red, and by hovering the value, you get information about why
                it is suspicious.
            </p>

            <h3>Property names</h3>

            <p>
                If a property name contains extra whitespaces, that is probably even worse than
                property values containing extra whitespaces. Property names are marked with a 😱,
                if they contain extra whitespaces. By hovering the 😱, you get information about why
                it is suspicious.
            </p>

            <h2>Arithmetic aggregation</h2>

            <p>
                For arrays of type <code>number[]</code> or <code>Integer[]</code>, convenient
                values (<em>sum</em>, <em>min</em>, <em>max</em>, <em>mean</em> and <em>median</em>)
                are calculated automatically for you. These values are displayed in a popup, when
                you hover over the <code>number[]</code> or <code>Integer[]</code> labels.
            </p>

            <h2>History of objects</h2>

            <p>
                Your seven last viewed JSON objects are stored in your local storage, so you can
                easily toggle between them.
            </p>

            <p>
                The history items are tagged with convenient color markers, so they can easily be
                distinguished. Eight different colors are used, so the combinations of the two
                colors are 64 (8&times;8).
            </p>

            <h2>Filtering</h2>

            <p>You can filter on property name or property value.</p>

            <p>
                You can also filter on the enhanced property type(s). The multi-select list also
                displays the frequency of each enhanced property type. You can sort the multi-select
                list alphabetically or by frequency.
            </p>

            <h2>Marking and goto lines</h2>

            <p>
                You can easily mark lines and scroll to them. If several lines are defined, the
                scrolling is to the first line. The <em>Enter</em> key triggers. Some examples of
                the syntax that is supported:
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
                <li>
                    <code>-</code>, mark <em>all</em> lines and scroll to line 1.
                </li>
            </ul>

            <h2>JSON path</h2>

            <p>By hovering the property names, you get a popup describing the JSON path.</p>

            <h2>Property types</h2>

            <p>
                From an original property type, you can often assume an enhanced property type from
                the actual property value. These enhanced property types can contain valuable
                information.
            </p>

            <h3>Original property types</h3>

            <p>These are the {originalPropertyTypes.length} original property types:</p>

            <ol>
                {originalPropertyTypes.map((originalPropertyType) => (
                    <li key={originalPropertyType}>
                        <code>{originalPropertyType}</code>
                    </li>
                ))}
            </ol>

            <p>
                The <code>bigint</code>, <code>function</code>, <code>symbol</code> and{" "}
                <code>undefined</code> types are not used, since they by default are not handled by
                JSON.
            </p>

            <h3>Enhanced property types</h3>

            <p>These are the {enhancedPropertyTypes.length} enhanced property types:</p>

            <ol>
                {enhancedPropertyTypes.map((enhancedPropertyType) => (
                    <li key={enhancedPropertyType}>
                        <code>{enhancedPropertyType}</code>
                    </li>
                ))}
            </ol>

            <p>
                The <code>BooleanFalse</code> and <code>BooleanTrue</code> types are enhanced from{" "}
                <code>boolean</code>.
            </p>

            <p>
                The <code>Epoch</code>, <code>HTTPStatus</code>, <code>Integer</code> and{" "}
                <code>Zero</code> types are enhanced from <code>number</code>.
            </p>

            <p>
                The other enhanced property types are from <code>string</code>.
            </p>

            <h4>Regular expressions</h4>

            <p>
                The enhanced property types <code>AbsolutePath</code> and <code>RegExp</code> can be
                hard to distinguish, since they have a common format. For example the string{" "}
                <code>/foo/</code> could be both an absolute path and a regular expression. At the
                moment, <code>AbsolutePath</code> has higher priority than <code>RegExp</code>.
            </p>

            <p>
                Many of the regular expressions that are used for guessing are displayed in the{" "}
                <em>default JSON object</em>. So by filtering on <code>RegExp</code>, you can see
                what the actual regular expressions look like.
            </p>

            <p>
                If the content in the string is close enough to be a regular expression, the
                property is marked as a <code>RegExp</code>, even if the content actually is a
                syntactic disaster. The <em>intention</em> of the value may still be a regular
                expression, even if the syntax is not currently perfect ("better to acquit than to
                convict").
            </p>

            <h2>Tips</h2>

            <p>
                A good way to see an overview of the tree structure, by getting rid of the "noise"
                from the leaves, is to "Expand all" rows and uncheck the "Show leaves". (You can
                achieve the same by filtering on <code>object</code> and <code>array</code> enhanced
                property types.)
            </p>

            <p>
                Make the whole tree zebra-striped, by marking the lines with <code>-</code>.
            </p>
        </main>
    );
}
