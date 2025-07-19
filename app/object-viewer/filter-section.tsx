import { useMemo, type ChangeEvent } from "react";
import { useUserConfigurationContext } from "./UserConfigurationContext";
import type { DisplayRow, PropertyTypeEnhanced } from "~/types";

export function FilterSection({ displayRows }: { displayRows: DisplayRow[] }) {
    const {
        filterOnProperty,
        filterOnPropertyTypeEnhanced,
        setFilterOnProperty,
        setFilterOnPropertyTypeEnhanced,
        resetFilters,
    } = useUserConfigurationContext();

    const actualPropertyTypeEnhancedValues: PropertyTypeEnhanced[] = useMemo(
        () =>
            Array.from(
                new Set(
                    displayRows.map((displayRow: DisplayRow) => displayRow.propertyTypeEnhanced)
                )
            ).toSorted((a, b) => a.localeCompare(b)),
        [displayRows]
    );

    const filtersActivated = useMemo(
        () => filterOnProperty !== "" || filterOnPropertyTypeEnhanced.length > 0,
        [filterOnProperty, filterOnPropertyTypeEnhanced]
    );

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
                        </option>
                    ))}
                </select>
            </div>
        </details>
    );
}
