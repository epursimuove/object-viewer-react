import type {
    DisplayRow,
    UserDefinedPropertyTypeDefinition,
    ValidTextFieldsForUserDefinedPropertyType,
} from "~/types";
import { handleMenuStateToggled, useMenuStateContext } from "./MenuStateContext";
import { TextInput } from "~/components/text-input";
import { useEffect, useState, type SyntheticEvent } from "react";
import { UserDefinedPropertyTypeRow } from "~/components/user-defined-property-type-row";
import { useUserDefinedPropertyTypesContext } from "./UserDefinedPropertyTypesContext";
import { useLog } from "~/log-manager/LogManager";

const { debug, error, info, trace, warning } = useLog("UserDefinedPropertyTypesSection.tsx");

export function UserDefinedPropertyTypesSection({ displayRows }: { displayRows: DisplayRow[] }) {
    const { menuState, setMenuState } = useMenuStateContext();

    const {
        savedUserDefinedPropertyTypes,
        activeUserDefinedPropertyTypes,
        ruleErrorsById,
        saveUserDefinedPropertyTypes,
    } = useUserDefinedPropertyTypesContext();

    const activeRuleById = new Map(activeUserDefinedPropertyTypes.map((rule) => [rule.id, rule]));

    const [userDefinedPropertyTypes, setUserDefinedPropertyTypes] = useState<
        UserDefinedPropertyTypeDefinition[]
    >(savedUserDefinedPropertyTypes);

    const [dirty, setDirty] = useState<boolean>(false);

    type EditableRuleField =
        | "enabled"
        | "whatToCheck"
        | "userDefinedRegExp"
        | "resultingPropertyType";

    const updateUserDefinedPropertyType = <K extends EditableRuleField>(
        id: string,
        field: K,
        value: UserDefinedPropertyTypeDefinition[K],
    ): void => {
        debug("Updating draft", field, id.slice(-4), value);
        setUserDefinedPropertyTypes((previous) =>
            previous.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)),
        );

        setDirty(true);
    };

    const updateEnabled = (id: string, enabled: boolean) =>
        updateUserDefinedPropertyType(id, "enabled", enabled);

    const updateWhatToCheck = (id: string, whatToCheck: "propertyName" | "propertyValue") =>
        updateUserDefinedPropertyType(id, "whatToCheck", whatToCheck);

    const updateUserDefinedRegExp = (id: string, value: string) =>
        updateUserDefinedPropertyType(id, "userDefinedRegExp", value);

    const updateUserDefinedSubstitution = (id: string, value: string) =>
        updateUserDefinedPropertyType(id, "resultingPropertyType", value);

    useEffect(() => {
        info("Modified property types", savedUserDefinedPropertyTypes);
        setUserDefinedPropertyTypes(savedUserDefinedPropertyTypes);
    }, [savedUserDefinedPropertyTypes]);

    function saveChanges(event?: SyntheticEvent): void {
        info("Actually saving all changes", userDefinedPropertyTypes);

        saveUserDefinedPropertyTypes(userDefinedPropertyTypes);

        setDirty(false);
    }

    function addRow() {
        debug("Add new rule to draft");

        const updated = [...userDefinedPropertyTypes];
        updated.push({
            id: crypto.randomUUID(),
            enabled: true,
            whatToCheck: "propertyName",
            userDefinedRegExp: "",
            resultingPropertyType: "",
        });

        setUserDefinedPropertyTypes(updated);

        setDirty(true);
    }

    function deleteRow(id: string) {
        debug(`Delete rule ${id.slice(-3)} from draft`);

        setUserDefinedPropertyTypes(
            userDefinedPropertyTypes.filter(
                (rule: UserDefinedPropertyTypeDefinition) => rule.id !== id,
            ),
        );

        setDirty(true);
    }

    function deleteEverything() {
        debug("Delete everything from draft");

        setUserDefinedPropertyTypes([]);

        setDirty(true);
    }

    function discardChanges() {
        debug("Discard changes in draft");

        setUserDefinedPropertyTypes(savedUserDefinedPropertyTypes);

        setDirty(false);
    }

    return (
        <details
            // ref={linesSectionRef}
            open={menuState.sections.userDefinedPropertyTypesSectionExpanded}
            onToggle={(event) =>
                handleMenuStateToggled(
                    event,
                    menuState,
                    setMenuState,
                    "userDefinedPropertyTypesSectionExpanded",
                )
            }
        >
            <summary accessKey="P">
                {activeRuleById.size}/{userDefinedPropertyTypes.length} User-defined property types
            </summary>

            <div>
                <ul>
                    {userDefinedPropertyTypes.map(
                        (
                            userDefinedPropertyType: UserDefinedPropertyTypeDefinition,
                            index: number,
                        ) => (
                            <li key={userDefinedPropertyType.id}>
                                <UserDefinedPropertyTypeRow
                                    userDefinedPropertyType={userDefinedPropertyType}
                                    onChangeEnabled={updateEnabled}
                                    onChangeWhatToCheck={updateWhatToCheck}
                                    onChangeRegExp={updateUserDefinedRegExp}
                                    onChangeSubstitution={updateUserDefinedSubstitution}
                                    onDelete={deleteRow}
                                    validationError={ruleErrorsById.get(userDefinedPropertyType.id)}
                                    compiledRegExp={
                                        activeRuleById.get(userDefinedPropertyType.id)?.regExp
                                    }
                                />
                            </li>
                        ),
                    )}
                </ul>

                <div className="button-row">
                    <button
                        disabled={userDefinedPropertyTypes.length >= 7}
                        type="button"
                        onClick={addRow}
                    >
                        Add rule
                    </button>

                    <button
                        type="button"
                        disabled={!dirty}
                        onClick={saveChanges}
                        style={{ backgroundColor: dirty ? "orange" : "" }}
                    >
                        Apply changes
                    </button>

                    <button disabled={!dirty} type="button" onClick={discardChanges}>
                        Discard changes
                    </button>

                    <button
                        disabled={userDefinedPropertyTypes.length === 0}
                        type="button"
                        onClick={deleteEverything}
                    >
                        Delete everything
                    </button>
                </div>

                {/* <div>
                    <strong>User-defined property types SAVED IN LOCAL STORAGE</strong>
                    <pre>
                        {savedUserDefinedPropertyTypes.map(
                            (userDefinedPropertyType: UserDefinedPropertyTypeDefinition) => {
                                const activeRule = activeRuleById.get(userDefinedPropertyType.id);

                                // return `${userDefinedPropertyType.id.slice(-3)}\n${userDefinedPropertyType.whatToCheck}\n${userDefinedPropertyType.userDefinedRegExp}\n${userDefinedPropertyType.resultingPropertyType}\n\n`;
                                return `${userDefinedPropertyType.id.slice(-3)}
${userDefinedPropertyType.whatToCheck}
${userDefinedPropertyType.userDefinedRegExp}
${userDefinedPropertyType.resultingPropertyType}
Compiled: ${activeRule?.regExp.toString() ?? "(not active)"}
Errors: ${ruleErrorsById.get(userDefinedPropertyType.id) ?? "(no errors)"}

`;
                            },
                        )}
                    </pre>
                </div>

                <div>
                    <strong>Dynamic user-defined property types</strong>
                    <pre>
                        {userDefinedPropertyTypes.map(
                            (userDefinedPropertyType: UserDefinedPropertyTypeDefinition) => {
                                return `${userDefinedPropertyType.id.slice(-3)}\n${userDefinedPropertyType.whatToCheck}\n${userDefinedPropertyType.userDefinedRegExp}\n${userDefinedPropertyType.resultingPropertyType}\n\n`;
                            },
                        )}
                    </pre>
                </div> */}
            </div>
        </details>
    );
}
