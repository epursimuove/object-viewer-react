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
import { type ChangeEvent, type SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { version as appVersion } from "../../package-lock.json";
import { ObjectViewerRow } from "~/components/object-viewer-row";
import {
    UserConfigurationProvider,
    useUserConfigurationContext,
} from "~/object-viewer/UserConfigurationContext";
import { logInfoPretty, useLog } from "~/log-manager/LogManager";
import { Timestamp } from "~/components/timestamp";
import { SettingsCheckbox } from "../components/settings-checkbox";
import { saveHistoryToStorage, useHistoryContext } from "./HistoryContext";
import { FilterSection } from "./filter-section";
import { AnchoredInfoBox } from "~/components/anchored-info-box";
import { convertObjectToTree, convertTreeToDisplayRows, isDescendant } from "~/util/tree";
import { HistorySection } from "./history-section";
import { StatisticsSection } from "./statistics-section";

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

    const [gotoLine, setGotoLine] = useState<string>("");
    const [gotoLineModified, setGotoLineModified] = useState<boolean>(false);
    const gotoLineModifiedCallback = useRef<null | (() => void)>(null);

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

    useEffect(() => {
        info(`gotoLine modified`, gotoLine);

        if (gotoLineModifiedCallback.current) {
            trace("Calling callback");
            gotoLineModifiedCallback.current();
            gotoLineModifiedCallback.current = null;
            setGotoLineModified(false);
        }
    }, [gotoLineModified]);

    interface LineNumbers {
        min?: number;
        max?: number;
    }

    const regExpGotoLines: RegExp = /^[\d\- ]*$/;

    const getLineNumbers = (userInputLineNumbers: string): LineNumbers[] => {
        const result: LineNumbers[] = [];

        if (userInputLineNumbers.length > 0 && regExpGotoLines.test(userInputLineNumbers)) {
            const parts: string[] = userInputLineNumbers.split(" ");

            for (const part of parts) {
                if (part.startsWith("-")) {
                    result.push({ max: parseInt(part.slice(1)) });
                } else if (part.endsWith("-")) {
                    result.push({ min: parseInt(part.slice(0, -1)) });
                } else if (part.includes("-")) {
                    const [minString, maxString] = part.split("-");
                    result.push({ min: parseInt(minString), max: parseInt(maxString) });
                } else {
                    const minAndMax = parseInt(part);
                    result.push({ min: minAndMax, max: minAndMax });
                }
            }
        }

        return result;
    };

    const markAndGotoLines = (lineNumbers: LineNumbers[]): void => {
        let scrolledIntoView = false;

        for (const { min, max } of lineNumbers) {
            for (
                let lineNumber = min || 1;
                lineNumber <= (max || totalNumberOfRows);
                lineNumber++
            ) {
                const rowElement = document.getElementById(
                    `row-number-${lineNumber}`
                )?.parentElement;

                if (
                    rowElement &&
                    rowElement.classList.contains("row-item-wrapper") &&
                    0 < lineNumber &&
                    lineNumber <= totalNumberOfRows
                ) {
                    rowElement?.classList.add("active-goto-line");

                    if (!scrolledIntoView) {
                        rowElement?.scrollIntoView({ behavior: "smooth", block: "center" });
                        scrolledIntoView = true;
                    }
                }
            }
        }
    };

    function scrollLineIntoView(potentialLineNumbers: string) {
        info(`Goto lines ${potentialLineNumbers}`);

        document
            .querySelectorAll(".active-goto-line")
            ?.forEach((element) => element.classList.remove("active-goto-line"));

        const lineNumbers: LineNumbers[] = getLineNumbers(potentialLineNumbers);

        if (lineNumbers.length > 0) {
            expandAll();

            gotoLineModifiedCallback.current = () => {
                markAndGotoLines(lineNumbers);
            };

            setGotoLineModified(true);
        }
    }

    function handleScrollIntoView(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            scrollLineIntoView(gotoLine);
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

                        <section id="goto-line">
                            <details open>
                                <summary>Lines</summary>

                                <div>
                                    <label htmlFor="gotoLine">
                                        Mark line(s) and scroll to line
                                    </label>
                                    <input
                                        type="text"
                                        name="gotoLine"
                                        id="gotoLine"
                                        size={20}
                                        value={gotoLine}
                                        onChange={(event) => {
                                            setGotoLine(event.target.value);
                                        }}
                                        onKeyUp={handleScrollIntoView}
                                    />
                                </div>
                            </details>
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
