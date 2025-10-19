import type {
    ObjectNode,
    ObjectTree,
    PrimitiveLeaf,
    PropertyValue,
    TableCell,
    TableRow,
} from "~/types";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";
import { isNadaPropertyValue } from "~/util/tree";

export function DisplayArrayAsTable({
    originalObject,
    objectTree,
}: {
    originalObject: Record<string, PropertyValue>;
    objectTree: ObjectNode;
}) {
    if (objectTree.numberOfDescendants > 1 && objectTree.depthBelow !== 2) {
        console.error(`Invalid depth: ${objectTree.depthBelow}`, objectTree);
    }

    const tableRows: TableRow[] = Object.entries(objectTree.containedProperties).map(
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

    // Not needed anymore? const showTable = allObjectsContainSameProperties(tableRows);
    const showTable = true;

    return (
        <>
            {showTable ? (
                <div className="table-wrapper">
                    <table className="json-as-table">
                        <caption>
                            Root array as table, containing {columnHeaders.size} columns.
                        </caption>

                        <TableHeader tableRows={tableRows} columnHeaders={columnHeaders} />

                        <TableBody tableRows={tableRows} columnHeaders={columnHeaders} />
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
