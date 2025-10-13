import type { JSX } from "react";
import type { TableCell, TableRow } from "~/types";
import { prettifyPropertyName } from "~/util/util";

export function TableHeader({ tableRows }: { tableRows: TableRow[] }): JSX.Element {
    const tableHeadHtml = (
        <thead>
            {tableRows.length > 0 && (
                <>
                    <tr>
                        <th className="row-number">{tableRows.length}</th>

                        {tableRows[0].cells.map((cell: TableCell) => {
                            return (
                                <th key={cell.columnName}>
                                    {"" + prettifyPropertyName(cell.columnName)}
                                </th>
                            );
                        })}
                    </tr>
                    {/* <tr className="property-type-enhanced">
                        <th className="row-number"></th>

                        {tableRows[0].cells.map((cell: TableCell) => {
                            return <th key={cell.columnName}>{"" + cell.propertyTypeEnhanced}</th>;
                        })}
                    </tr> */}
                    <tr className="property-type-enhanced">
                        <th className="row-number"></th>

                        {getCommonPropertyTypeAncestorForColumns(tableRows).map(
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

function getCommonPropertyTypeAncestorForColumns(tableRows: TableRow[]): string[] {
    // Get all cells for first row.
    // If enhanced property type for each row's cell equals corresponding cell in first row,
    // then use enhanced property type.
    // If original property type for each row's cell equals corresponding cell in first row,
    // then use original property type.
    // Otherwise use "???".

    const cellsInFirstRow: TableCell[] | undefined = tableRows.at(0)?.cells;

    if (cellsInFirstRow) {
        const result: string[] = cellsInFirstRow.map((tableCell: TableCell, index: number) => {
            const enhancedPropertyTypeMatch: boolean = tableRows.every((tableRow: TableRow) => {
                return (
                    tableRow.cells.at(index)?.propertyTypeEnhanced ===
                    tableCell.propertyTypeEnhanced
                );
            });

            if (enhancedPropertyTypeMatch) {
                return tableCell.propertyTypeEnhanced;
            }

            const originalPropertyTypeMatch: boolean = tableRows.every((tableRow: TableRow) => {
                return (
                    tableRow.cells.at(index)?.propertyTypeOriginal ===
                    tableCell.propertyTypeOriginal
                );
            });

            if (originalPropertyTypeMatch) {
                return tableCell.propertyTypeOriginal;
            }

            return "???";
        });

        return result;
    }

    throw new Error("Hmmmmm, no rows found?!?");

    // return new Array(50).fill("???");
}
