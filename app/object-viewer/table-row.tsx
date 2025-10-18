import type { JSX } from "react";
import type { TableRow, TableCell } from "~/types";
import { TableCell as TableCellComponent } from "./table-cell";

export function TableRow({
    tableRow,
    index,
    columnHeaders,
}: {
    tableRow: TableRow;
    index: number;
    columnHeaders: Set<string>;
}): JSX.Element {
    const tableRowElement: JSX.Element = (
        <>
            <tr>
                <td className="row-number">{index + 1}</td>

                {[...columnHeaders].map((columnName: string, index: number) => {
                    const tableCell: TableCell | undefined = tableRow.cellMap.get(columnName);

                    return tableCell ? (
                        <TableCellComponent key={index} tableCell={tableCell} />
                    ) : (
                        <td className="empty-cell" key={index}>
                            &empty;
                        </td>
                    );
                })}
            </tr>
        </>
    );

    return tableRowElement;
}
