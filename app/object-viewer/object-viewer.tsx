import { exampleObject } from "~/object-viewer/example-data";
import type {
    DisplayRow,
    HistoryItem,
    ObjectNode,
    ObjectTree,
    PropertyTypeEnhanced,
    PropertyValue,
} from "~/types";
import { prettifyJSON } from "~/util/util";
import "./object-viewer.css";
import { type SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { version as appVersion } from "../../package-lock.json";
import { ObjectViewerRow } from "~/components/object-viewer-row";
import {
    UserConfigurationProvider,
    useUserConfigurationContext,
} from "~/object-viewer/UserConfigurationContext";
import { logInfoPretty, useLog } from "~/log-manager/LogManager";
import { Timestamp } from "~/components/timestamp";
import { saveHistoryToStorage, useHistoryContext } from "./HistoryContext";
import { FilterSection } from "./filter-section";
import { AnchoredInfoBox } from "~/components/anchored-info-box";
import { convertObjectToTree, convertTreeToDisplayRows, isDescendant } from "~/util/tree";
import { HistorySection } from "./history-section";
import { StatisticsSection } from "./statistics-section";
import { SettingsSection } from "./settings-section";
import { LinesSection } from "./lines-section";

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
        showNadaValues,
        showLeaves,
        filterOnProperty,
        filterOnPropertyTypeEnhanced,
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

    function expandAll(event?: SyntheticEvent) {
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

    const calculateRowsPercentage = (): number => {
        const percentage: number = (numberOfVisibleRows / totalNumberOfRows) * 100;
        return percentage > 50 ? Math.floor(percentage) : Math.ceil(percentage);
    };

    const rowsPercentage: number = calculateRowsPercentage();

    function handleRetrievalFromHistory(historyItem: HistoryItem) {
        debug("Retrieve from history", historyItem.id);
        setOriginalObjectAsText(prettifyJSON(historyItem.object));

        setOriginalObject(historyItem.object);
        resetFilters();
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
                            <HistorySection
                                handleRetrievalFromHistory={handleRetrievalFromHistory}
                            />
                        </section>

                        <section id="user-settings">
                            <SettingsSection expandAll={expandAll} collapseAll={collapseAll} />
                        </section>

                        <section id="filters">
                            <FilterSection displayRows={displayRows} />
                        </section>

                        <section id="goto-line">
                            <LinesSection
                                totalNumberOfRows={totalNumberOfRows}
                                expandAll={expandAll}
                            />
                        </section>

                        <section id="statistics">
                            <StatisticsSection
                                displayRows={displayRows}
                                numberOfVisibleRows={numberOfVisibleRows}
                            />
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
