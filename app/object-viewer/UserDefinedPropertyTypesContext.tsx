import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type Context,
    type JSX,
    type ReactNode,
} from "react";
import { useLog } from "~/log-manager/LogManager";
import type {
    ActiveUserDefinedPropertyType,
    UserDefinedPropertyTypeDefinition,
    UserDefinedPropertyTypesContextType,
} from "~/types";
import { compileUserDefinedPropertyTypes } from "~/util/userDefinedPropertyType";

const { debug, error, info, trace, warning } = useLog("UserDefinedPropertyTypesContext.tsx");

const defaultUserDefinedPropertyTypesContext: UserDefinedPropertyTypesContextType = {
    savedUserDefinedPropertyTypes: [],
    activeUserDefinedPropertyTypes: [],
    ruleErrorsById: new Map<string, string>(),
    saveUserDefinedPropertyTypes: function (value: UserDefinedPropertyTypeDefinition[]): void {
        throw new Error("Function not implemented.");
    },
    clearSavedUserDefinedPropertyTypes: function (): void {
        throw new Error("Function not implemented.");
    },
};

const UserDefinedPropertyTypesContext: Context<UserDefinedPropertyTypesContextType> =
    createContext<UserDefinedPropertyTypesContextType>(defaultUserDefinedPropertyTypesContext);

export const useUserDefinedPropertyTypesContext = (): UserDefinedPropertyTypesContextType =>
    useContext(UserDefinedPropertyTypesContext);

type UserDefinedPropertyTypesContextProps = {
    children: ReactNode;
};

export function UserDefinedPropertyTypesContextProvider({
    children,
}: UserDefinedPropertyTypesContextProps): JSX.Element {
    info("Setting up UserDefinedPropertyTypesProvider");

    const [savedUserDefinedPropertyTypes, setSavedUserDefinedPropertyTypes] = useState<
        UserDefinedPropertyTypeDefinition[]
    >([]);

    const compiledUserDefinedPropertyTypes = useMemo(
        () => compileUserDefinedPropertyTypes(savedUserDefinedPropertyTypes),
        [savedUserDefinedPropertyTypes],
    );

    const { activeRules: activeUserDefinedPropertyTypes, errorsById: ruleErrorsById } =
        compiledUserDefinedPropertyTypes;

    const saveUserDefinedPropertyTypes = (
        definitions: UserDefinedPropertyTypeDefinition[],
    ): void => {
        localStorage.setItem(storageKeyForUserDefinedPropertyTypes, JSON.stringify(definitions));

        setSavedUserDefinedPropertyTypes(definitions);
    };

    const clearSavedUserDefinedPropertyTypes = (): void => {
        localStorage.removeItem(storageKeyForUserDefinedPropertyTypes);

        setSavedUserDefinedPropertyTypes([]);
    };

    useEffect(() => {
        debug("UserDefinedPropertyTypesContextProvider mounted");
        const currentSavedUserDefinedPropertyTypes: UserDefinedPropertyTypeDefinition[] =
            loadUserDefinedPropertyTypesFromStorage();

        // Load persisted rule definitions into React state.
        setSavedUserDefinedPropertyTypes(currentSavedUserDefinedPropertyTypes);

        trace(
            `Loaded ${currentSavedUserDefinedPropertyTypes.length} saved UserDefinedPropertyTypeDefinition items from local storage`,
        );
    }, []);

    const userDefinedPropertyTypesContext: UserDefinedPropertyTypesContextType = {
        savedUserDefinedPropertyTypes,
        activeUserDefinedPropertyTypes,
        ruleErrorsById,
        saveUserDefinedPropertyTypes,
        clearSavedUserDefinedPropertyTypes,
    };

    info("Done setting up UserDefinedPropertyTypesProvider");

    return (
        <UserDefinedPropertyTypesContext.Provider value={userDefinedPropertyTypesContext}>
            {children}
        </UserDefinedPropertyTypesContext.Provider>
    );
}

export const storageKeyForUserDefinedPropertyTypes =
    "__NNM_Object_Viewer_User_Defined_Property_Types__";

export const loadUserDefinedPropertyTypesFromStorage = (): UserDefinedPropertyTypeDefinition[] => {
    const storedValue = localStorage.getItem(storageKeyForUserDefinedPropertyTypes);

    if (storedValue === null) {
        return [];
    }

    try {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (!Array.isArray(parsedValue)) {
            warning("Ignoring user-defined property types in Local Storage: expected an array.");
            return [];
        }

        return parsedValue as UserDefinedPropertyTypeDefinition[];
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);

        warning(`Could not parse user-defined property types from Local Storage: ${errorMessage}`);

        return [];
    }
};
