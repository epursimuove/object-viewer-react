import type { JSX } from "react";
import type { TableRow, TableRowSorterConfiguration } from "~/types";
import { TableRow as TableRowComponent } from "./table-row";
import { sortTableBy } from "~/util/util";

export function TableBody({
    tableRows,
    columnHeaders,
    sortingOn,
}: {
    tableRows: TableRow[];
    columnHeaders: Set<string>;
    sortingOn: TableRowSorterConfiguration | null;
}): JSX.Element {
    const sortedTableRows: TableRow[] = sortTableBy(tableRows, sortingOn);

    const tableRowsHtml = sortedTableRows.map((tableRow: TableRow, index: number) => {
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
