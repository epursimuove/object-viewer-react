import { Timestamp } from "~/components/timestamp";
import { now } from "~/util/dateAndTime";

export function TimeSection({}) {
    return (
        <details open>
            <summary>Time</summary>

            <div>
                <span className="label">"Now":</span>
                <Timestamp timestamp={now.toString()} />
            </div>
        </details>
    );
}
