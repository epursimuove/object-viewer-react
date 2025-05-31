import type {DisplayRow} from "~/types";
import "./object-viewer.css";
import {Timestamp} from "~/object-viewer/timestamp";

export function ObjectPropertyValue(
    {
        displayRow,
    }: {
        displayRow: DisplayRow,
    }
) {


    return (
        <>
            {
                (displayRow.rowType === "leaf" && displayRow.propertyTypeEnhanced !== "boolean") && displayRow.propertyTypeEnhanced !== "string" && displayRow.propertyTypeEnhanced !== "Integer" && displayRow.propertyTypeEnhanced !== "number" && displayRow.propertyTypeEnhanced !== "Timestamp" && !displayRow.isNada &&
                <>
                    {displayRow.propertyValue ? "" : "¿¿"}
                    {`${displayRow.propertyValue}`}
                </>
            }
            {
                displayRow.propertyTypeEnhanced === "boolean" &&
                <span className={`boolean ${displayRow.propertyValue ? "true" : "false"}`}>
                    {/*{displayRow.propertyValue ? "✅ \u2713" : "❌ \u2717"}*/}
                    {/* {displayRow.propertyValue ? "\u2713" : "\u2717"} */}
                    {displayRow.propertyValue ? "\u2713" : "\u00A0"}
                </span>
            }
            {
                displayRow.propertyTypeEnhanced === "string" &&
                <span className={`string ${containsExtraSpaces(displayRow.propertyValue as string) && "extra-spaces"}`} title={containsExtraSpaces(displayRow.propertyValue as string) ? "NB! Text contains extra spaces, which may cause problems!" : ""}>
                    {`${displayRow.propertyValue}`}
                </span>
            }
            {
                displayRow.propertyTypeEnhanced === "Integer" &&
                <span className="integer">
                    {`${displayRow.propertyValue}`}
                </span>
            }
            {
                displayRow.propertyTypeEnhanced === "number" &&
                <span className="floating-point-number">
                    {`${displayRow.propertyValue}`}
                </span>
            }
            {
                displayRow.isNada && displayRow.propertyTypeEnhanced !== "boolean" &&
                <span className="nada-value">
                    {`${displayRow.propertyValue}`}
                </span>
            }
            {
                displayRow.propertyTypeEnhanced === "Timestamp" &&
                <Timestamp timestamp={displayRow.propertyValue as string} />
            }
        </>
    );
}


const containsExtraSpaces = (text: string): boolean => {

    return text.startsWith(" ") || text.endsWith(" ") || text.includes("  ");
};

