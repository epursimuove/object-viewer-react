import type { JSX } from "react";
import { ArithmeticAggregation as ArithmeticAggregationComponent } from "~/components/arithmetic-aggregation";
import type {
    ArithmeticAggregation,
    CommonPropertyTypeAncestor,
    PropertyTypeOriginal,
    PropertyValue,
    TableCell,
    TableRow,
} from "~/types";
import { calculateAggregations } from "~/util/math";
import {
    excludedAggregationNumberPropertyTypes,
    excludedAggregationStringPropertyTypes,
    prettifyArithmeticAggregation,
} from "~/util/util";

export function TableFooter({
    tableRows,
    columnHeaders,
    commonPropertyTypeAncestorForColumns,
}: {
    tableRows: TableRow[];
    columnHeaders: Set<string>;
    commonPropertyTypeAncestorForColumns: CommonPropertyTypeAncestor[];
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
                                        <ArithmeticAggregationComponent
                                            labelAnchor={"\u03A3"}
                                            arithmeticAggregation={aggregations[index]}
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
    commonPropertyTypeAncestorForColumns: CommonPropertyTypeAncestor[]
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
                    !excludedAggregationNumberPropertyTypes.includes(
                        commonPropertyTypeAncestorForColumns[index]
                    )
                ) {
                    return calculateAggregations(cellValues as number[]);
                } else if (
                    arrayTypeOriginal === "string" &&
                    !excludedAggregationStringPropertyTypes.includes(
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
