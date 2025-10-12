import type { JSX } from "react";
import type { TableRow, TableCell } from "~/types";
import { TableCell as TableCellComponent } from "./table-cell";

export function TableRow({ tableRow, index }: { tableRow: TableRow; index: number }): JSX.Element {
    const tableRowElement: JSX.Element = (
        <tr>
            <td className="row-number">{index + 1}</td>
            {tableRow.cells.map((cell: TableCell, index: number) => {
                return <TableCellComponent key={index} tableCell={cell} />;
            })}
        </tr>
    );

    return tableRowElement;
}
