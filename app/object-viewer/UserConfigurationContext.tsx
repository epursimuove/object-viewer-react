import type {UserConfigurationContextType} from "~/types";
import {type Context, createContext, type ReactNode, useContext, useState} from "react";


const defaultUserConfigurationContext: UserConfigurationContextType = {
    indentObjectTree: true,
    showLeafs: true,
    showMetaData: true,
    showNadaValues: true,
    showPropertyType: true,
    showIdentifyingValues: true,
    filterOnProperty: "",

    setIndentObjectTree: (value: boolean) => {},
    setShowPropertyType: (value: boolean) => {},
    setShowMetaData: (value: boolean) => {},
    setShowNadaValues: (value: boolean) => {},
    setShowLeafs: (value: boolean) => {},
    setShowIdentifyingValues: (value: boolean) => {},
    setFilterOnProperty: (value: string) => {},

    toggleShowPropertyType: () => {},
    toggleIndentObjectTree: () => {},
    toggleShowNadaValues: () => {},
    toggleShowMetaData: () => {},
    toggleShowLeafs: () => {},
    toggleShowIdentifyingValues: () => {},
};

const UserConfigurationContext: Context<UserConfigurationContextType> =
    createContext<UserConfigurationContextType>(defaultUserConfigurationContext);

export const useUserConfigurationContext =
    (): UserConfigurationContextType => useContext(UserConfigurationContext);

type UserConfigurationContextProps = {
    children: ReactNode;
};

export function UserConfigurationProvider({children}: UserConfigurationContextProps) {

    const [indentObjectTree, setIndentObjectTree] = useState(true);
    const [showPropertyType, setShowPropertyType] = useState(true);
    const [showMetaData, setShowMetaData] = useState(true);
    const [showNadaValues, setShowNadaValues] = useState(true);
    const [showLeafs, setShowLeafs] = useState(true);
    const [showIdentifyingValues, setShowIdentifyingValues] = useState(true);

    const [filterOnProperty, setFilterOnProperty] = useState("");

    const userConfigurationContext: UserConfigurationContextType = {
        indentObjectTree,
        showPropertyType,
        showMetaData,
        showNadaValues,
        showLeafs,
        showIdentifyingValues,
        filterOnProperty,

        setIndentObjectTree: (value: boolean) => setIndentObjectTree(value),
        setShowPropertyType: (value: boolean) => setShowPropertyType(value),
        setShowMetaData: (value: boolean) => setShowMetaData(value),
        setShowNadaValues: (value: boolean) => setShowNadaValues(value),
        setShowLeafs: (value: boolean) => setShowLeafs(value),
        setShowIdentifyingValues: (value: boolean) => setShowIdentifyingValues(value),
        setFilterOnProperty: (value: string) => setFilterOnProperty(value),

        toggleIndentObjectTree: () => setIndentObjectTree((previous: boolean) => !previous),
        toggleShowPropertyType: () => setShowPropertyType((previous: boolean) => !previous),
        toggleShowMetaData: () => setShowMetaData((previous: boolean) => !previous),
        toggleShowNadaValues: () => setShowNadaValues((previous: boolean) => !previous),
        toggleShowLeafs: () => setShowLeafs((previous: boolean) => !previous),
        toggleShowIdentifyingValues: () => setShowIdentifyingValues((previous: boolean) => !previous),
    };

    return (
        <UserConfigurationContext.Provider value={userConfigurationContext}>
            {children}
        </UserConfigurationContext.Provider>
    );
}
