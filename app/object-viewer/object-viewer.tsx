import {
    exampleArray,
    exampleArray2,
    exampleArray3,
    exampleObject,
} from "~/object-viewer/example-data";
import type {
    DisplayRow,
    HistoryItem,
    ObjectNode,
    ObjectTree,
    PropertyTypeEnhanced,
    PropertyValue,
} from "~/types";
import { prettifyJSON, versions } from "~/util/util";
import "./object-viewer.css";
import { type SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import { ObjectViewerRow } from "~/components/object-viewer-row";
import {
    UserConfigurationProvider,
    useUserConfigurationContext,
} from "~/object-viewer/UserConfigurationContext";
import { logInfoPretty, useLog } from "~/log-manager/LogManager";
import { Timestamp } from "~/components/timestamp";
import { FilterSection } from "./filter-section";
import { AnchoredInfoBox } from "~/components/anchored-info-box";
import {
    convertObjectToTree,
    convertTreeToDisplayRows,
    couldBeDisplayedAsTable,
    isDescendant,
} from "~/util/tree";
import { HistorySection } from "./history-section";
import { StatisticsSection } from "./statistics-section";
import { SettingsSection } from "./settings-section";
import { LinesSection } from "./lines-section";
import { JsonObjectSection } from "./json-object-section";
import { TimeSection } from "./time-section";
import { DisplayArrayAsTable } from "./display-array-as-table";
import { CopableContent } from "~/components/CopableContent";

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
        // prettifyJSON(exampleArray)
        // prettifyJSON(exampleArray2)
        // prettifyJSON(exampleArray3)
    );

    const [originalObject, setOriginalObject] = useState<Record<string, PropertyValue>>({});

    const {
        showNadaValues,
        showLeaves,
        filterOnProperty,
        filterOnPropertyTypeEnhanced,
        resetFilters,
    } = useUserConfigurationContext();

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
        const commandClick = event.nativeEvent instanceof PointerEvent && event.nativeEvent.metaKey; // Command + click should only expand first sub-level, click expands all children.

        const nextDisplayRows: DisplayRow[] = displayRows.map(
            (displayRow: DisplayRow, index: number) => {
                if (index + 1 === rowNumber) {
                    trace("displayRow, nextRowItem", displayRow, nextRowItem);
                    return nextRowItem;
                } else if (isDescendant(nextRowItem.id, displayRow.id)) {
                    const isExpanded = !commandClick && nextRowItem.isExpanded;
                    const isVisible =
                        nextRowItem.isExpanded &&
                        (!commandClick || nextRowItem.id === displayRow.parentId);

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

    const displayTableAsDefault = couldBeDisplayedAsTable(objectTree);

    logInfoPretty("DONE", false);

    return (
        <main>
            <h1>
                NNM Object Viewer{" "}
                <small>
                    <var>{versions.appVersion}</var>
                </small>
            </h1>

            <aside id="toolbar">
                <details className="menu-wrapper" open>
                    <summary accessKey="M">
                        <strong>MENU</strong>
                    </summary>

                    <form>
                        <section id="date-and-time">
                            <TimeSection />
                        </section>

                        <section>
                            <JsonObjectSection
                                originalObjectAsText={originalObjectAsText}
                                setOriginalObject={setOriginalObject}
                                setOriginalObjectAsText={setOriginalObjectAsText}
                                resetFilters={resetFilters}
                            />
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

            <details open={!displayTableAsDefault}>
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

            {displayTableAsDefault && (
                <details open>
                    <summary>
                        <h2>Array as table</h2>
                    </summary>

                    <DisplayArrayAsTable originalObject={originalObject} objectTree={objectTree} />
                </details>
            )}

            <details>
                <summary>
                    <h2>Original object</h2>
                </summary>

                <CopableContent label="JSON">{prettifyJSON(originalObject)}</CopableContent>
            </details>

            <details>
                <summary>
                    <h2>Original object converted to object tree</h2>
                </summary>

                <CopableContent label="JSON">{prettifyJSON(objectTree)}</CopableContent>
            </details>

            <details>
                <summary>
                    <h2>Object tree converted to DisplayRow[]</h2>
                </summary>

                <CopableContent label="JSON">{prettifyJSON(displayRows)}</CopableContent>
            </details>
        </main>
    );
}
