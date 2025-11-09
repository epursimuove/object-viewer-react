import type {
    ObjectNode,
    ObjectTree,
    PrimitiveLeaf,
    PropertyTypeEnhanced,
    PropertyTypeOriginal,
    PropertyValue,
    TableCell,
    TableRow,
    TableRowSorterConfiguration,
} from "~/types";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";
import { convertObjectToTree, couldBeDisplayedAsTable, isNadaPropertyValue } from "~/util/tree";
import { flattenObjectIfNeeded } from "~/util/util";
import { useLog } from "~/log-manager/LogManager";
import { useState } from "react";
import { TableFooter } from "./table-footer";

const { debug, info } = useLog("display-array-as-table.tsx");

export function DisplayArrayAsTable({
    originalObject,
    objectTree,
}: {
    originalObject: Record<string, PropertyValue>;
    objectTree: ObjectNode;
}) {
    info("Setting up DisplayArrayAsTable");

    let objectTreeForArrayAsTable: ObjectNode = objectTree;

    const shouldBeFlattenedBeforeDisplayedAsTable: boolean =
        typeof originalObject === "object" &&
        Array.isArray(originalObject) &&
        objectTree.depthBelow > 2;

    if (shouldBeFlattenedBeforeDisplayedAsTable) {
        debug(`Flattening object with max-depth ${objectTree.depthBelow} before displaying`);
        const originalObjectWithArrayAtRoot: Record<string, PropertyValue>[] =
            originalObject as unknown as Record<string, PropertyValue>[]; // TODO How to fix TypeScript craziness?!?

        const flattenedObject: Record<string, PropertyValue>[] = originalObjectWithArrayAtRoot.map(
            (subObject: Record<string, PropertyValue>) => flattenObjectIfNeeded(subObject)
            //   ) as unknown as Record<string, PropertyValue> // TODO How to fix TypeScript craziness?!?
        );

        const flattenedObjectTree: ObjectNode | null = convertObjectToTree(flattenedObject);

        if (flattenedObjectTree) {
            objectTreeForArrayAsTable = flattenedObjectTree;
        }
    }

    if (
        objectTreeForArrayAsTable.numberOfDescendants > 1 &&
        objectTreeForArrayAsTable.depthBelow !== 2
    ) {
        console.error(
            `Invalid depth: ${objectTreeForArrayAsTable.depthBelow}`,
            objectTreeForArrayAsTable
        );
    }

    const tableRows: TableRow[] = Object.entries(objectTreeForArrayAsTable.containedProperties).map(
        ([_index, arrayElement]: [string, ObjectTree]) => {
            const cellMap: Map<string, TableCell> = new Map<string, TableCell>(); // columnName -> TableCell.

            const cells: TableCell[] =
                arrayElement.nodeType === "object"
                    ? Object.entries((arrayElement as ObjectNode)["containedProperties"]).map(
                          ([_index, property]: [string, ObjectTree]) => {
                              if (property.nodeType !== "leaf") {
                                  console.error(`Why is ${property.propertyName} not a leaf?`);
                                  throw new Error(`Why is ${property.propertyName} not a leaf?`);
                              }
                              const primitiveLeaf = property as PrimitiveLeaf;

                              return {
                                  columnName: primitiveLeaf["propertyName"],
                                  propertyTypeOriginal: primitiveLeaf["propertyTypeOriginal"],
                                  propertyTypeEnhanced: primitiveLeaf["propertyTypeEnhanced"],
                                  cellValue: primitiveLeaf["propertyValue"],
                                  primitiveLeaf: {
                                      ...primitiveLeaf,
                                      rowType: "leaf",
                                      isNada: isNadaPropertyValue(property),
                                  },
                              };
                          }
                      )
                    : [];

            // Build the mapping.
            cells.forEach((tableCell: TableCell) => {
                cellMap.set(tableCell.columnName, tableCell);
            });

            return {
                cellMap,
            };
        }
    );

    const columnHeaders: Set<string> = createColumnHeaders(tableRows);

    const [sortingOn, setSortingOn] = useState<TableRowSorterConfiguration | null>(null);

    const handleSortOrderChange = (columnName: string) => {
        debug(`Sort on ${columnName}`);

        if (sortingOn) {
            if (sortingOn.columnName === columnName) {
                if (!sortingOn.ascending) {
                    setSortingOn(null);
                } else {
                    setSortingOn({ columnName, ascending: !sortingOn.ascending });
                }
            } else {
                setSortingOn({ columnName, ascending: true });
            }
        } else {
            setSortingOn({ columnName, ascending: true });
        }
    };

    const commonPropertyTypeAncestorForColumns: string[] = getCommonPropertyTypeAncestorForColumns(
        tableRows,
        columnHeaders
    );

    // Not needed anymore? const showTable = allObjectsContainSameProperties(tableRows);
    const showTable = true;

    return (
        <>
            {showTable ? (
                <div className="table-wrapper">
                    <table className="json-as-table">
                        <caption>
                            Root array as table, containing{" "}
                            <strong>{columnHeaders.size} columns</strong> and{" "}
                            <strong>{tableRows.length} rows</strong>.
                            {shouldBeFlattenedBeforeDisplayedAsTable &&
                                " Note that original JSON array was flattened before display."}
                        </caption>

                        <TableHeader
                            tableRows={tableRows}
                            columnHeaders={columnHeaders}
                            sortingOn={sortingOn}
                            handleSortOrderChange={handleSortOrderChange}
                            commonPropertyTypeAncestorForColumns={
                                commonPropertyTypeAncestorForColumns
                            }
                        />

                        <TableBody
                            tableRows={tableRows}
                            columnHeaders={columnHeaders}
                            sortingOn={sortingOn}
                        />

                        <TableFooter
                            tableRows={tableRows}
                            columnHeaders={columnHeaders}
                            commonPropertyTypeAncestorForColumns={
                                commonPropertyTypeAncestorForColumns
                            }
                        />
                    </table>
                </div>
            ) : (
                <div>The array does not contain similar objects.</div>
            )}
        </>
    );
}

function createColumnHeaders(tableRows: TableRow[]): Set<string> {
    const columnHeaders: Set<string> = new Set<string>();

    tableRows.forEach((tableRow: TableRow) => {
        [...tableRow.cellMap.values()].forEach((tableCell: TableCell, index: number) => {
            columnHeaders.add(tableCell.columnName);
        });
    });

    const columnHeadersSorted: Set<string> = new Set(
        [...columnHeaders].toSorted((a, b) => a.localeCompare(b))
    );

    debug(`Created ${columnHeadersSorted.size} columns`, columnHeadersSorted);

    return columnHeadersSorted;
}

function allObjectsContainSameProperties(tableRows: TableRow[]): boolean {
    const firstRow: TableRow | undefined = tableRows.at(0);
    const cellsInFirstRow: TableCell[] = firstRow ? [...firstRow.cellMap.values()] : [];

    const numberOfProperties: number = cellsInFirstRow.length;

    if (numberOfProperties > 0) {
        return tableRows.every(
            (tableRow: TableRow) =>
                tableRow.cellMap.size === numberOfProperties &&
                [...tableRow.cellMap.values()].every((tableCell: TableCell) => {
                    const matchingCell: TableCell | undefined = cellsInFirstRow.find(
                        (tableCellFirstRow: TableCell) =>
                            tableCell.columnName === tableCellFirstRow.columnName
                    );

                    if (matchingCell) {
                        return true;
                    }
                })
        );
    }

    return false;
}

function getCommonPropertyTypeAncestorForColumns(
    tableRows: TableRow[],
    columnHeaders: Set<string>
): string[] {
    // Get all cells for first row.
    // If enhanced property type for each row's cell equals corresponding cell in first row,
    // then use enhanced property type.
    // If original property type for each row's cell equals corresponding cell in first row,
    // then use original property type.
    // Otherwise use "???".

    const cellMapInFirstRow: Map<string, TableCell> | undefined = tableRows.at(0)?.cellMap;

    if (cellMapInFirstRow?.size) {
        const result: string[] = [...columnHeaders].map((columnName: string, index: number) => {
            let commonPropertyTypeEnhanced: PropertyTypeEnhanced | undefined;

            const enhancedPropertyTypeMatch: boolean = tableRows.every((tableRow: TableRow) => {
                if (
                    commonPropertyTypeEnhanced === undefined &&
                    tableRow.cellMap.get(columnName)?.propertyTypeEnhanced
                ) {
                    commonPropertyTypeEnhanced =
                        tableRow.cellMap.get(columnName)?.propertyTypeEnhanced;
                }
                return (
                    tableRow.cellMap.get(columnName) === undefined ||
                    tableRow.cellMap.get(columnName)?.propertyTypeEnhanced ===
                        commonPropertyTypeEnhanced
                );
            });

            if (enhancedPropertyTypeMatch && commonPropertyTypeEnhanced) {
                return commonPropertyTypeEnhanced;
            }

            let commonPropertyTypeOriginal: PropertyTypeOriginal | undefined;

            const originalPropertyTypeMatch: boolean = tableRows.every((tableRow: TableRow) => {
                if (
                    commonPropertyTypeOriginal === undefined &&
                    tableRow.cellMap.get(columnName)?.propertyTypeEnhanced
                ) {
                    commonPropertyTypeOriginal =
                        tableRow.cellMap.get(columnName)?.propertyTypeOriginal;
                }

                return (
                    tableRow.cellMap.get(columnName) === undefined ||
                    tableRow.cellMap.get(columnName)?.propertyTypeOriginal ===
                        commonPropertyTypeOriginal
                );
            });

            if (originalPropertyTypeMatch && commonPropertyTypeOriginal) {
                return commonPropertyTypeOriginal;
            }

            return unknownCommonPropertyTypeAncestor;
        });

        return result;
    }

    throw new Error("Hmmmmm, no rows found?!?");

    // return new Array(50).fill("???");
}

export const unknownCommonPropertyTypeAncestor = "???";
