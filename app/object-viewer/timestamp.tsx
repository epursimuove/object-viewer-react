import {regExpTimestamp} from "~/util";

export function Timestamp(
    {
        timestamp
    }: {timestamp: string}) {

    const timestampParts: TimestampParts = divideTimestamp(timestamp);

    return (
        <time className="timestamp" dateTime={timestamp}>
            <span>
                {`${timestampParts.datePart}`}
            </span>
            <span>
                T
            </span>
            <span>
                {`${timestampParts.timePart}`}
            </span>
            <span>
                Z
            </span>
        </time>
    );
}

interface TimestampParts {
    datePart: string;
    timePart: string;
}

const divideTimestamp = (timestamp: string): TimestampParts => {

    const matches: RegExpMatchArray | null = timestamp.match(regExpTimestamp)

    if (matches) {
        return {
            datePart: matches[1],
            timePart: matches[2],
        };
    }

    throw new Error(`Strange timestamp ${timestamp}`);
};
