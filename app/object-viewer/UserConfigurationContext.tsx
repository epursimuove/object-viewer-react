import type { PropertyTypeEnhanced, UserConfigurationContextType } from "~/types";
import {
    type Context,
    createContext,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type DisplaySettings = {
    indentObjectTree: boolean;
    showPropertyType: boolean;
    showMetaDataForLeaves: boolean;
    showMetaDataForNodes: boolean;
    showNadaValues: boolean;
    showLeaves: boolean;
    showIdentifyingValues: boolean;
};

export const settingsStorageKey = "__NNM_Object_Viewer_Settings__";

const defaultDisplaySettings: DisplaySettings = {
    indentObjectTree: true,
    showPropertyType: true,
    showMetaDataForLeaves: true,
    showMetaDataForNodes: false,
    showNadaValues: true,
    showLeaves: true,
    showIdentifyingValues: true,
};

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

export const useUserConfigurationContext = (): UserConfigurationContextType =>
    useContext(UserConfigurationContext);

type UserConfigurationContextProps = {
    children: ReactNode;
};

export function UserConfigurationProvider({ children }: UserConfigurationContextProps) {
    const [settings, setSettings] = useState<DisplaySettings>(loadDisplaySettings);

    const [filterOnProperty, setFilterOnProperty] = useState<string>("");
    const [filterOnPropertyTypeEnhanced, setFilterOnEnhancedPropertyType] = useState<
        PropertyTypeEnhanced[]
    >([]);

    const userConfigurationContext: UserConfigurationContextType = {
        ...settings,
        filterOnProperty,
        filterOnPropertyTypeEnhanced,

        setIndentObjectTree: (value) =>
            setSettings((previous) => ({ ...previous, indentObjectTree: value })),

        setShowPropertyType: (value) =>
            setSettings((previous) => ({ ...previous, showPropertyType: value })),

        setShowMetaDataForLeaves: (value) =>
            setSettings((previous) => ({ ...previous, showMetaDataForLeaves: value })),

        setShowMetaDataForNodes: (value) =>
            setSettings((previous) => ({ ...previous, showMetaDataForNodes: value })),

        setShowNadaValues: (value) =>
            setSettings((previous) => ({ ...previous, showNadaValues: value })),

        setShowLeaves: (value) => setSettings((previous) => ({ ...previous, showLeaves: value })),

        setShowIdentifyingValues: (value) =>
            setSettings((previous) => ({ ...previous, showIdentifyingValues: value })),

        setFilterOnProperty: (value: string) => setFilterOnProperty(value),

        setFilterOnPropertyTypeEnhanced: (value: PropertyTypeEnhanced[]) =>
            setFilterOnEnhancedPropertyType(value),

        resetFilters: () => {
            setFilterOnProperty("");
            setFilterOnEnhancedPropertyType([]);
        },
    };

    useEffect(() => {
        try {
            localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
        } catch (error) {
            console.warn("Could not save display settings to local storage.", error);
        }
    }, [settings]);

    return (
        <UserConfigurationContext.Provider value={userConfigurationContext}>
            {children}
        </UserConfigurationContext.Provider>
    );
}

function loadDisplaySettings(): DisplaySettings {
    try {
        const stored = localStorage.getItem(settingsStorageKey);
        if (stored === null) return defaultDisplaySettings;

        const parsed: unknown = JSON.parse(stored);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            return defaultDisplaySettings;
        }

        const saved = parsed as Record<string, unknown>;

        return {
            indentObjectTree:
                typeof saved.indentObjectTree === "boolean"
                    ? saved.indentObjectTree
                    : defaultDisplaySettings.indentObjectTree,
            showPropertyType:
                typeof saved.showPropertyType === "boolean"
                    ? saved.showPropertyType
                    : defaultDisplaySettings.showPropertyType,
            showMetaDataForLeaves:
                typeof saved.showMetaDataForLeaves === "boolean"
                    ? saved.showMetaDataForLeaves
                    : defaultDisplaySettings.showMetaDataForLeaves,
            showMetaDataForNodes:
                typeof saved.showMetaDataForNodes === "boolean"
                    ? saved.showMetaDataForNodes
                    : defaultDisplaySettings.showMetaDataForNodes,
            showNadaValues:
                typeof saved.showNadaValues === "boolean"
                    ? saved.showNadaValues
                    : defaultDisplaySettings.showNadaValues,
            showLeaves:
                typeof saved.showLeaves === "boolean"
                    ? saved.showLeaves
                    : defaultDisplaySettings.showLeaves,
            showIdentifyingValues:
                typeof saved.showIdentifyingValues === "boolean"
                    ? saved.showIdentifyingValues
                    : defaultDisplaySettings.showIdentifyingValues,
        };
    } catch (error) {
        console.warn("Could not load display settings from local storage.", error);
        return defaultDisplaySettings;
    }
}
