import {
    createContext,
    useContext,
    useEffect,
    useState,
    type Context,
    type ReactNode,
} from "react";
import { useLog } from "~/log-manager/LogManager";
import type { HistoryContextType, HistoryItem } from "~/types";
import { clearHistoryInStorage, loadHistoryFromStorage } from "~/util";

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
