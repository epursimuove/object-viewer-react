import type { JSX } from "react";
import { prettifySha256 } from "~/object-viewer/HistoryContext";
import { improveColor } from "~/util/util";
import { ColorIndicator } from "./color-indicator";

export function PrettifiedObjectIdentifier({ sha256Code }: { sha256Code: string }): JSX.Element {
    return (
        <span className="prettified-object-identifier">
            <span className="id">{prettifySha256(sha256Code).toUpperCase()}</span>

            <ColorIndicator
                primaryColor={`#${improveColor(prettifySha256(sha256Code, 6))}`}
                secondaryColor={`#${improveColor(prettifySha256(sha256Code, 12).slice(0, 6))}`}
            />
        </span>
    );
}
