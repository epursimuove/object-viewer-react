import type { ChangeEvent } from "react";

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
        <div>
            <input
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
