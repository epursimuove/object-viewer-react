import type { JSX } from "react";
import type { TableRow, TableRowSorterConfiguration } from "~/types";
import { prettifyPropertyName } from "~/util/util";
import { unknownCommonPropertyTypeAncestor } from "./display-array-as-table";

export function TableHeader({
    tableRows,
    columnHeaders,
    sortingOn,
    handleSortOrderChange,
    commonPropertyTypeAncestorForColumns,
}: {
    tableRows: TableRow[];
    columnHeaders: Set<string>;
    sortingOn: TableRowSorterConfiguration | null;
    handleSortOrderChange: (columnName: string) => void;
    commonPropertyTypeAncestorForColumns: string[];
}): JSX.Element {
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
