import type { SyntheticEvent } from "react";
import { SettingsCheckbox } from "~/components/settings-checkbox";
import { useUserConfigurationContext } from "~/object-viewer/UserConfigurationContext";

export function SettingsSection({
    expandAll,
    collapseAll,
}: {
    expandAll: (event?: SyntheticEvent) => void;
    collapseAll: (event: SyntheticEvent) => void;
}) {
    const {
        indentObjectTree,
        showPropertyType,
        showNadaValues,
        showMetaDataForLeaves,
        showMetaDataForNodes,
        showLeaves,
        showIdentifyingValues,
        filterOnProperty,
        filterOnPropertyTypeEnhanced,
        setIndentObjectTree,
        setShowPropertyType,
        setShowMetaDataForLeaves,
        setShowMetaDataForNodes,
        setShowNadaValues,
        setShowLeaves,
        setShowIdentifyingValues,
        setFilterOnProperty,
        setFilterOnPropertyTypeEnhanced,
        resetFilters,
    } = useUserConfigurationContext();

    return (
        <details open>
            <summary>Settings</summary>

            <SettingsCheckbox
                label="Indent object tree"
                currentState={indentObjectTree}
                stateUpdater={setIndentObjectTree}
                htmlIdentifier="indentationActivated"
            />

            <SettingsCheckbox
                label="Show (enhanced) property type"
                currentState={showPropertyType}
                stateUpdater={setShowPropertyType}
                htmlIdentifier="showPropertyType"
            />

            <SettingsCheckbox
                label="Show meta data for leaves"
                currentState={showMetaDataForLeaves}
                stateUpdater={setShowMetaDataForLeaves}
                htmlIdentifier="showMetaDataForLeaves"
            />

            <SettingsCheckbox
                label="Show meta data for nodes"
                currentState={showMetaDataForNodes}
                stateUpdater={setShowMetaDataForNodes}
                htmlIdentifier="showMetaDataForNodes"
            />

            <SettingsCheckbox
                label="Show identifying values"
                currentState={showIdentifyingValues}
                stateUpdater={setShowIdentifyingValues}
                htmlIdentifier="showIdentifyingValues"
            />

            <SettingsCheckbox
                label="Show 'nada' (falsy) values"
                currentState={showNadaValues}
                stateUpdater={setShowNadaValues}
                htmlIdentifier="showNadaValues"
            />

            <SettingsCheckbox
                label="Show leaves (i.e. primitive values)"
                currentState={showLeaves}
                stateUpdater={setShowLeaves}
                htmlIdentifier="showLeaves"
            />

            <div className="button-row">
                <button type="button" onClick={expandAll}>
                    Expand all
                </button>
                <button type="button" onClick={collapseAll}>
                    Collapse (almost) all
                </button>
            </div>
        </details>
    );
}
