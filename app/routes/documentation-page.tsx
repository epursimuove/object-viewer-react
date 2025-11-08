import { exampleArray, exampleArray2, exampleArray3 } from "~/object-viewer/example-data";
import type { Route } from "./+types/documentation-page";
import { enhancedPropertyTypes, originalPropertyTypes } from "~/types";
import { prettifyJSON } from "~/util/util";
import { CopableContent } from "~/components/CopableContent";
import { unknownCommonPropertyTypeAncestor } from "~/object-viewer/table-header";

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

            <p>
                From{" "}
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON">
                    JSON
                </a>{" "}
                data that you provide, you automatically get helpful information about the actual
                content and it will all be presented in a beatiful object tree.
            </p>

            <ul>
                <li>
                    Two types of rows are displayed in the object tree:
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
                    CountryCode, LocalDate, Timestamp, Integer, EmailAddress, URL, Locale, etc,{" "}
                    <em>even</em> if the guesses may be wrong sometimes ("It is easier to ask for
                    forgiveness than permission"). In this way we get much better information about
                    the property values (most of the time). Guesses are made for string values and
                    number values. Many examples of these assumptions are displayed in the{" "}
                    <em>default JSON object</em>.
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
                            <em>Time</em> section in the toolbar.
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
                    <li
                        key={originalPropertyType}
                        className={
                            ["bigint", "function", "symbol", "undefined"].includes(
                                originalPropertyType
                            )
                                ? "not-in-use"
                                : ""
                        }
                    >
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

            <h2>Array as table</h2>

            <p>
                When the JSON data is an array of objects, an additional section can sometimes
                automatically be displayed. Each object is presented as a row in a structured table,
                so you easily can compare and analyse. The following conditions need to be fulfilled
                for the array of objects:
            </p>

            <ul>
                <li>the root of the JSON data should be an array</li>
                <li>the root array should contain at least two elements</li>
                <li className="not-anymore">
                    the objects should be flat (i.e. they should all have a depth of 1)
                </li>
                <li className="not-anymore">the objects should contain the same properties</li>
                <li>[more conditions to come...]</li>
            </ul>

            <p>
                The table header contains property names and calculated "common" property types for
                the property values in a column. If there is no "common" property type for a column,
                it is indicated by <code>{unknownCommonPropertyTypeAncestor}</code>.
            </p>

            <p>
                By hovering many of the cells, you can get additional info about the actual property
                values.
            </p>

            <p>
                If all the objects contain the same properties, the result will be a full table.
                Otherwise the result will be a sparse table, where some of the cells are empty
                (indicated by <code>&empty;</code>).
            </p>

            <p>
                If a table is created, the array-as-table section will be expanded by default (and
                the object tree section is collapsed).
            </p>

            <p>
                Note: Most of the fonts used in <em>NNM Object Viewer</em> are monospaced, which is
                even more important for the <em>tabular data</em> in the array-as-table solution. I
                would also argue that generally it is much more aesthetic and informative using
                monospaced fonts in tables.
            </p>

            <p>
                Note: Most of the tools in the toolbar are for the <em>object tree</em> view, so{" "}
                <em>Filters</em>, <em>Settings</em> and <em>Lines</em> functionality will not affect
                the <em>array as table</em> view.
            </p>

            <h3>Sorted rows</h3>

            <p>
                The rows in the array-as-table can be sorted by clicking on the column headers.
                Clicking the header toggles between ascending, descending and original/default
                order.
            </p>

            <p>
                The column must consist of "common" property types to be sortable. So columns with
                strings <em>or</em> numbers <em>or</em> booleans, but they can't be mixed.
            </p>

            <p>
                Strings are compared with the Swedish locale (<code>sv-SE</code>).
            </p>

            <h3>Flattened arrays</h3>

            <p>
                If the root array contains sub-objects, these are flattened before displayed in the
                table, so it will be easier to compare the sub-objects.
            </p>

            <p>
                A sub-object like <code>{"{ foo: { bar: { baz: 42 } } }"}</code> will be flattened
                to look like <code>{"{ foo.bar.baz: 42 }"}</code>. The property names from ancestors
                are kept as prefixes in the resulting property name, so it will be easier to
                distinguish the properties among different levels and different sub-objects.
            </p>

            <h4>Arrays within arrays</h4>

            <p>
                To keep the array-as-table solution from being too messy, arrays contained in the
                sub-objects are skipped from being displayed (at least for now).
            </p>

            <h3>Examples of JSON data that will be displayed as a table</h3>

            <p>
                Here are some trivial examples of JSON data that will be displayed as a table. Copy
                and paste into the <em>JSON object/array</em> textarea.
            </p>

            <details>
                <summary>An array containing similar objects with depth 1</summary>

                <CopableContent label="JSON">{prettifyJSON(exampleArray)}</CopableContent>
            </details>

            <details>
                <summary>
                    An array containing objects (some similar, some different) that are deeper (and
                    therefore flattened before display)
                </summary>

                <CopableContent label="JSON">{prettifyJSON(exampleArray2)}</CopableContent>
            </details>

            <details>
                <summary>A sparse array containing objects with different properties</summary>

                <CopableContent label="JSON">{prettifyJSON(exampleArray3)}</CopableContent>
            </details>

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
