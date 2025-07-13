import { exampleObject } from "~/object-viewer/example-data";
import type {
    DisplayRow,
    HistoryItem,
    ObjectNode,
    ObjectTree,
    PropertyTypeEnhanced,
    PropertyValue,
} from "~/types";
import {
    convertObjectToTree,
    convertTreeToDisplayRows,
    isDescendant,
    loadHistoryFromStorage,
    now,
    prettifySha256,
    saveHistoryToStorage,
} from "~/util";
import "./object-viewer.css";
import { type ChangeEvent, type SyntheticEvent, useEffect, useRef, useState } from "react";
import { version as appVersion } from "../../package-lock.json";
import { ObjectViewerRow } from "~/object-viewer/object-viewer-row";
import {
    UserConfigurationProvider,
    useUserConfigurationContext,
} from "~/object-viewer/UserConfigurationContext";
import { logInfoPretty, useLog } from "~/log-manager/LogManager";
import { Timestamp } from "~/object-viewer/timestamp";

const { debug, error, info, trace, warning } = useLog("object-viewer.tsx", "getFoo()");

// const jsonReplacer = (key: string, value: PropertyValue) =>
//     value instanceof Map ?
//         `<Map contains ${value.size} entries>` /*Array.from(value.entries())*/ :
//         value instanceof Set ?
//             `<Set contains ${value.size} entries>` /*Array.from(value.entries())*/ :
//             value;

// const jsonReviver = (key: string, value: PropertyValue) =>
//   Array.isArray(value) && value.every(Array.isArray) ? new Map(value) : value;

export function ObjectViewer() {
    logInfoPretty("STARTING", true);

    const [originalObjectAsText, setOriginalObjectAsText] = useState<string>(
        JSON.stringify(exampleObject, null, 4)
    );

    const [originalObject, setOriginalObject] = useState<Record<string, PropertyValue>>({});

    const {
        indentObjectTree,
        showPropertyType,
        showNadaValues,
        showMetaDataForLeaves,
        showMetaDataForNodes,
        showLeaves,
        showIdentifyingValues,
        filterOnProperty,
        filterOnPropertyTypeEnhanced,
        setIndentObjectTree,
        setShowPropertyType,
        setShowMetaDataForLeaves,
        setShowMetaDataForNodes,
        setShowNadaValues,
        setShowLeaves,
        setShowIdentifyingValues,
        setFilterOnProperty,
        setFilterOnPropertyTypeEnhanced,
        resetFilters,
    } = useUserConfigurationContext();

    const [parsingError, setParsingError] = useState<SyntaxError | null>();

    const objectTree: ObjectNode = convertObjectToTree(originalObject);

    info("originalObject", originalObject);

    const [displayRows, setDisplayRows] = useState<DisplayRow[]>([]);

    useEffect(() => {
        info(`originalObject changed`, originalObject);

        const objectTreeXXX: ObjectNode = convertObjectToTree(originalObject);

        const displayRowsXXX: DisplayRow[] = convertTreeToDisplayRows(objectTreeXXX);

        setDisplayRows(displayRowsXXX);
    }, [originalObject]); // Runs whenever `originalObject` changes

    useEffect(() => {
        info(`[MOUNTED] originalObject changed`, originalObject);

        setOriginalObject(JSON.parse(originalObjectAsText));

        const objectTreeXXX: ObjectNode = convertObjectToTree(originalObject);

        const displayRowsXXX: DisplayRow[] = convertTreeToDisplayRows(objectTreeXXX);

        setDisplayRows(displayRowsXXX);
    }, []); // Runs once on mounted.

    const totalNumberOfRows: number = displayRows.length;

    const totalNumberOfLeaves: number = displayRows.filter(
        (displayRow: DisplayRow) => displayRow.rowType === "leaf"
    ).length;

    const totalNumberOfObjects: number = displayRows.filter(
        (displayRow: DisplayRow) => displayRow.rowType === "object"
    ).length;

    const totalNumberOfArrays: number = displayRows.filter(
        (displayRow: DisplayRow) => displayRow.rowType === "array"
    ).length;

    const deepestLevel: number = displayRows
        .map((displayRow: DisplayRow) => displayRow.indentationLevel)
        .reduce(
            (acc: number, currentIndentationLevel: number): number =>
                Math.max(acc, currentIndentationLevel),
            0
        );

    function updateOriginalObject(saveHistory = true) {
        info("Updating original object");

        setParsingError(null);

        console.log(localStorage.length);

        try {
            const nextOriginalObject: Record<string, PropertyValue> =
                JSON.parse(originalObjectAsText);
            debug("nextOriginalObject", nextOriginalObject);

            setOriginalObject(nextOriginalObject);
            resetFilters();

            if (saveHistory) {
                saveHistoryToStorage(nextOriginalObject);
            }
        } catch (err) {
            error("error", err);
            setParsingError(err as SyntaxError);
        }
    }

    function expandAll(event: SyntheticEvent) {
        // event.preventDefault();
        debug("Expanding all");

        const nextDisplayRows: DisplayRow[] = displayRows.map((displayRow: DisplayRow) => {
            return {
                ...displayRow,
                isExpanded: true,
                isVisible: true,
                recursiveToggleIcon:
                    displayRow.rowType === "leaf" ? "" : displayRow.hasChildren ? "-" : "∅",
            };
        });

        setDisplayRows(nextDisplayRows);
    }

    function collapseAll(event: SyntheticEvent) {
        // event.preventDefault();
        debug("Collapsing all");

        const nextDisplayRows: DisplayRow[] = displayRows.map((displayRow: DisplayRow) => {
            const keepVisible: boolean = displayRow.indentationLevel <= 1;

            return {
                ...displayRow,
                isExpanded: false,
                isVisible: keepVisible,
                recursiveToggleIcon:
                    displayRow.rowType === "leaf"
                        ? ""
                        : displayRow.indentationLevel === 0
                        ? "-"
                        : displayRow.hasChildren
                        ? "+"
                        : "∅",
            };
        });

        setDisplayRows(nextDisplayRows);
    }

    const toggleRow = (rowNumber: number, event: SyntheticEvent) => {
        debug("Toggling", rowNumber, event.currentTarget);

        const currentRowItem: DisplayRow = displayRows[rowNumber - 1];

        const nextRowItem: DisplayRow = {
            ...currentRowItem,
            isExpanded: !currentRowItem.isExpanded,
            isVisible: true,
            recursiveToggleIcon: currentRowItem.recursiveToggleIcon === "+" ? "-" : "+",
        };

        const shiftClick = event.nativeEvent instanceof PointerEvent && event.nativeEvent.shiftKey; // Shift + click should only expand first sub-level, click expands all children.

        const nextDisplayRows: DisplayRow[] = displayRows.map(
            (displayRow: DisplayRow, index: number) => {
                if (index + 1 === rowNumber) {
                    trace("displayRow, nextRowItem", displayRow, nextRowItem);
                    return nextRowItem;
                } else if (isDescendant(nextRowItem.id, displayRow.id)) {
                    const isExpanded = !shiftClick && nextRowItem.isExpanded;
                    const isVisible =
                        nextRowItem.isExpanded &&
                        (!shiftClick || nextRowItem.id === displayRow.parentId);

                    return {
                        ...displayRow,
                        isExpanded,
                        isVisible,
                        recursiveToggleIcon:
                            displayRow.rowType === "leaf"
                                ? ""
                                : !displayRow.hasChildren
                                ? "∅"
                                : isExpanded
                                ? "-"
                                : "+",
                    };
                }
                return {
                    ...displayRow,
                };
            }
        );

        setDisplayRows(nextDisplayRows);
    };

    const visibleRows: DisplayRow[] = displayRows
        .filter((displayRow: DisplayRow) => {
            if (filterOnProperty !== "") {
                const matchingPropertyName: boolean = displayRow.propertyName
                    .toLowerCase()
                    .includes(filterOnProperty.toLowerCase());

                const matchingPropertyValue: boolean = `${displayRow.propertyValue}`
                    .toLowerCase()
                    .includes(filterOnProperty.toLowerCase());

                return matchingPropertyName || matchingPropertyValue;
            }
            return true;
        })
        .filter((displayRow: DisplayRow) => {
            if (filterOnPropertyTypeEnhanced.length > 0) {
                return filterOnPropertyTypeEnhanced.includes(displayRow.propertyTypeEnhanced);
            }
            return true;
        });

    const objectViewerRows = visibleRows.map((displayRow: DisplayRow) => {
        return (
            <ObjectViewerRow
                key={displayRow.rowNumber}
                displayRow={displayRow}
                toggleRow={toggleRow}
            />
        );
    });

    const numberOfVisibleRows: number = visibleRows
        // .filter((displayRow: DisplayRow) => displayRow.isVisible)
        .filter((displayRow: DisplayRow) => {
            const isLeaf: boolean = displayRow.rowType === "leaf";
            const visibleIfNada: boolean = showNadaValues || !displayRow.isNada;
            const visibleIfLeaf: boolean = showLeaves || !isLeaf;
            const visibleNode: boolean = displayRow.isVisible;

            const isVisible: boolean = visibleNode && visibleIfLeaf && visibleIfNada;

            return isVisible;
        }).length;

    const actualPropertyTypeEnhancedValues: PropertyTypeEnhanced[] = Array.from(
        new Set(displayRows.map((displayRow: DisplayRow) => displayRow.propertyTypeEnhanced))
    ).toSorted((a, b) => a.localeCompare(b));

    const filtersActivated = () =>
        filterOnProperty !== "" || filterOnPropertyTypeEnhanced.length > 0;

    const jsonObjectSection = useRef<HTMLDetailsElement | null>(null);
    const jsonObjectTextArea = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const jsonObjectSectionDetailsElement = jsonObjectSection.current;
        const jsonObjectTextAreaElement = jsonObjectTextArea.current;

        if (jsonObjectSectionDetailsElement && jsonObjectTextAreaElement) {
            const handleToggle = () => {
                if (jsonObjectSectionDetailsElement.open) {
                    jsonObjectTextAreaElement.focus();
                }
            };

            jsonObjectSectionDetailsElement.addEventListener("toggle", handleToggle);

            // Cleanup on component unmount.
            return () => {
                jsonObjectSectionDetailsElement.removeEventListener("toggle", handleToggle);
            };
        }
    }, []);

    const rowsPercentage: number = Math.ceil((numberOfVisibleRows / totalNumberOfRows) * 100);

    let historyItems: HistoryItem[] = loadHistoryFromStorage();

    function retrieveObjectFromHistory(historyItem: HistoryItem) {
        debug(`Retrieve object from history`);
        setOriginalObjectAsText(JSON.stringify(historyItem.object, null, 4));

        setOriginalObject(historyItem.object);
        resetFilters();
        saveHistoryToStorage(historyItem.object); // So the sorting order of the history will be updated.
    }

    logInfoPretty("DONE", false);

    return (
        <main>
            <h1>
                NNM Object Viewer{" "}
                <small>
                    <var>{appVersion}</var>
                </small>
            </h1>

            <aside id="toolbar">
                <details className="menu-wrapper" open>
                    <summary>
                        <strong>MENU</strong>
                    </summary>

                    <form>
                        <section>
                            <details ref={jsonObjectSection} open>
                                <summary>JSON object</summary>

                                <div className={"json-object"}>
                                    <label htmlFor="originalObject">JSON object/array</label>
                                    <textarea
                                        ref={jsonObjectTextArea}
                                        name="originalObject"
                                        id="originalObject"
                                        rows={15}
                                        cols={25}
                                        value={originalObjectAsText}
                                        placeholder="Your JSON object/array"
                                        onChange={(event) => {
                                            setOriginalObjectAsText(event.target.value);
                                        }}
                                    />
                                    {originalObjectAsText.length} characters
                                    <button type="button" onClick={() => updateOriginalObject()}>
                                        Recalculate
                                    </button>
                                    <div className="parsing-error">
                                        {JSON.stringify(parsingError)}
                                    </div>
                                </div>
                            </details>
                        </section>

                        <section id="history">
                            <details open>
                                <summary>History</summary>

                                <div>
                                    {/* {loadHistoryFromStorage().length} items */}
                                    {historyItems.map((historyItem: HistoryItem, index: number) => (
                                        <div
                                            key={historyItem.id}
                                            className="history-item-row"
                                            onClick={() => retrieveObjectFromHistory(historyItem)}
                                        >
                                            <span className="index">{index + 1}:</span>
                                            <span className="id">
                                                {prettifySha256(historyItem.id).toUpperCase()}
                                            </span>
                                            {/* {" "}
                                            {historyItem.timestampFirstView.toString().slice(0, 19)}
                                            {" - "}
                                            {historyItem.timestampLastView.toString().slice(0, 19)} */}
                                        </div>
                                    ))}
                                </div>
                            </details>
                        </section>

                        <section id="user-settings">
                            <details open>
                                <summary>Settings</summary>

                                <div>
                                    <input
                                        type="checkbox"
                                        name="indentationActivated"
                                        id="indentationActivated"
                                        checked={indentObjectTree}
                                        onChange={(event) => {
                                            setIndentObjectTree(event.target.checked);
                                        }}
                                    />
                                    <label htmlFor="indentationActivated">Indent object tree</label>
                                </div>

                                <div>
                                    <input
                                        type="checkbox"
                                        name="showPropertyType"
                                        id="showPropertyType"
                                        checked={showPropertyType}
                                        onChange={(event) => {
                                            setShowPropertyType(event.target.checked);
                                        }}
                                    />
                                    <label htmlFor="showPropertyType">
                                        Show (enhanced) property type
                                    </label>
                                </div>

                                <div>
                                    <input
                                        type="checkbox"
                                        name="showMetaDataForLeaves"
                                        id="showMetaDataForLeaves"
                                        checked={showMetaDataForLeaves}
                                        onChange={(event) => {
                                            setShowMetaDataForLeaves(event.target.checked);
                                        }}
                                    />
                                    <label htmlFor="showMetaDataForLeaves">
                                        Show meta data for leaves
                                    </label>
                                </div>

                                <div>
                                    <input
                                        type="checkbox"
                                        name="showMetaDataForNodes"
                                        id="showMetaDataForNodes"
                                        checked={showMetaDataForNodes}
                                        onChange={(event) => {
                                            setShowMetaDataForNodes(event.target.checked);
                                        }}
                                    />
                                    <label htmlFor="showMetaDataForNodes">
                                        Show meta data for nodes
                                    </label>
                                </div>

                                <div>
                                    <input
                                        type="checkbox"
                                        name="showIdentifyingValues"
                                        id="showIdentifyingValues"
                                        checked={showIdentifyingValues}
                                        onChange={(event) => {
                                            setShowIdentifyingValues(event.target.checked);
                                        }}
                                    />
                                    <label htmlFor="showIdentifyingValues">
                                        Show identifying values
                                    </label>
                                </div>

                                <div>
                                    <input
                                        type="checkbox"
                                        name="showNadaValues"
                                        id="showNadaValues"
                                        checked={showNadaValues}
                                        onChange={(event) => {
                                            setShowNadaValues(event.target.checked);
                                        }}
                                    />
                                    <label htmlFor="showNadaValues">
                                        Show "nada" (falsy) values
                                    </label>
                                </div>

                                <div>
                                    <input
                                        type="checkbox"
                                        name="showLeaves"
                                        id="showLeaves"
                                        checked={showLeaves}
                                        onChange={(event) => {
                                            setShowLeaves(event.target.checked);
                                        }}
                                    />
                                    <label htmlFor="showLeaves">
                                        Show leaves (i.e. primitive values)
                                    </label>
                                </div>

                                <div className="button-row">
                                    <button type="button" onClick={expandAll}>
                                        Expand all
                                    </button>
                                    <button type="button" onClick={collapseAll}>
                                        Collapse (almost) all
                                    </button>
                                </div>
                            </details>
                        </section>

                        <section id="filters">
                            <details open className={`${filtersActivated() && "filters-active"}`}>
                                <summary>Filters</summary>

                                <div className="button-row">
                                    <button type="reset" onClick={resetFilters}>
                                        Reset
                                    </button>
                                </div>

                                <div>
                                    <label htmlFor="filterOnProperty">Property (name/value)</label>
                                    <input
                                        type="text"
                                        name="filterOnProperty"
                                        id="filterOnProperty"
                                        size={15}
                                        value={filterOnProperty}
                                        onChange={(event) => {
                                            setFilterOnProperty(event.target.value);
                                        }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="filterOnPropertyTypeEnhanced">
                                        Enhanced property type{" "}
                                        <small>({actualPropertyTypeEnhancedValues.length})</small>
                                    </label>
                                    <select
                                        multiple
                                        name="filterOnPropertyTypeEnhanced"
                                        id="filterOnPropertyTypeEnhanced"
                                        size={actualPropertyTypeEnhancedValues.length}
                                        value={filterOnPropertyTypeEnhanced}
                                        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                                            const options: HTMLOptionElement[] = Array.from(
                                                event.target.selectedOptions
                                            );
                                            const values: PropertyTypeEnhanced[] = options.map(
                                                (option) => option.value as PropertyTypeEnhanced
                                            );

                                            setFilterOnPropertyTypeEnhanced(values);
                                        }}
                                    >
                                        {actualPropertyTypeEnhancedValues.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </details>
                        </section>

                        <section id="statistics">
                            <details open>
                                <summary>Statistics</summary>

                                <div>
                                    <span className="label">Rows:</span>
                                    <strong className="number">{totalNumberOfRows}</strong>
                                </div>

                                <div>
                                    <span className="label">Visible:</span>
                                    <strong className="number">{numberOfVisibleRows}</strong>
                                </div>

                                <div>
                                    <span className="label">Leaves:</span>
                                    <span className="number">{totalNumberOfLeaves}</span>
                                </div>

                                <div>
                                    <span className="label">Objects:</span>
                                    <span className="number">{totalNumberOfObjects}</span>
                                </div>

                                <div>
                                    <span className="label">Arrays:</span>
                                    <span className="number">{totalNumberOfArrays}</span>
                                </div>

                                <div>
                                    <span className="label">Depth:</span>
                                    <span className="number">{deepestLevel}</span>
                                </div>

                                <div>
                                    <span className="label">"Now":</span>
                                    <Timestamp timestamp={now.toString()} />
                                </div>
                            </details>
                        </section>
                    </form>
                </details>
            </aside>

            <details open>
                <summary>
                    <h2>
                        Object tree{" "}
                        <small>
                            {numberOfVisibleRows} of {totalNumberOfRows} ({rowsPercentage}%)
                        </small>
                    </h2>
                </summary>

                <div className="object-viewer">{objectViewerRows}</div>
            </details>

            <details>
                <summary>
                    <h2>Original object</h2>
                </summary>

                <pre>{JSON.stringify(originalObject, null, 4)}</pre>
            </details>

            <details>
                <summary>
                    <h2>Original object converted to object tree</h2>
                </summary>

                <pre>{JSON.stringify(objectTree, null, 4)}</pre>
            </details>

            <details>
                <summary>
                    <h2>Object tree converted to DisplayRow[]</h2>
                </summary>

                <pre>{JSON.stringify(displayRows, null, 4)}</pre>
            </details>
        </main>
    );
}
