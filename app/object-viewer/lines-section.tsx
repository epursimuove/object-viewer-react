import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { useLog } from "~/log-manager/LogManager";
import { createFocusEnablerForSection } from "~/util/eventListeners";
import { handleMenuStateToggled, useMenuStateContext } from "./MenuStateContext";

const { info, trace } = useLog("lines-section.tsx");

interface LineNumbers {
    min?: number;
    max?: number;
}

const regExpGotoLines: RegExp = /^[\d\- ]*$/;

const getLineNumbers = (userInputLineNumbers: string): LineNumbers[] => {
    const result: LineNumbers[] = [];

    if (userInputLineNumbers.length > 0 && regExpGotoLines.test(userInputLineNumbers)) {
        const parts: string[] = userInputLineNumbers.split(" ");

        for (const part of parts) {
            if (part.startsWith("-")) {
                result.push({ max: parseInt(part.slice(1)) });
            } else if (part.endsWith("-")) {
                result.push({ min: parseInt(part.slice(0, -1)) });
            } else if (part.includes("-")) {
                const [minString, maxString] = part.split("-");
                result.push({ min: parseInt(minString), max: parseInt(maxString) });
            } else {
                const minAndMax = parseInt(part);
                result.push({ min: minAndMax, max: minAndMax });
            }
        }
    }

    return result;
};

export function LinesSection({
    totalNumberOfRows,
    expandAll,
}: {
    totalNumberOfRows: number;
    expandAll: (event?: SyntheticEvent) => void;
}) {
    const { menuState, setMenuState } = useMenuStateContext();

    const [gotoLine, setGotoLine] = useState<string>("");
    const [gotoLineModified, setGotoLineModified] = useState<boolean>(false);
    const gotoLineModifiedCallback = useRef<null | (() => void)>(null);

    const linesSectionRef = useRef<HTMLDetailsElement | null>(null);
    const inputElementRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        createFocusEnablerForSection(linesSectionRef, inputElementRef);
    }, []);

    useEffect(() => {
        info(`gotoLine modified`, gotoLine);

        if (gotoLineModifiedCallback.current) {
            trace("Calling callback");
            gotoLineModifiedCallback.current();
            gotoLineModifiedCallback.current = null;
            setGotoLineModified(false);
        }
    }, [gotoLineModified]);

    const markAndGotoLines = (lineNumbers: LineNumbers[]): void => {
        let scrolledIntoView = false;

        for (const { min, max } of lineNumbers) {
            for (
                let lineNumber = min || 1;
                lineNumber <= (max || totalNumberOfRows);
                lineNumber++
            ) {
                const rowElement = document.getElementById(
                    `row-number-${lineNumber}`,
                )?.parentElement;

                if (
                    rowElement &&
                    rowElement.classList.contains("row-item-wrapper") &&
                    0 < lineNumber &&
                    lineNumber <= totalNumberOfRows
                ) {
                    rowElement?.classList.add("active-goto-line");

                    if (!scrolledIntoView) {
                        rowElement?.scrollIntoView({ behavior: "smooth", block: "center" });
                        scrolledIntoView = true;
                    }
                }
            }
        }
    };

    function scrollLineIntoView(potentialLineNumbers: string) {
        info(`Goto lines ${potentialLineNumbers}`);

        document
            .querySelectorAll(".active-goto-line")
            ?.forEach((element) => element.classList.remove("active-goto-line"));

        const lineNumbers: LineNumbers[] = getLineNumbers(potentialLineNumbers);

        if (lineNumbers.length > 0) {
            expandAll();

            gotoLineModifiedCallback.current = () => {
                markAndGotoLines(lineNumbers);
            };

            setGotoLineModified(true);
        }
    }

    function handleScrollIntoView(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            scrollLineIntoView(gotoLine);
        }
    }

    return (
        <details
            ref={linesSectionRef}
            open={menuState.sections.linesSectionExpanded}
            onToggle={(event) =>
                handleMenuStateToggled(event, menuState, setMenuState, "linesSectionExpanded")
            }
        >
            <summary accessKey="L">Lines</summary>

            <div>
                <label htmlFor="gotoLine">Mark line(s) and scroll to line</label>
                <input
                    autoFocus
                    ref={inputElementRef}
                    type="text"
                    name="gotoLine"
                    id="gotoLine"
                    size={20}
                    value={gotoLine}
                    onChange={(event) => {
                        setGotoLine(event.target.value);
                    }}
                    onKeyUp={handleScrollIntoView}
                />
            </div>
        </details>
    );
}
