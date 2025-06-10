import type {DisplayRow} from "~/types";
import "./object-viewer.css";
import {useUserConfigurationContext} from "~/object-viewer/UserConfigurationContext";
import type {SyntheticEvent} from "react";
import {ObjectPropertyValue} from "~/object-viewer/object-property-value";

export function ObjectViewerRow(
    {
        displayRow,
        toggleRow,
    }: {
        displayRow: DisplayRow,
        toggleRow: (rowNumber: number, event: SyntheticEvent) => void,
    }
) {

    const {indentObjectTree, showPropertyType, showNadaValues, showMetaData, showLeafs, showIdentifyingValues, setShowPropertyType, setShowMetaData, setShowNadaValues, setShowLeafs, setShowIdentifyingValues} =
        useUserConfigurationContext();

    const isLeaf: boolean = displayRow.rowType === "leaf";
    const isObject: boolean = displayRow.rowType === "object";
    const isArray: boolean = displayRow.rowType === "array";
    
    const visibleIfNada: boolean = showNadaValues || !displayRow.isNada;
    const visibleIfLeaf: boolean = showLeafs || !isLeaf;
    const visibleNode: boolean = displayRow.isVisible;

    const isVisible: boolean =
        visibleNode && visibleIfLeaf && visibleIfNada;

    const originalAndEnhancedDiffer: boolean =
        !isArray && // We skip arrays, even if their type is object.
        displayRow.propertyTypeEnhanced !== displayRow.propertyTypeOriginal;

    const rowItemCssClasses: string = `
        row-item-wrapper
         ${displayRow.propertyTypeEnhanced === "object" && displayRow.propertyValue !== null ? 'recursive-structure object-header' : ''}
         ${displayRow.propertyTypeEnhanced === "array" ? 'recursive-structure array-header' : ''}
         ${isLeaf && 'leaf'}
         ${displayRow.hasChildren ? 'contains-children' : ''}
          ${displayRow.recursiveToggleIcon === "∅" ? 'empty' : ''}
          ${isVisible ? '' : 'hidden'}
          `;

    return (
        <div
            className={rowItemCssClasses}
            onClick={displayRow.hasChildren ? (event) => toggleRow(displayRow.rowNumber, event) : undefined}
        >

            <div className={`row-number`}>
                {displayRow.rowNumber}
            </div>

            <div className={`row-item-padding indentation-level-${displayRow.indentationLevel} ${indentObjectTree ? '' : 'hidden'}`}></div>

            <div className="recursive-toggle-icon">
                {displayRow.recursiveToggleIcon || ""}
            </div>

            <div
                className={`object-property-type ${showPropertyType ? '' : 'hidden'} ${originalAndEnhancedDiffer && 'original-and-enhanced-differ'}`}
                title={originalAndEnhancedDiffer ? `Actual type is '${displayRow.propertyTypeOriginal}'` : undefined}
            >
                {displayRow.propertyTypeEnhanced}
                {isObject && displayRow.propertyValue !== null ? `(${displayRow.numberOfChildren})` : ''}
                {isArray ? `[${displayRow.numberOfChildren}]` : ''}
            </div>

            <div className={`object-property-name`}>
                {displayRow.propertyName}
            </div>
            
            {
                isLeaf ?
                    (
                        <div className="object-property-value">
                            <ObjectPropertyValue displayRow={displayRow} />
                        </div>
                    ) : (
                        <div className="convenient-identifier">
                            {
                                showIdentifyingValues && displayRow.convenientIdentifierWhenCollapsed &&
                                <>
                                    &lt;{displayRow.convenientIdentifierWhenCollapsed}&gt;
                                </>
                            }
                        </div>
                    )
            }
            
            <div className={`object-property-meta-data ${showMetaData && isLeaf ? '' : 'hidden'}`}>
                {displayRow.propertyMetaData}
            </div>

        </div>
    );
}