import type { JSX } from "react";
import { AnchoredInfoBox } from "~/components/anchored-info-box";
import type {
    ArithmeticAggregation,
    PropertyTypeOriginal,
    PropertyValue,
    TableCell,
    TableRow,
} from "~/types";
import { calculateAggregations } from "~/util/math";
import { prettifyArithmeticAggregation } from "~/util/util";

export function TableFooter({
    tableRows,
    columnHeaders,
    commonPropertyTypeAncestorForColumns,
}: {
    tableRows: TableRow[];
    columnHeaders: Set<string>;
    commonPropertyTypeAncestorForColumns: string[];
}): JSX.Element {
    const aggregations: (ArithmeticAggregation | null)[] = calculateAggregationsForColumns(
        tableRows,
        columnHeaders,
        commonPropertyTypeAncestorForColumns
    );

    const tableFootHtml = (
        <tfoot>
            {tableRows.length > 0 && (
                <>
                    <tr className="aggregations-for-columns">
                        <th className="row-number"></th>

                        {[...columnHeaders].map((columnName: string, index: number) => {
                            return (
                                <th key={columnName}>
                                    {aggregations[index] && (
                                        <AnchoredInfoBox // TODO Make an Aggregation component... Used in ObjectViewerRow also.
                                            labelAnchor={"\u03A3"} // Sigma.
                                            tag="Aggregation"
                                            textContent={prettifyArithmeticAggregation(
                                                aggregations[index]
                                            )}
                                        />
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </>
            )}
        </tfoot>
    );

    return tableFootHtml;
}

function calculateAggregationsForColumns(
    tableRows: TableRow[],
    columnHeaders: Set<string>,
    commonPropertyTypeAncestorForColumns: string[]
): (ArithmeticAggregation | null)[] {
    const result: (ArithmeticAggregation | null)[] = [...columnHeaders].map(
        (columnName: string, index: number) => {
            const tableCells: TableCell[] = tableRows
                .map((tableRow: TableRow) => {
                    return tableRow.cellMap.get(columnName);
                })
                .filter((value) => value !== undefined);

            const cellValues: PropertyValue[] = tableCells.map(
                (tableCell: TableCell) => tableCell.cellValue
            );

            const typeOriginalOfItems: Set<PropertyTypeOriginal> = new Set(
                cellValues.map((propertyValue: PropertyValue) => typeof propertyValue)
            );

            if (typeOriginalOfItems.size === 1) {
                const arrayTypeOriginal: PropertyTypeOriginal = [...typeOriginalOfItems][0];

                if (
                    arrayTypeOriginal === "number" &&
                    !["HTTPStatus", "Zero"].includes(commonPropertyTypeAncestorForColumns[index])
                ) {
                    return calculateAggregations(cellValues as number[]);
                } else if (
                    arrayTypeOriginal === "string" &&
                    !["LocalDate", "LocalTime", "Timestamp", "CountryCode", "Locale"].includes(
                        commonPropertyTypeAncestorForColumns[index]
                    )
                ) {
                    return calculateAggregations(
                        (cellValues as string[]).map((s: string) => s.length)
                    );
                }
            }

            return null;
        }
    );

    return result;
}
