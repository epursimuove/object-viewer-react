import type { DisplayRow } from "~/types";
import "../object-viewer/object-viewer.css";
import { Timestamp } from "~/components/timestamp";
import { AnchoredInfoBox } from "./anchored-info-box";
import { containsExtraSpaces, verifyRegExp } from "~/util/util";

export function ObjectPropertyValue({ displayRow }: { displayRow: DisplayRow }) {
    const textContainsExtraSpaces =
        displayRow.propertyTypeEnhanced === "string" &&
        containsExtraSpaces(displayRow.propertyValue as string);

    const strangeTimeZone =
        displayRow.propertyTypeEnhanced === "TimeZone" &&
        displayRow.propertyMetaData?.includes("Error");

    const strangeRegExp =
        displayRow.propertyTypeEnhanced === "RegExp" &&
        verifyRegExp(displayRow.propertyValue as string);

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
                displayRow.propertyTypeEnhanced !== "TimeZone" &&
                displayRow.propertyTypeEnhanced !== "RegExp" &&
                !displayRow.isNada && (
                    <span className="enhanced-from-string">
                        {displayRow.propertyValue ? "" : "¿¿"}
                        {`${displayRow.propertyValue}`}
                    </span>
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
                            labelAnchor={`${displayRow.propertyValue}`}
                            tag="NB!"
                            textContent={`Text contains extra spaces (in ${textContainsExtraSpaces}), which may cause problems!`}
                            type="warning"
                        />
                    ) : (
                        `${displayRow.propertyValue}`
                    )}
                </span>
            )}

            {displayRow.propertyTypeEnhanced === "RegExp" && (
                <span className={`regular-expression ${strangeRegExp && "strange-reg-exp"}`}>
                    {strangeRegExp ? (
                        <AnchoredInfoBox
                            labelAnchor={`${displayRow.propertyValue}`}
                            tag="NB!"
                            textContent={`${strangeRegExp}`}
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

            {displayRow.propertyTypeEnhanced === "TimeZone" && (
                <span className={`time-zone ${strangeTimeZone && "strange-time-zone"}`}>
                    {strangeTimeZone ? (
                        <AnchoredInfoBox
                            labelAnchor={`${displayRow.propertyValue}`}
                            tag="NB!"
                            type="warning"
                        >
                            Looks like a proper time zone, but no match was found!
                        </AnchoredInfoBox>
                    ) : (
                        `${displayRow.propertyValue}`
                    )}
                </span>
            )}
        </>
    );
}
