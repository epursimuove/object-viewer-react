export function OnOffToggle({
    enabled,
    onClickHandler,
}: {
    enabled: boolean;
    onClickHandler: (newValue: boolean) => void;
}) {
    return (
        <span
            className={`on-off-toggle ${enabled ? "on" : "off"}`}
            onClick={() => onClickHandler(!enabled)}
        >
            &nbsp;
            <span className="toggle-position">&nbsp;</span>
        </span>
    );
}
