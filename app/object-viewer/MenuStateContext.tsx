import {
    type Context,
    createContext,
    type JSX,
    type ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { useLog } from "~/log-manager/LogManager";
import type { MenuSection, MenuState, MenuStateContextType } from "~/types";

const { debug, error, info, trace, warning } = useLog("MenuStateContext.tsx");

const defaultMenuState: MenuState = {
    globalMenuExpanded: true,
    sections: {
        timeSectionExpanded: true,
        jsonObjectSectionExpanded: true,
        linesSectionExpanded: true,
        historySectionExpanded: true,
        settingsSectionExpanded: true,
        filtersSectionExpanded: true,
        statisticsSectionExpanded: true,
    },
};

const defaultMenuStateContext: MenuStateContextType = {
    menuState: defaultMenuState,
    setMenuState: function (value: MenuState): void {
        throw new Error("Function not implemented.");
    },
};

const MenuStateContext: Context<MenuStateContextType> =
    createContext<MenuStateContextType>(defaultMenuStateContext);

export const useMenuStateContext = (): MenuStateContextType => useContext(MenuStateContext);

type MenuStateContextProps = {
    children: ReactNode;
};

export function MenuStateProvider({ children }: MenuStateContextProps): JSX.Element {
    info("Setting up MenuStateProvider");

    const [initialized, setInitialized] = useState<boolean>(false);
    const [menuState, setMenuState] = useState<MenuState>(defaultMenuState);

    useEffect(() => {
        debug("MenuStateProvider mounted", menuState.sections);
        const currentMenuStateStored: string | null = localStorage.getItem(storageKeyForMenuState);
        trace(`currentMenuStateStored stored in LocalStorage`, currentMenuStateStored);

        const currentMenuState: MenuState = currentMenuStateStored
            ? JSON.parse(currentMenuStateStored)
            : defaultMenuState;

        trace(`currentMenuState`, currentMenuState.sections);

        setMenuState(currentMenuState);

        setInitialized(true);
    }, []);

    useEffect(() => {
        if (!initialized) {
            trace(`Not initialized yet!`);
            return;
        }

        debug("Menu state changed in some way", menuState.sections);

        localStorage.setItem(storageKeyForMenuState, JSON.stringify(menuState));
        trace(`Updated MenuState stored in LocalStorage`);
    }, [menuState]);

    const menuStateContext: MenuStateContextType = {
        menuState,
        setMenuState,
    };

    info("Done setting up MenuStateProvider");

    return (
        <MenuStateContext.Provider value={menuStateContext}>{children}</MenuStateContext.Provider>
    );
}

export const handleMenuStateToggled = (
    event: React.ToggleEvent<HTMLDetailsElement>,
    menuState: MenuState,
    setMenuState: (value: MenuState) => void,
    menuSection: MenuSection | "globalMenuExpanded",
) => {
    const isDetailsElementOpen = event.currentTarget.open;
    event.stopPropagation();

    const menuStateNew =
        menuSection === "globalMenuExpanded"
            ? {
                  ...menuState,
                  globalMenuExpanded: isDetailsElementOpen,
                  //   sections: {
                  //       ...menuState.sections,
                  //   },
              }
            : {
                  ...menuState,
                  sections: {
                      ...menuState.sections,
                      [menuSection]: isDetailsElementOpen,
                  },
              };

    setMenuState(menuStateNew);
};

export const storageKeyForMenuState = "__NNM_Object_Viewer_Menu_State__";
