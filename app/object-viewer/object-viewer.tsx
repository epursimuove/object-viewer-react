import {exampleObject} from "~/object-viewer/example-data";
import type {DisplayRow, ObjectNode, ObjectTree, PropertyValue} from "~/types";
import {convertObjectToTree, convertTreeToDisplayRows, isDescendant, now} from "~/util";
import "./object-viewer.css";
import {type SyntheticEvent, useEffect, useState} from "react";
import {version as appVersion} from "../../package-lock.json";
import {ObjectViewerRow} from "~/object-viewer/object-viewer-row";
import {UserConfigurationProvider, useUserConfigurationContext} from "~/object-viewer/UserConfigurationContext";
import {logInfoPretty, useLog} from "~/log-manager/LogManager";
import {Timestamp} from "~/object-viewer/timestamp";
import { ToolBar } from "./tool-bar";

const {debug, error, info, trace, warning} = useLog("object-viewer.tsx", "getFoo()");

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
    
    const [originalObjectAsText, setOriginalObjectAsText] =
        useState<string>(JSON.stringify(exampleObject, null, 4));

    //const foobar = JSON.parse(originalObjectAsText);
    
    const [originalObject, setOriginalObject] =
        // useState<Record<string, PropertyValue44>>(JSON.parse(originalObjectAsText));
        useState<Record<string, PropertyValue>>({});
    
    const { indentObjectTree, showPropertyType, showNadaValues, showMetaData, showLeafs, showIdentifyingValues, filterOnProperty, setIndentObjectTree, setShowPropertyType, setShowMetaData, setShowNadaValues, setShowLeafs, setShowIdentifyingValues, setFilterOnProperty } =
        useUserConfigurationContext();

    // const [indentObjectTree, setIndentObjectTree] = useState(true);
    // const [showPropertyType, setShowPropertyType] = useState(true);
    // const [showMetaData, setShowMetaData] = useState(true);
    // const [showNadaValues, setShowNadaValues] = useState(true);
    // const [showLeafs, setShowLeafs] = useState(true);

    const [parsingError, setParsingError] = useState<SyntaxError | null>();

    // const [objectTree, setObjectTree] = useState<ObjectNode44>();
    
    // const originalObject: {} = exampleObject;
    // const originalObject: {} = JSON.parse(originalObjectAsText);

    const objectTree: ObjectNode = convertObjectToTree(originalObject);

    info('originalObject', originalObject);
    
    // setObjectTree(objectTree2);

    // const displayRows: DisplayRow[] = objectTree ? convertTreeToDisplayRows(objectTree) : [];
    // let displayRows2: DisplayRow[] = convertTreeToDisplayRows(objectTree);
    // setDisplayRows(displayRows2);
    const [displayRows, setDisplayRows] = useState<DisplayRow[]>([]);
    
    //console.warn("YYYYYYYY displayRows2", displayRows2);

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
    
    const totalNumberOfLeafs: number = displayRows
        .filter((displayRow: DisplayRow) => displayRow.rowType === "leaf")
        .length;
    
    const totalNumberOfObjects: number = displayRows
        .filter((displayRow: DisplayRow) => displayRow.rowType === "object")
        .length;
    
    const totalNumberOfArrays: number = displayRows
        .filter((displayRow: DisplayRow) => displayRow.rowType === "array")
        .length;
    
    const numberOfVisibleRows: number = displayRows
        .filter((displayRow: DisplayRow) => displayRow.isVisible)
        .length;
    
    const deepestLevel: number = displayRows
        .map((displayRow: DisplayRow) => displayRow.indentationLevel)
        .reduce((acc: number, currentIndentationLevel: number): number => Math.max(acc, currentIndentationLevel), 0);

    function updateOriginalObject() {
        info("Updating original object");

        setParsingError(null);
        
        // const foo = document.getElementById("originalObject")?.textContent;
        try {
            const nextOriginalObject: Record<string, PropertyValue> = JSON.parse(originalObjectAsText);
            debug('nextOriginalObject', nextOriginalObject);

            setOriginalObject(nextOriginalObject);
            
        } catch (err) {

            error('error', err);
            setParsingError(err as SyntaxError);
        }
        
        
    }

    function expandAll(event: SyntheticEvent) {
        // event.preventDefault();
        debug("Expanding all");

        const nextDisplayRows: DisplayRow[] =
            displayRows.map((displayRow: DisplayRow) => {

                return {
                    ...displayRow,
                    isExpanded: true,
                    isVisible: true,
                    recursiveToggleIcon: displayRow.rowType === "leaf" ? "" : displayRow.hasChildren ? "-" : "∅",
                };
            });

        setDisplayRows(nextDisplayRows);
    }

    function collapseAll(event: SyntheticEvent) {
        // event.preventDefault();
        debug("Collapsing all");

        const nextDisplayRows: DisplayRow[] =
            displayRows.map((displayRow: DisplayRow) => {
                
                const keepVisible: boolean = displayRow.indentationLevel <= 1;

                return {
                    ...displayRow,
                    isExpanded: false,
                    isVisible: keepVisible,
                    recursiveToggleIcon: displayRow.rowType === "leaf" ? "" : displayRow.indentationLevel === 0 ? "-" : displayRow.hasChildren ? "+" : "∅",
                };
            });

        setDisplayRows(nextDisplayRows);
    }


    const toggleRow = (rowNumber: number, event: SyntheticEvent) => {
        debug('Toggling', rowNumber, event.currentTarget);

        const currentRowItem: DisplayRow = displayRows[rowNumber - 1];

        const nextRowItem: DisplayRow = {
            ...currentRowItem,
            isExpanded: !currentRowItem.isExpanded,
            isVisible: true,
            recursiveToggleIcon: currentRowItem.recursiveToggleIcon === "+" ? "-" : "+",
            // propertyName: `x${currentRowItem.propertyName}x`,
        };

        // const parentIndentationLevel: number = nextRowItem.indentationLevel;

        const nextDisplayRows: DisplayRow[] =
            displayRows.map((displayRow: DisplayRow, index: number) => {

                // console.error('isDescendant(nextRowItem.id, displayRow.id)', isDescendant(nextRowItem.id, displayRow.id));
                
                if (index + 1 === rowNumber) {
                    trace('displayRow, nextRowItem', displayRow, nextRowItem);
                    return nextRowItem;
                } else if (isDescendant(nextRowItem.id, displayRow.id)) {
                    // console.error('nextRowItem.id, displayRow.id', nextRowItem.id, displayRow.id);
                    return {
                        ...displayRow,
                        isExpanded: false, //nextRowItem.isExpanded,
                        isVisible: nextRowItem.isExpanded && nextRowItem.id === displayRow.parentId,
                        recursiveToggleIcon: displayRow.rowType === "leaf" ? "" : !displayRow.hasChildren ? "∅" : currentRowItem.recursiveToggleIcon === "+" ? "+" : "-",
                    }
                }
                return {
                    ...displayRow,
                };
            });

        setDisplayRows(nextDisplayRows);
    }

    const objectViewerRows = displayRows
        .filter((displayRow: DisplayRow) => {
            if (filterOnProperty !== "") {
                const matchingPropertyName: boolean =
                    displayRow.propertyName.toLowerCase().includes(filterOnProperty.toLowerCase());

                const matchingPropertyValue: boolean =
                    `${displayRow.propertyValue}`.toLowerCase().includes(filterOnProperty.toLowerCase());

                return matchingPropertyName || matchingPropertyValue;
            }
            return true;
        })
    .map((displayRow: DisplayRow) => {

        // const visibleIfNada: boolean = showNadaValues || !displayRow.isNada;
        // const visibleIfLeaf: boolean = showLeafs || displayRow.rowType !== "leaf";
        // const visibleNode: boolean = displayRow.isVisible;
        //
        //
        // const isVisible: boolean = // TODO
        //     visibleNode && visibleIfLeaf && visibleIfNada;
        //
        // // const isVisible: boolean = // TODO
        // //     (displayRow.isVisible && displayRow.rowType !== "leaf") ||
        // //     (displayRow.isVisible && showLeafs && displayRow.rowType === "leaf");
        //
        // const rowItemCssClasses: string = `
        // row-item-wrapper
        //  ${displayRow.propertyTypeEnhanced === "object" && displayRow.propertyValue !== null ? 'recursive-structure object-header' : ''}
        //  ${displayRow.propertyTypeEnhanced === "array" ? 'recursive-structure array-header' : ''}
        //  ${displayRow.hasChildren ? 'contains-children' : ''}
        //   ${displayRow.recursiveToggleIcon === "∅" ? 'empty' : ''}
        //   ${isVisible ? '' : 'hidden'}
        //   `;

        return (
            <ObjectViewerRow key={displayRow.rowNumber} displayRow={displayRow} toggleRow={toggleRow} />
        );
    });
    
    logInfoPretty("DONE", false);
    

    return (
        // <UserConfigurationProvider>

            <main>
                <h1>NNM Object Viewer <small><var>{appVersion}</var></small></h1>
                
                {/* <ToolBar displayRows={displayRows} /> */}
                <aside id="toolbar">
                    
                    <details className="menu-wrapper" open>
                        <summary>
                            <strong>MENU</strong>
                        </summary>

                        <form>
                            <section>
                                <details>
                                    <summary>
                                        JSON object
                                    </summary>

                                    <div className={"json-object"}>
                                        <label htmlFor="originalObject">JSON object/array</label>
                                        <textarea
                                            name="originalObject"
                                            id="originalObject"
                                            rows={30}
                                            cols={60}
                                            value={originalObjectAsText}
                                            placeholder="Your JSON object/array"
                                            onChange={event => {
                                                setOriginalObjectAsText(event.target.value);
                                            }}
                                        />
                                        {originalObjectAsText.length} characters
                                        <button type="button" onClick={updateOriginalObject}>Recalculate</button>

                                        <div className="parsing-error">
                                            {JSON.stringify(parsingError)}
                                        </div>
                                    </div>
                                </details>
                            </section>

                            <section id="user-settings">

                                <details open>
                                    <summary>
                                        Settings
                                    </summary>

                                    <div>
                                        <input
                                            type="checkbox"
                                            name="indentationActivated"
                                            id="indentationActivated"
                                            checked={indentObjectTree}
                                            onChange={event => {
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
                                            onChange={event => {
                                                setShowPropertyType(event.target.checked);
                                            }}
                                        />
                                        <label htmlFor="showPropertyType">Show (enhanced) property type</label>
                                    </div>

                                    <div>
                                        <input
                                            type="checkbox"
                                            name="showMetaData"
                                            id="showMetaData"
                                            checked={showMetaData}
                                            onChange={event => {
                                                setShowMetaData(event.target.checked);
                                            }}
                                        />
                                        <label htmlFor="showMetaData">Show meta data</label>
                                    </div>

                                    <div>
                                        <input
                                            type="checkbox"
                                            name="showNadaValues"
                                            id="showNadaValues"
                                            checked={showNadaValues}
                                            onChange={event => {
                                                setShowNadaValues(event.target.checked);
                                            }}
                                        />
                                        <label htmlFor="showNadaValues">Show "nada" (falsy) values</label>
                                    </div>
                                    
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="showIdentifyingValues"
                                            id="showIdentifyingValues"
                                            checked={showIdentifyingValues}
                                            onChange={event => {
                                                setShowIdentifyingValues(event.target.checked);
                                            }}
                                        />
                                        <label htmlFor="showIdentifyingValues">Show identifying values</label>
                                    </div>

                                    <div>
                                        <input
                                            type="checkbox"
                                            name="showLeafs"
                                            id="showLeafs"
                                            checked={showLeafs}
                                            onChange={event => {
                                                setShowLeafs(event.target.checked);
                                            }}
                                        />
                                        <label htmlFor="showLeafs">Show leafs (i.e. primitive values)</label>
                                    </div>

                                    <div className="button-row">
                                        <button type="button" onClick={expandAll}>Expand all</button>
                                        <button type="button" onClick={collapseAll}>Collapse (almost) all</button>
                                    </div>
                                </details>

                            </section>

                        <section id="filters">
                            <details open>
                                <summary>
                                    Filters
                                </summary>

                                <div>
                                    <label htmlFor="filterOnProperty">Property</label>
                                    <input
                                        type="text"
                                        name="filterOnProperty"
                                        id="filterOnProperty"
                                        size={15}
                                        value={filterOnProperty}
                                        onChange={event => {
                                            setFilterOnProperty(event.target.value);
                                        }}
                                    />
                                </div>

                            </details>
                        </section>

                            <section id="statistics">
                                <details open>
                                    <summary>
                                        Statistics
                                    </summary>

                                    <div>
                                        <strong>{totalNumberOfRows}</strong> rows (<strong>{numberOfVisibleRows}</strong> visible),
                                    </div>

                                    <div>
                                        {totalNumberOfLeafs} leafs
                                    </div>

                                    <div>
                                        {totalNumberOfObjects} objects
                                    </div>

                                    <div>
                                        {totalNumberOfArrays} arrays
                                    </div>

                                    <div>
                                        Depth: {deepestLevel}
                                    </div>

                                    <div>
                                        "Now": <Timestamp timestamp={now.toString()} />
                                    </div>
                                </details>
                            </section>

                        </form>
                        
                    </details>
                    
                </aside>
                
                <details open>
                    <summary>
                        <h2>Object tree</h2>
                    </summary>

                    <div className="object-viewer">
                        {objectViewerRows}
                    </div>

                </details>
                
                <details>
                    <summary>
                        <h2>Original object</h2>
                    </summary>
                    
                    <pre>
                        {JSON.stringify(originalObject, null, 4)}
                    </pre>
                    
                </details>

                <details>
                    <summary>
                        <h2>Original object converted to object tree</h2>
                    </summary>

                    <pre>
                        {JSON.stringify(objectTree, null, 4)}
                    </pre>
                    
                </details>

                <details>
                    <summary>
                        <h2>Object tree converted to DisplayRow[]</h2>
                    </summary>

                    <pre>
                        {JSON.stringify(displayRows, null, 4)}
                    </pre>
                    
                </details>
                

            </main>

        // </UserConfigurationProvider>
    );
}