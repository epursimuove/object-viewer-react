import type { JSX } from "react";
import type { TableRow } from "~/types";
import { TableRow as TableRowComponent } from "./table-row";

export function TableBody({ tableRows }: { tableRows: TableRow[] }): JSX.Element {
    const tableRowsHtml = tableRows.map((row: TableRow, index: number) => {
        return <TableRowComponent tableRow={row} index={index} key={index} />;
    });

    return <tbody>{tableRowsHtml}</tbody>;
}
