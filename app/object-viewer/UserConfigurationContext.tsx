import type {PropertyTypeEnhanced, UserConfigurationContextType} from "~/types";
import {type Context, createContext, type ReactNode, useContext, useState} from "react";


const defaultUserConfigurationContext: UserConfigurationContextType = {
    indentObjectTree: true,
    showLeafs: true,
    showMetaData: true,
    showNadaValues: true,
    showPropertyType: true,
    showIdentifyingValues: true,
    filterOnProperty: "",
    filterOnPropertyTypeEnhanced: [],

    setIndentObjectTree: (value: boolean) => {},
    setShowPropertyType: (value: boolean) => {},
    setShowMetaData: (value: boolean) => {},
    setShowNadaValues: (value: boolean) => {},
    setShowLeafs: (value: boolean) => {},
    setShowIdentifyingValues: (value: boolean) => {},
    setFilterOnProperty: (value: string) => {},
    setFilterOnPropertyTypeEnhanced: (value: PropertyTypeEnhanced[]) => {},

    resetFilters: () => {},
};

const UserConfigurationContext: Context<UserConfigurationContextType> =
    createContext<UserConfigurationContextType>(defaultUserConfigurationContext);

export const useUserConfigurationContext =
    (): UserConfigurationContextType => useContext(UserConfigurationContext);

type UserConfigurationContextProps = {
    children: ReactNode;
};

export function UserConfigurationProvider({children}: UserConfigurationContextProps) {

    const [indentObjectTree, setIndentObjectTree] = useState<boolean>(true);
    const [showPropertyType, setShowPropertyType] = useState<boolean>(true);
    const [showMetaData, setShowMetaData] = useState<boolean>(true);
    const [showNadaValues, setShowNadaValues] = useState<boolean>(true);
    const [showLeafs, setShowLeafs] = useState<boolean>(true);
    const [showIdentifyingValues, setShowIdentifyingValues] = useState<boolean>(true);

    const [filterOnProperty, setFilterOnProperty] = useState<string>("");
    const [filterOnPropertyTypeEnhanced, setFilterOnEnhancedPropertyType] = useState<PropertyTypeEnhanced[]>([]);

    const userConfigurationContext: UserConfigurationContextType = {
        indentObjectTree,
        showPropertyType,
        showMetaData,
        showNadaValues,
        showLeafs,
        showIdentifyingValues,
        filterOnProperty,
        filterOnPropertyTypeEnhanced,

        setIndentObjectTree: (value: boolean) => setIndentObjectTree(value),
        setShowPropertyType: (value: boolean) => setShowPropertyType(value),
        setShowMetaData: (value: boolean) => setShowMetaData(value),
        setShowNadaValues: (value: boolean) => setShowNadaValues(value),
        setShowLeafs: (value: boolean) => setShowLeafs(value),
        setShowIdentifyingValues: (value: boolean) => setShowIdentifyingValues(value),
        setFilterOnProperty: (value: string) => setFilterOnProperty(value),
        setFilterOnPropertyTypeEnhanced: (value: PropertyTypeEnhanced[]) => setFilterOnEnhancedPropertyType(value),

        resetFilters: () => {
            setFilterOnProperty("");
            setFilterOnEnhancedPropertyType([]);
        },
    };

    return (
        <UserConfigurationContext.Provider value={userConfigurationContext}>
            {children}
        </UserConfigurationContext.Provider>
    );
}
