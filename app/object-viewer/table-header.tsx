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
                    <tr className="property-type-enhanced">
                        <th className="row-number"></th>

                        {tableRows[0].cells.map((cell: TableCell) => {
                            return <th key={cell.columnName}>{"" + cell.propertyTypeEnhanced}</th>;
                        })}
                    </tr>
                </>
            )}
        </thead>
    );

    return tableHeadHtml;
}
