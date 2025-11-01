import { useState, type JSX } from "react";

export function CopableContent({
    children,
    label,
}: {
    children: string;
    label: "JSON" | "CSS" | "HTML" | "JavaScript" | "Plain text";
}): JSX.Element {
    const [textIsCopied, setTextIsCopied] = useState<boolean>(false);

    const textToCopy: string = children; // as string;

    const handleCopyContent = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setTextIsCopied(true);
            setTimeout(() => setTextIsCopied(false), 1500);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="copy-container">
            <div className="tool-bar">
                <button onClick={handleCopyContent}>{textIsCopied ? "Copied!" : "Copy"}</button>

                {label && (
                    <div className="label">
                        {" "}
                        ({textToCopy.length} characters) {label}
                    </div>
                )}
            </div>

            <pre>{children}</pre>
        </div>
    );
}
