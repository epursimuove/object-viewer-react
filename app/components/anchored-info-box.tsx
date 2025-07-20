let counter = 0;

export function AnchoredInfoBox({
    label,
    textContent,
    type = "info",
}: {
    label: string;
    textContent: string;
    type?: "info" | "warning" | "error";
}) {
    counter++;
    return (
        <span className="anchored-info-box">
            <span className="info-box-anchor" style={{ anchorName: `--anchor-${counter}` }}>
                {label}
            </span>

            <div
                className={`info-box type-${type}`}
                style={{ positionAnchor: `--anchor-${counter}` }}
            >
                {textContent}
            </div>
        </span>
    );
}
