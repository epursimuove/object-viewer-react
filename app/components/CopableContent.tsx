import { useState, type JSX } from "react";

export function CopableContent({
    children,
    label,
}: {
    children: string;
    label: "JSON" | "CSS" | "HTML" | "JavaScript" | "Plain text";
}): JSX.Element {
    const [textHasBeenCopied, setTextHasBeenCopied] = useState<boolean>(false);

    const textToCopy: string = children; // as string;

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setTextHasBeenCopied(true);
            setTimeout(() => setTextHasBeenCopied(false), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="copy-container">
            <div className="tool-bar">
                <button onClick={handleCopyContent} disabled={textHasBeenCopied}>
                    {textHasBeenCopied ? "Copied!" : "Copy"}
                </button>

                {label && (
                    <div className="label">
                        ({textToCopy.length} characters) {label}
                    </div>
                )}
            </div>

            <pre>{children}</pre>
        </div>
    );
}
