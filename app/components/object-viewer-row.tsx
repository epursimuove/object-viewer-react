import type { ArithmeticAggregation, DisplayRow } from "~/types";
import "../object-viewer/object-viewer.css";
import { useUserConfigurationContext } from "~/object-viewer/UserConfigurationContext";
import type { SyntheticEvent } from "react";
import { ObjectPropertyValue } from "~/components/object-property-value";
import { AnchoredInfoBox } from "./anchored-info-box";
import { containsExtraSpaces, prettifyArithmeticAggregation } from "~/util/util";

export function ObjectViewerRow({
    displayRow,
    toggleRow,
}: {
    displayRow: DisplayRow;
    toggleRow: (rowNumber: number, event: SyntheticEvent) => void;
}) {
    const {
        indentObjectTree,
        showPropertyType,
        showNadaValues,
        showMetaDataForLeaves,
        showMetaDataForNodes,
        showLeaves,
        showIdentifyingValues,
        setShowPropertyType,
        setShowMetaDataForLeaves,
        setShowMetaDataForNodes,
        setShowNadaValues,
        setShowLeaves,
        setShowIdentifyingValues,
    } = useUserConfigurationContext();

    const isLeaf: boolean = displayRow.rowType === "leaf";
    const isObject: boolean = displayRow.rowType === "object";
    const isArray: boolean = displayRow.rowType === "array";

    const visibleIfNada: boolean = showNadaValues || !displayRow.isNada;
    const visibleIfLeaf: boolean = showLeaves || !isLeaf;
    const visibleNode: boolean = displayRow.isVisible;

    const isVisible: boolean = visibleNode && visibleIfLeaf && visibleIfNada;

    const originalAndEnhancedDiffer: boolean =
        !isArray && // We skip arrays, even if their type is object.
        displayRow.propertyTypeEnhanced !== displayRow.propertyTypeOriginal;

    const rowItemCssClasses: string = `
        row-item-wrapper
         ${
             displayRow.propertyTypeEnhanced === "object" && displayRow.propertyValue !== null
                 ? "recursive-structure object-header"
                 : ""
         }
         ${displayRow.propertyTypeEnhanced === "array" ? "recursive-structure array-header" : ""}
         ${isLeaf && "leaf"}
         ${displayRow.hasChildren ? "contains-children" : ""}
          ${displayRow.recursiveToggleIcon === "∅" ? "empty" : ""}
          ${isVisible ? "" : "hidden"}
          `;

    const propertyNameContainsExtraSpaces = containsExtraSpaces(displayRow.propertyName);

    return (
        <div
            className={rowItemCssClasses}
            onClick={
                displayRow.hasChildren
                    ? (event) => toggleRow(displayRow.rowNumber, event)
                    : undefined
            }
        >
            <div id={`row-number-${displayRow.rowNumber}`} className={`row-number`}>
                {displayRow.rowNumber}
            </div>

            <div
                className={`row-item-padding indentation-level-${displayRow.indentationLevel} ${
                    indentObjectTree ? "" : "hidden"
                }`}
            ></div>

            <div className="recursive-toggle-icon">{displayRow.recursiveToggleIcon || ""}</div>

            <div
                className={`object-property-type ${showPropertyType ? "" : "hidden"} ${
                    originalAndEnhancedDiffer && "original-and-enhanced-differ"
                }`}
            >
                {originalAndEnhancedDiffer ? (
                    <AnchoredInfoBox
                        labelAnchor={displayRow.propertyTypeEnhanced}
                        textContent={`Actual type is '${displayRow.propertyTypeOriginal}'`}
                    />
                ) : (
                    displayRow.propertyTypeEnhanced
                )}
                {isObject && displayRow.propertyValue !== null
                    ? `(${displayRow.numberOfChildren})`
                    : ""}
                {isArray ? `[${displayRow.numberOfChildren}]` : ""}
            </div>

            <div className={`object-property-name`}>
                {displayRow.isArrayIndex && <span className="array-index">[</span>}

                <AnchoredInfoBox
                    labelAnchor={displayRow.propertyName}
                    tag="JSON path"
                    // textContent={`JSON path:\n${displayRow.path}\nArrayIndex?: ${displayRow.isArrayIndex}`}
                    textContent={`${displayRow.path}`}
                >
                    <div>{displayRow.path}</div>
                </AnchoredInfoBox>

                {propertyNameContainsExtraSpaces && (
                    <>
                        {" "}
                        <span className={`string extra-spaces`}>
                            <AnchoredInfoBox
                                labelAnchor={`😱`}
                                tag="NB!"
                                textContent={`Property name "${displayRow.propertyName}" contains extra spaces (in ${propertyNameContainsExtraSpaces}), which may cause problems!`}
                                type="warning"
                            />
                        </span>
                    </>
                )}

                {displayRow.isArrayIndex && <span className="array-index">]</span>}
            </div>

            {isLeaf ? (
                <div className="object-property-value">
                    <ObjectPropertyValue displayRow={displayRow} />
                </div>
            ) : (
                <div className="convenient-identifier">
                    {showIdentifyingValues &&
                        displayRow.convenientIdentifierWhenCollapsed &&
                        (displayRow.propertyTypeEnhanced === "array" ? (
                            displayRow.arithmeticAggregation ? (
                                <AnchoredInfoBox
                                    labelAnchor={displayRow.convenientIdentifierWhenCollapsed}
                                    tag="Aggregation"
                                    textContent={prettifyArithmeticAggregation(
                                        displayRow.arithmeticAggregation
                                    )}
                                />
                            ) : (
                                <>{displayRow.convenientIdentifierWhenCollapsed}</>
                            )
                        ) : (
                            <>&lt;{displayRow.convenientIdentifierWhenCollapsed}&gt;</>
                        ))}
                </div>
            )}

            <div
                className={`object-property-meta-data ${
                    (showMetaDataForLeaves && isLeaf) || (showMetaDataForNodes && !isLeaf)
                        ? ""
                        : "hidden"
                }`}
            >
                {displayRow.propertyMetaData}
            </div>
        </div>
    );
}
