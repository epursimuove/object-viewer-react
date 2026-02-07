import { Timestamp } from "~/components/timestamp";
import { now } from "~/util/dateAndTime";
import { currentLocale, displayNameLocale } from "~/util/util";

export function TimeSection({}) {
    return (
        <details open>
            <summary accessKey="T">Time</summary>

            <div>
                <span className="label">"Now":</span>
                <Timestamp timestamp={now.toString()} />
            </div>

            <div>
                <span className="label">Locale:</span>
                <code>{currentLocale}</code> ({displayNameLocale})
            </div>
        </details>
    );
}
