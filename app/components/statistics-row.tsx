import type { Temporal } from "@js-temporal/polyfill";
import { Timestamp } from "./timestamp";

export function StatisticsRow({
    label,
    value,
    emphasize = false,
}: {
    label: string;
    value: number | Temporal.Instant;
    emphasize?: boolean;
}) {
    return (
        <div className="statistics-row">
            <span className="label">{label}:</span>

            {typeof value === "number" ? (
                emphasize ? (
                    <strong className="number">{value}</strong>
                ) : (
                    <span className="number">{value}</span>
                )
            ) : (
                <Timestamp timestamp={value.toString()} />
            )}
        </div>
    );
}
