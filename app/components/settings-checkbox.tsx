import type { ChangeEvent } from "react";
import { OnOffToggle } from "./on-off-toggle";

export function SettingsCheckbox({
    label,
    currentState,
    stateUpdater,
    htmlIdentifier,
}: {
    label: string;
    currentState: boolean;
    stateUpdater: (newValue: boolean) => void;
    htmlIdentifier: string;
}) {
    return (
        <div className="settings-checkbox">
            <OnOffToggle enabled={currentState} onClickHandler={stateUpdater} />

            <input
                hidden
                type="checkbox"
                name={htmlIdentifier}
                id={htmlIdentifier}
                checked={currentState}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    stateUpdater(event.target.checked);
                }}
            />

            <label htmlFor={htmlIdentifier}>{label}</label>
        </div>
    );
}
