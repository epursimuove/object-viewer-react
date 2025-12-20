import { useEffect, useRef, useState } from "react";
import { useLog } from "~/log-manager/LogManager";
import type { PropertyValue } from "~/types";
import { saveHistoryToStorage, useHistoryContext } from "./HistoryContext";

const { debug, error, info } = useLog("json-object-section.tsx");

export function JsonObjectSection({
    originalObjectAsText,
    setOriginalObject,
    setOriginalObjectAsText,
    resetFilters,
}: {
    originalObjectAsText: string;
    setOriginalObject: React.Dispatch<React.SetStateAction<Record<string, PropertyValue>>>;
    setOriginalObjectAsText: React.Dispatch<React.SetStateAction<string>>;
    resetFilters: () => void;
}) {
    const jsonObjectSection = useRef<HTMLDetailsElement | null>(null);
    const jsonObjectTextArea = useRef<HTMLTextAreaElement | null>(null);

    const { savedHistory, setSavedHistory, clearSavedHistory } = useHistoryContext();

    const [parsingError, setParsingError] = useState<SyntaxError | null>();

    const [jsonObjectModified, setJsonObjectModified] = useState<boolean>(false);

    function updateOriginalObject(saveHistory = true) {
        info("Updating original object");

        setParsingError(null);

        try {
            const nextOriginalObject: Record<string, PropertyValue> =
                JSON.parse(originalObjectAsText);
            debug("nextOriginalObject", nextOriginalObject);

            setOriginalObject(nextOriginalObject);
            resetFilters();

            if (saveHistory) {
                saveHistoryToStorage(nextOriginalObject, savedHistory, setSavedHistory);
            }

            setJsonObjectModified(false);
        } catch (err) {
            error("error", err);
            console.error("error", typeof err, (err as SyntaxError).name);
            setParsingError(err as SyntaxError);
        }
    }

    useEffect(() => {
        const jsonObjectSectionDetailsElement = jsonObjectSection.current;
        const jsonObjectTextAreaElement = jsonObjectTextArea.current;

        if (jsonObjectSectionDetailsElement && jsonObjectTextAreaElement) {
            const handleToggle = () => {
                if (jsonObjectSectionDetailsElement.open) {
                    jsonObjectTextAreaElement.focus();
                }
            };

            jsonObjectSectionDetailsElement.addEventListener("toggle", handleToggle);

            // Cleanup on component unmount.
            return () => {
                jsonObjectSectionDetailsElement.removeEventListener("toggle", handleToggle);
            };
        }
    }, []);

    return (
        <details ref={jsonObjectSection} open>
            <summary accessKey="J">JSON object</summary>

            <div className={"json-object"}>
                <label htmlFor="originalObject">JSON object/array</label>
                <textarea
                    ref={jsonObjectTextArea}
                    name="originalObject"
                    id="originalObject"
                    rows={5}
                    value={originalObjectAsText}
                    placeholder="Your JSON object/array"
                    onChange={(event) => {
                        setOriginalObjectAsText(event.target.value);
                        setJsonObjectModified(true);
                    }}
                />
                {originalObjectAsText.length} characters
                <button
                    type="button"
                    onClick={() => updateOriginalObject()}
                    disabled={!jsonObjectModified}
                >
                    Recalculate
                </button>
                <div className="parsing-error">{parsingError && `${parsingError}`}</div>
            </div>
        </details>
    );
}
