import type { DisplayRow } from "~/types";
import "../object-viewer/object-viewer.css";
import { Timestamp } from "~/components/timestamp";
import { AnchoredInfoBox } from "./anchored-info-box";

export function ObjectPropertyValue({ displayRow }: { displayRow: DisplayRow }) {
    const textContainsExtraSpaces =
        displayRow.propertyTypeEnhanced === "string" &&
        containsExtraSpaces(displayRow.propertyValue as string);

    return (
        <>
            {displayRow.rowType === "leaf" &&
                displayRow.propertyTypeOriginal !== "boolean" &&
                displayRow.propertyTypeEnhanced !== "string" &&
                displayRow.propertyTypeEnhanced !== "Integer" &&
                displayRow.propertyTypeEnhanced !== "number" &&
                displayRow.propertyTypeEnhanced !== "Timestamp" &&
                displayRow.propertyTypeEnhanced !== "LocalDate" &&
                displayRow.propertyTypeEnhanced !== "LocalTime" &&
                !displayRow.isNada && (
                    <>
                        {displayRow.propertyValue ? "" : "¿¿"}
                        {`${displayRow.propertyValue}`}
                    </>
                )}
            {displayRow.propertyTypeOriginal === "boolean" && (
                <span className={`boolean ${displayRow.propertyValue ? "true" : "false"}`}>
                    {displayRow.propertyValue ? "\u2713" : "\u00A0"}
                </span>
            )}
            {displayRow.propertyTypeEnhanced === "string" && (
                <span className={`string ${textContainsExtraSpaces && "extra-spaces"}`}>
                    {textContainsExtraSpaces ? (
                        <AnchoredInfoBox
                            label={`${displayRow.propertyValue}`}
                            textContent={`NB! Text contains extra spaces (in ${textContainsExtraSpaces}),\nwhich may cause problems!`}
                            type="warning"
                        />
                    ) : (
                        `${displayRow.propertyValue}`
                    )}
                </span>
            )}
            {displayRow.propertyTypeEnhanced === "Integer" && (
                <span className="integer">{`${displayRow.propertyValue}`}</span>
            )}
            {displayRow.propertyTypeEnhanced === "number" && (
                <span className="floating-point-number">{`${displayRow.propertyValue}`}</span>
            )}
            {displayRow.isNada && displayRow.propertyTypeOriginal !== "boolean" && (
                <span className="nada-value">{`${displayRow.propertyValue}`}</span>
            )}
            {displayRow.propertyTypeEnhanced === "Timestamp" && (
                <Timestamp timestamp={displayRow.propertyValue as string} />
            )}
            {displayRow.propertyTypeEnhanced === "LocalDate" && (
                <span className="local-date">{`${displayRow.propertyValue}`}</span>
            )}
            {displayRow.propertyTypeEnhanced === "LocalTime" && (
                <span className="local-time">{`${displayRow.propertyValue}`}</span>
            )}
        </>
    );
}

const containsExtraSpaces = (
    text: string
):
    | null
    | "start"
    | "middle"
    | "end"
    | "start-middle"
    | "start-end"
    | "middle-end"
    | "start-middle-end" => {
    let result: string[] = [];

    if (text.startsWith(" ")) {
        result.push("start");
    }
    if (text.includes("  ")) {
        result.push("middle");
    }
    if (text.endsWith(" ")) {
        result.push("end");
    }

    if (result.length > 0) {
        return result.join("-") as
            | "start"
            | "middle"
            | "end"
            | "start-middle"
            | "start-end"
            | "middle-end"
            | "start-middle-end";
    }

    return null;
};
