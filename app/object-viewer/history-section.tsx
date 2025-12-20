import type { HistoryItem } from "~/types";
import { prettifySha256, saveHistoryToStorage, useHistoryContext } from "./HistoryContext";
import { useLog } from "~/log-manager/LogManager";
import { ColorIndicator } from "~/components/color-indicator";
import { improveColor } from "~/util/util";

const { debug } = useLog("history-section.tsx");

export function HistorySection({
    handleRetrievalFromHistory,
}: {
    handleRetrievalFromHistory: (historyItem: HistoryItem) => void;
}) {
    const { savedHistory, setSavedHistory, clearSavedHistory } = useHistoryContext();

    function retrieveObjectFromHistory(historyItem: HistoryItem) {
        debug(`Retrieve object from history`);
        handleRetrievalFromHistory(historyItem);
        rearrangeHistory(historyItem);
    }

    function rearrangeHistory(historyItem: HistoryItem) {
        const index: number = savedHistory.findIndex(
            (historyItem2: HistoryItem) => historyItem.id === historyItem2.id
        );

        saveHistoryToStorage(historyItem.object, savedHistory, setSavedHistory);
    }

    function clearHistory() {
        debug(`Clearing history`);

        clearSavedHistory();
    }

    return (
        <details open>
            <summary accessKey="H">History</summary>

            <div>
                {/* {loadHistoryFromStorage().length} items */}
                {savedHistory.map((historyItem: HistoryItem, index: number) => (
                    <div
                        key={historyItem.id}
                        className="history-item-row"
                        onClick={() => retrieveObjectFromHistory(historyItem)}
                        title={`Used ${historyItem.timestampFirstView
                            .toString()
                            .slice(0, 10)} - ${historyItem.timestampLastView
                            .toString()
                            .slice(0, 10)}`}
                    >
                        <span className="index">{index + 1}</span>

                        <span className="id">{prettifySha256(historyItem.id).toUpperCase()}</span>

                        <ColorIndicator
                            primaryColor={`#${improveColor(prettifySha256(historyItem.id, 6))}`}
                            secondaryColor={`#${improveColor(
                                prettifySha256(historyItem.id, 12).slice(0, 6)
                            )}`}
                        />
                    </div>
                ))}

                {savedHistory.length > 0 && (
                    <button type="button" onClick={clearHistory}>
                        Clear history
                    </button>
                )}
            </div>
        </details>
    );
}
