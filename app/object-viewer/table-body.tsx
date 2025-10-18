import type { JSX } from "react";
import type { TableRow } from "~/types";
import { TableRow as TableRowComponent } from "./table-row";

export function TableBody({
    tableRows,
    columnHeaders,
}: {
    tableRows: TableRow[];
    columnHeaders: Set<string>;
}): JSX.Element {
    const tableRowsHtml = tableRows.map((tableRow: TableRow, index: number) => {
        return (
            <TableRowComponent
                tableRow={tableRow}
                index={index}
                key={index}
                columnHeaders={columnHeaders}
            />
        );
    });

    return <tbody>{tableRowsHtml}</tbody>;
}
