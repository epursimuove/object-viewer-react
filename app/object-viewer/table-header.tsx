import type { JSX } from "react";
import type {
    PropertyTypeEnhanced,
    PropertyTypeOriginal,
    TableCell,
    TableRow,
    TableRowSorterConfiguration,
} from "~/types";
import { prettifyPropertyName } from "~/util/util";

export function TableHeader({
    tableRows,
    columnHeaders,
    sortingOn,
    handleSortOrderChange,
}: {
    tableRows: TableRow[];
    columnHeaders: Set<string>;
    sortingOn: TableRowSorterConfiguration | null;
    handleSortOrderChange: (columnName: string) => void;
}): JSX.Element {
    const commonPropertyTypeAncestorForColumns: string[] = getCommonPropertyTypeAncestorForColumns(
        tableRows,
        columnHeaders
    );

    const tableHeadHtml = (
        <thead>
            {tableRows.length > 0 && (
                <>
                    <tr>
                        <th className="row-number">{tableRows.length}</th>

                        {[...columnHeaders].map((columnName: string, index: number) => {
                            const columnIsSortable =
                                commonPropertyTypeAncestorForColumns[index] !==
                                unknownCommonPropertyTypeAncestor;

                            const sortedOnThisColumn = sortingOn?.columnName === columnName;

                            return (
                                <th
                                    key={columnName}
                                    className={`${columnIsSortable ? "sorting-possible" : ""} ${sortedOnThisColumn ? "sorting-on" : ""} ${sortedOnThisColumn ? (sortingOn.ascending ? "ascending" : "descending") : ""}`}
                                    {...(columnIsSortable
                                        ? { onClick: () => handleSortOrderChange(columnName) }
                                        : {})}
                                >
                                    {"" + prettifyPropertyName(columnName)}
                                </th>
                            );
                        })}
                    </tr>

                    <tr className="original-property-name">
                        <th className="row-number"></th>

                        {[...columnHeaders].map((columnName: string) => {
                            return <th key={columnName}>{"" + columnName}</th>;
                        })}
                    </tr>

                    <tr className="property-type-enhanced">
                        <th className="row-number"></th>

                        {commonPropertyTypeAncestorForColumns.map(
                            (propertyType: string, index: number) => {
                                return <th key={index}>{propertyType}</th>;
                            }
                        )}
                    </tr>
                </>
            )}
        </thead>
    );

    return tableHeadHtml;
}

export const unknownCommonPropertyTypeAncestor = "???";

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
