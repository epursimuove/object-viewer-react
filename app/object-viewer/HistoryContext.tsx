import { Temporal } from "@js-temporal/polyfill";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type Context,
    type ReactNode,
} from "react";
import { useLog } from "~/log-manager/LogManager";
import type { HistoryContextType, HistoryItem, PropertyValue } from "~/types";

const { debug, error, info, trace, warning } = useLog("HistoryContext.tsx");

const defaultHistoryContext: HistoryContextType = {
    savedHistory: [],
    setSavedHistory: (value: HistoryItem[]) => {},
    clearSavedHistory: () => {},
};

const HistoryContext: Context<HistoryContextType> =
    createContext<HistoryContextType>(defaultHistoryContext);

export const useHistoryContext = (): HistoryContextType => useContext(HistoryContext);

type HistoryContextProps = {
    children: ReactNode;
};

export function HistoryContextProvider({ children }: HistoryContextProps) {
    info("Setting up HistoryContextProvider");

    const [savedHistory, setSavedHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        debug("HistoryContextProvider mounted");
        const currentSavedHistory: HistoryItem[] = loadHistoryFromStorage();
        setSavedHistory(currentSavedHistory);
        trace(`Loaded ${currentSavedHistory.length} saved history items from local storage`);
    }, []);

    useEffect(() => {
        debug("SAVED HISTORY CHANGED IN SOME WAY?!?!?", savedHistory.length);
    }, [savedHistory]);

    const historyContext: HistoryContextType = {
        savedHistory,
        setSavedHistory,
        clearSavedHistory: () => {
            setSavedHistory([]);
            clearHistoryInStorage();
        },
    };

    info("Done setting up HistoryContextProvider");

    return <HistoryContext.Provider value={historyContext}>{children}</HistoryContext.Provider>;
}

const storageKeyForHistory = "__NNM_Object_Viewer_History__";
const maxNumberOfHistoryItems = 7;

export const prettifySha256 = (sha256Code: string, numberOfCharacters = 3): string =>
    sha256Code.slice(-numberOfCharacters);

export const saveHistoryToStorage = (
    object: Record<string, PropertyValue>,
    savedHistory: HistoryItem[],
    setSavedHistory: (value: HistoryItem[]) => void
): void => {
    debug(
        "Current history from local storage",
        savedHistory.map((historyItem: HistoryItem) => prettifySha256(historyItem.id))
    );

    sha256(JSON.stringify(object)).then((sha256Code: string) => {
        const now: Temporal.Instant = Temporal.Now.instant();

        const alreadyPresentIndex: number = savedHistory.findIndex(
            (historyItem: HistoryItem) => historyItem.checksum === sha256Code
        );

        let newItem: HistoryItem;
        let updatedHistory: HistoryItem[];

        if (alreadyPresentIndex >= 0) {
            trace(`Already present at index ${alreadyPresentIndex}`);
            newItem = {
                ...savedHistory[alreadyPresentIndex],
                object,
                timestampLastView: now,
            };

            updatedHistory = [newItem, ...savedHistory.toSpliced(alreadyPresentIndex, 1)];
        } else {
            trace(`Completely new JSON object with SHA ${prettifySha256(sha256Code)}`);

            newItem = {
                id: sha256Code,
                checksum: sha256Code,
                object,
                timestampFirstView: now,
                timestampLastView: now,
            };

            updatedHistory = [newItem, ...savedHistory];
        }

        debug(
            "Updated history to save to local storage",
            updatedHistory.map((historyItem: HistoryItem) => prettifySha256(historyItem.id))
        );

        const slicedUpdatedHistory = updatedHistory.slice(0, maxNumberOfHistoryItems);

        setSavedHistory(slicedUpdatedHistory);

        localStorage.setItem(storageKeyForHistory, JSON.stringify(slicedUpdatedHistory));
    });
};

const loadHistoryFromStorage = (): HistoryItem[] => {
    const currentHistory: string | null = localStorage.getItem(storageKeyForHistory);

    const historyItems: HistoryItem[] = currentHistory ? JSON.parse(currentHistory) : [];

    return historyItems;
};

const clearHistoryInStorage = (): void => {
    localStorage.removeItem(storageKeyForHistory);
};

async function sha256(message: string) {
    // Encode the message as a Uint8Array.
    const messageBuffer = new TextEncoder().encode(message);

    // Hash the message.
    const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);

    // Convert ArrayBuffer to hex string.
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
}

// console.log("HEKKI", sha256("HEJ"));
// sha256("HELLEL").then((value) => console.log("HRHEJR", value));
