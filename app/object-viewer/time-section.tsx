import { Timestamp } from "~/components/timestamp";
import { now } from "~/util/dateAndTime";
import { currentLocale, displayNameLocale } from "~/util/util";
import { handleMenuStateToggled, useMenuStateContext } from "./MenuStateContext";

export function TimeSection({}) {
    const { menuState, setMenuState } = useMenuStateContext();

    return (
        <details
            open={menuState.sections.timeSectionExpanded}
            onToggle={(event) =>
                handleMenuStateToggled(event, menuState, setMenuState, "timeSectionExpanded")
            }
        >
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
