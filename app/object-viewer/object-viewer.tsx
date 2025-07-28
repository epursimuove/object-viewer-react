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
    improveColor,
    isDescendant,
    now,
    prettifyJSON,
} from "~/util";
import "./object-viewer.css";
import { type ChangeEvent, type SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { version as appVersion } from "../../package-lock.json";
import { ObjectViewerRow } from "~/components/object-viewer-row";
import {
    UserConfigurationProvider,
    useUserConfigurationContext,
} from "~/object-viewer/UserConfigurationContext";
import { logInfoPretty, useLog } from "~/log-manager/LogManager";
import { Timestamp } from "~/components/timestamp";
import { ColorIndicator } from "../components/color-indicator";
import { SettingsCheckbox } from "../components/settings-checkbox";
import { StatisticsRow } from "../components/statistics-row";
import { prettifySha256, saveHistoryToStorage, useHistoryContext } from "./HistoryContext";
import { FilterSection } from "./filter-section";
import { AnchoredInfoBox } from "~/components/anchored-info-box";

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
        prettifyJSON(exampleObject)
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

    const { savedHistory, setSavedHistory, clearSavedHistory } = useHistoryContext();

    const [parsingError, setParsingError] = useState<SyntaxError | null>();

    const [jsonObjectModified, setJsonObjectModified] = useState<boolean>(false);

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

        try {
            const nextOriginalObject: Record<string, PropertyValue> =
                JSON.parse(originalObjectAsText);
            debug("nextOriginalObject", nextOriginalObject);

            setOriginalObject(nextOriginalObject);
            resetFilters();

            if (saveHistory) {
                saveHistoryToStorage(nextOriginalObject, savedHistory, setSavedHistory);
            }

            setJsonObjectModified(false);
        } catch (err) {
            error("error", err);
            console.error("error", typeof err, (err as SyntaxError).name);
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

    function retrieveObjectFromHistory(historyItem: HistoryItem) {
        debug(`Retrieve object from history`);
        setOriginalObjectAsText(prettifyJSON(historyItem.object));

        setOriginalObject(historyItem.object);
        resetFilters();
        rearrangeHistory(historyItem);
    }

    function rearrangeHistory(historyItem: HistoryItem) {
        const index: number = savedHistory.findIndex(
            (historyItem2: HistoryItem) => historyItem.id === historyItem2.id
        );

        saveHistoryToStorage(historyItem.object, savedHistory, setSavedHistory);
    }

    function clearHistory() {
        debug(`Clearing history`);

        clearSavedHistory();
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
                                            setJsonObjectModified(true);
                                        }}
                                    />
                                    {originalObjectAsText.length} characters
                                    <button
                                        type="button"
                                        onClick={() => updateOriginalObject()}
                                        disabled={!jsonObjectModified}
                                    >
                                        Recalculate
                                    </button>
                                    <div className="parsing-error">
                                        {parsingError && `${parsingError}`}
                                    </div>
                                </div>
                            </details>
                        </section>

                        <section id="history">
                            <details open>
                                <summary>History</summary>

                                <div>
                                    {/* {loadHistoryFromStorage().length} items */}
                                    {savedHistory.map((historyItem: HistoryItem, index: number) => (
                                        <div
                                            key={historyItem.id}
                                            className="history-item-row"
                                            onClick={() => retrieveObjectFromHistory(historyItem)}
                                            title={`Used ${historyItem.timestampFirstView
                                                .toString()
                                                .slice(0, 10)} - ${historyItem.timestampLastView
                                                .toString()
                                                .slice(0, 10)}`}
                                        >
                                            <span className="index">{index + 1}</span>

                                            <span className="id">
                                                {prettifySha256(historyItem.id).toUpperCase()}
                                            </span>

                                            <ColorIndicator
                                                primaryColor={`#${improveColor(
                                                    prettifySha256(historyItem.id, 6)
                                                )}`}
                                                secondaryColor={`#${improveColor(
                                                    prettifySha256(historyItem.id, 12).slice(0, 6)
                                                )}`}
                                            />
                                        </div>
                                    ))}

                                    {savedHistory.length > 0 && (
                                        <button type="button" onClick={clearHistory}>
                                            Clear history
                                        </button>
                                    )}
                                </div>
                            </details>
                        </section>

                        <section id="user-settings">
                            <details open>
                                <summary>Settings</summary>

                                <SettingsCheckbox
                                    label="Indent object tree"
                                    currentState={indentObjectTree}
                                    stateUpdater={setIndentObjectTree}
                                    htmlIdentifier="indentationActivated"
                                />

                                <SettingsCheckbox
                                    label="Show (enhanced) property type"
                                    currentState={showPropertyType}
                                    stateUpdater={setShowPropertyType}
                                    htmlIdentifier="showPropertyType"
                                />

                                <SettingsCheckbox
                                    label="Show meta data for leaves"
                                    currentState={showMetaDataForLeaves}
                                    stateUpdater={setShowMetaDataForLeaves}
                                    htmlIdentifier="showMetaDataForLeaves"
                                />

                                <SettingsCheckbox
                                    label="Show meta data for nodes"
                                    currentState={showMetaDataForNodes}
                                    stateUpdater={setShowMetaDataForNodes}
                                    htmlIdentifier="showMetaDataForNodes"
                                />

                                <SettingsCheckbox
                                    label="Show identifying values"
                                    currentState={showIdentifyingValues}
                                    stateUpdater={setShowIdentifyingValues}
                                    htmlIdentifier="showIdentifyingValues"
                                />

                                <SettingsCheckbox
                                    label="Show 'nada' (falsy) values"
                                    currentState={showNadaValues}
                                    stateUpdater={setShowNadaValues}
                                    htmlIdentifier="showNadaValues"
                                />

                                <SettingsCheckbox
                                    label="Show leaves (i.e. primitive values)"
                                    currentState={showLeaves}
                                    stateUpdater={setShowLeaves}
                                    htmlIdentifier="showLeaves"
                                />

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
                            <FilterSection displayRows={displayRows} />
                        </section>

                        <section id="statistics">
                            <details open>
                                <summary>Statistics</summary>

                                <StatisticsRow label="Rows" value={totalNumberOfRows} emphasize />
                                <StatisticsRow
                                    label="Visible"
                                    value={numberOfVisibleRows}
                                    emphasize
                                />
                                <StatisticsRow label="Leaves" value={totalNumberOfLeaves} />
                                <StatisticsRow label="Objects" value={totalNumberOfObjects} />
                                <StatisticsRow label="Arrays" value={totalNumberOfArrays} />
                                <StatisticsRow label="Depth" value={deepestLevel} />
                                <StatisticsRow label="'Now'" value={now} />
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

                <pre>{prettifyJSON(originalObject)}</pre>
            </details>
            <details>
                <summary>
                    <h2>Original object converted to object tree</h2>
                </summary>

                <pre>{prettifyJSON(objectTree)}</pre>
            </details>
            <details>
                <summary>
                    <h2>Object tree converted to DisplayRow[]</h2>
                </summary>

                <pre>{prettifyJSON(displayRows)}</pre>
            </details>
        </main>
    );
}
