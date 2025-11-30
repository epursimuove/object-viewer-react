import type { JSX, ReactNode } from "react";

let counter = 0;

export function AnchoredInfoBox({
    labelAnchor,
    textContent,
    children,
    type = "info",
    tag,
}: {
    labelAnchor: string | JSX.Element;
    textContent?: string;
    children?: ReactNode;
    type?: "info" | "warning" | "error";
    tag?: string;
}) {
    counter++;
    return (
        <span className="anchored-info-box">
            <span className="info-box-anchor" style={{ anchorName: `--anchor-${counter}` }}>
                {labelAnchor}
            </span>

            <div
                className={`info-box type-${type}`}
                style={{ positionAnchor: `--anchor-${counter}` }}
            >
                <div className="info-box-tag">
                    <div>{tag}</div>
                    {/* <div>{type}</div> */}
                </div>

                <div>{children ? children : textContent}</div>
            </div>
        </span>
    );
}
