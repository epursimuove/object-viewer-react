import { Timestamp } from "~/components/timestamp";
import { now } from "~/util/dateAndTime";

export function TimeSection({}) {
    return (
        <details open>
            <summary accessKey="T">Time</summary>

            <div>
                <span className="label">"Now":</span>
                <Timestamp timestamp={now.toString()} />
            </div>
        </details>
    );
}
