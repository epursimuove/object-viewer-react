import type {PropertyTypeEnhanced, UserConfigurationContextType} from "~/types";
import {type Context, createContext, type ReactNode, useContext, useState} from "react";


const defaultUserConfigurationContext: UserConfigurationContextType = {
    indentObjectTree: true,
    showLeaves: true,
    showMetaDataForLeaves: true,
    showMetaDataForNodes: false,
    showNadaValues: true,
    showPropertyType: true,
    showIdentifyingValues: true,
    filterOnProperty: "",
    filterOnPropertyTypeEnhanced: [],

    setIndentObjectTree: (value: boolean) => {},
    setShowPropertyType: (value: boolean) => {},
    setShowMetaDataForLeaves: (value: boolean) => {},
    setShowMetaDataForNodes: (value: boolean) => {},
    setShowNadaValues: (value: boolean) => {},
    setShowLeaves: (value: boolean) => {},
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
    const [showMetaDataForLeaves, setShowMetaDataForLeaves] = useState<boolean>(true);
    const [showMetaDataForNodes, setShowMetaDataForNodes] = useState<boolean>(false);
    const [showNadaValues, setShowNadaValues] = useState<boolean>(true);
    const [showLeaves, setShowLeaves] = useState<boolean>(true);
    const [showIdentifyingValues, setShowIdentifyingValues] = useState<boolean>(true);

    const [filterOnProperty, setFilterOnProperty] = useState<string>("");
    const [filterOnPropertyTypeEnhanced, setFilterOnEnhancedPropertyType] = useState<PropertyTypeEnhanced[]>([]);

    const userConfigurationContext: UserConfigurationContextType = {
        indentObjectTree,
        showPropertyType,
        showMetaDataForLeaves,
        showMetaDataForNodes,
        showNadaValues,
        showLeaves,
        showIdentifyingValues,
        filterOnProperty,
        filterOnPropertyTypeEnhanced,

        setIndentObjectTree: (value: boolean) => setIndentObjectTree(value),
        setShowPropertyType: (value: boolean) => setShowPropertyType(value),
        setShowMetaDataForLeaves: (value: boolean) => setShowMetaDataForLeaves(value),
        setShowMetaDataForNodes: (value: boolean) => setShowMetaDataForNodes(value),
        setShowNadaValues: (value: boolean) => setShowNadaValues(value),
        setShowLeaves: (value: boolean) => setShowLeaves(value),
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
