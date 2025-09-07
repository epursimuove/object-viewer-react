import { Fragment, useMemo, useState, type ChangeEvent, type JSX } from "react";
import { useUserConfigurationContext } from "./UserConfigurationContext";
import type { DisplayRow, PropertyTypeEnhanced } from "~/types";
import { numberOfDigits } from "~/util/util";
import { SettingsCheckbox } from "~/components/settings-checkbox";

export function FilterSection({ displayRows }: { displayRows: DisplayRow[] }) {
    const {
        filterOnProperty,
        filterOnPropertyTypeEnhanced,
        setFilterOnProperty,
        setFilterOnPropertyTypeEnhanced,
        resetFilters,
    } = useUserConfigurationContext();

    const [sortOnFrequency, setSortOnFrequency] = useState<boolean>(false);

    const delta = (
        maxLength: number,
        enhancedPropertyType: PropertyTypeEnhanced,
        n: number
    ): number => {
        const digits = numberOfDigits(n);
        const length = enhancedPropertyType.length;
        const maxNumberOfDigits = 5;

        return maxLength - length + (maxNumberOfDigits - digits);
    };

    const frequencyMap: Map<PropertyTypeEnhanced, Frequency> = useMemo(() => {
        const frequencyMap: Map<PropertyTypeEnhanced, Frequency> = new Map<
            PropertyTypeEnhanced,
            Frequency
        >();

        const allPropertyTypes: PropertyTypeEnhanced[] = displayRows.map(
            (displayRow) => displayRow.propertyTypeEnhanced
        );

        for (const enhancedPropertyType of allPropertyTypes) {
            frequencyMap.set(enhancedPropertyType, {
                count: (frequencyMap.get(enhancedPropertyType)?.count || 0) + 1,
            });
        }

        const maxLength = Array.from(frequencyMap.keys()).reduce(
            (max, enhancedTypeString) => Math.max(max, enhancedTypeString.length),
            0
        );

        frequencyMap.forEach(
            (frequency, enhancedPropertyType) =>
                (frequency.delta = delta(maxLength, enhancedPropertyType, frequency.count))
        );

        return frequencyMap;
    }, [displayRows]);

    const sortAlphabeticallyAscending = (
        a: PropertyTypeEnhanced,
        b: PropertyTypeEnhanced
    ): number => a.localeCompare(b);

    const sortOnFrequencyDescending = (a: PropertyTypeEnhanced, b: PropertyTypeEnhanced): number =>
        (frequencyMap.get(b)?.count || 0) - (frequencyMap.get(a)?.count || 0);

    const actualPropertyTypeEnhancedValues: PropertyTypeEnhanced[] = useMemo(
        () =>
            Array.from(
                new Set(
                    displayRows.map((displayRow: DisplayRow) => displayRow.propertyTypeEnhanced)
                )
            ).toSorted(sortOnFrequency ? sortOnFrequencyDescending : sortAlphabeticallyAscending),
        [displayRows, sortOnFrequency]
    );

    const filtersActivated = useMemo(
        () => filterOnProperty !== "" || filterOnPropertyTypeEnhanced.length > 0,
        [filterOnProperty, filterOnPropertyTypeEnhanced]
    );

    interface Frequency {
        count: number;
        delta?: number;
    }

    const createNoBreakingSpaces = (frequency?: Frequency): JSX.Element[] => {
        return Array.from({ length: frequency?.delta || 0 }, (_, i) => i + 1).map((m) => (
            <Fragment key={m}>&nbsp;</Fragment>
        ));
    };

    return (
        <details open className={`${filtersActivated && "filters-active"}`}>
            <summary>Filters</summary>

            <div className="button-row">
                <button type="reset" onClick={resetFilters} disabled={!filtersActivated}>
                    Reset
                </button>
            </div>

            <div>
                <label htmlFor="filterOnProperty">Property (name/value)</label>
                <input
                    type="text"
                    name="filterOnProperty"
                    id="filterOnProperty"
                    size={15}
                    value={filterOnProperty}
                    onChange={(event) => {
                        setFilterOnProperty(event.target.value);
                    }}
                />
            </div>

            <div>
                <label htmlFor="filterOnPropertyTypeEnhanced">
                    Enhanced property type{" "}
                    <small>({actualPropertyTypeEnhancedValues.length})</small>
                </label>
                <select
                    multiple
                    name="filterOnPropertyTypeEnhanced"
                    id="filterOnPropertyTypeEnhanced"
                    size={actualPropertyTypeEnhancedValues.length}
                    value={filterOnPropertyTypeEnhanced}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                        const options: HTMLOptionElement[] = Array.from(
                            event.target.selectedOptions
                        );
                        const values: PropertyTypeEnhanced[] = options.map(
                            (option) => option.value as PropertyTypeEnhanced
                        );

                        setFilterOnPropertyTypeEnhanced(values);
                    }}
                >
                    {actualPropertyTypeEnhancedValues.map((type) => (
                        <option key={type} value={type}>
                            {type}
                            {createNoBreakingSpaces(frequencyMap.get(type))}
                            {frequencyMap.get(type)?.count || "?"}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <SettingsCheckbox
                    label="Sort on frequency"
                    currentState={sortOnFrequency}
                    stateUpdater={setSortOnFrequency}
                    htmlIdentifier="sortOnFrequency"
                />
            </div>
        </details>
    );
}
