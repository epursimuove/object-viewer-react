import { StatisticsRow } from "~/components/statistics-row";
import type { DisplayRow } from "~/types";
import { now } from "~/util/dateAndTime";

export function StatisticsSection({
    displayRows,
    numberOfVisibleRows,
}: {
    displayRows: DisplayRow[];
    numberOfVisibleRows: number;
}) {
    const totalNumberOfRows: number = displayRows.length;

    const totalNumberOfLeaves: number = displayRows.filter(
        (displayRow: DisplayRow) => displayRow.rowType === "leaf"
    ).length;

    const totalNumberOfObjects: number = displayRows.filter(
        (displayRow: DisplayRow) => displayRow.rowType === "object"
    ).length;

    const totalNumberOfArrays: number = displayRows.filter(
        (displayRow: DisplayRow) => displayRow.rowType === "array"
    ).length;

    const deepestLevel: number = displayRows
        .map((displayRow: DisplayRow) => displayRow.indentationLevel)
        .reduce(
            (acc: number, currentIndentationLevel: number): number =>
                Math.max(acc, currentIndentationLevel),
            0
        );

    return (
        <details open>
            <summary>Statistics</summary>

            <StatisticsRow label="Rows" value={totalNumberOfRows} emphasize />
            <StatisticsRow label="Visible" value={numberOfVisibleRows} emphasize />
            <StatisticsRow label="Leaves" value={totalNumberOfLeaves} />
            <StatisticsRow label="Objects" value={totalNumberOfObjects} />
            <StatisticsRow label="Arrays" value={totalNumberOfArrays} />
            <StatisticsRow label="Depth" value={deepestLevel} />
            <StatisticsRow label="'Now'" value={now} />
        </details>
    );
}
