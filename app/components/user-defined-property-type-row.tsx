import type {
    UserDefinedPropertyTypeDefinition,
    ValidTextFieldsForUserDefinedPropertyType,
} from "~/types";
import { TextInput } from "./text-input";
import { OnOffToggle } from "./on-off-toggle";
import { useState, type ChangeEvent } from "react";

export function UserDefinedPropertyTypeRow({
    userDefinedPropertyType,
    onChangeEnabled,
    onChangeWhatToCheck,
    onChangeRegExp,
    onChangeSubstitution,
    onDelete,
    validationError,
    compiledRegExp,
}: {
    userDefinedPropertyType: UserDefinedPropertyTypeDefinition;
    onChangeEnabled: (id: string, enabled: boolean) => void;
    onChangeWhatToCheck: (id: string, value: "propertyName" | "propertyValue") => void;
    onChangeRegExp: (id: string, value: string) => void;
    onChangeSubstitution: (id: string, value: string) => void;
    onDelete: (id: string) => void;
    validationError?: string;
    compiledRegExp?: RegExp;
}) {
    return (
        <>
            <div style={{ display: "none" }}>{userDefinedPropertyType.id.slice(-3)}</div>

            <section
                className={`user-defined-property-type-row ${userDefinedPropertyType.enabled ? "" : "disabled"}`}
            >
                <div>
                    <OnOffToggle
                        enabled={userDefinedPropertyType.enabled}
                        onClickHandler={(enabled) =>
                            onChangeEnabled(userDefinedPropertyType.id, enabled)
                        }
                    />
                </div>

                {/* <div>{userDefinedPropertyType.whatToCheck}</div> */}

                <div>
                    <select
                        disabled={!userDefinedPropertyType.enabled}
                        name={`whatToCheck-${userDefinedPropertyType.id}`}
                        id={`whatToCheck-${userDefinedPropertyType.id}`}
                        value={userDefinedPropertyType.whatToCheck}
                        onChange={(event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) =>
                            onChangeWhatToCheck(
                                userDefinedPropertyType.id,
                                event.target.value as "propertyName" | "propertyValue",
                            )
                        }
                    >
                        <option value={"propertyName"}>Name</option>
                        <option value={"propertyValue"}>Value</option>
                    </select>
                </div>

                <div>~</div>

                <div>
                    <TextInput
                        disabled={!userDefinedPropertyType.enabled}
                        size={30}
                        currentValue={userDefinedPropertyType.userDefinedRegExp}
                        onChange={(newValue) =>
                            onChangeRegExp(userDefinedPropertyType.id, newValue)
                        }
                    />
                </div>

                <div>&rArr;</div>

                <div>
                    <TextInput
                        disabled={!userDefinedPropertyType.enabled}
                        currentValue={userDefinedPropertyType.resultingPropertyType}
                        onChange={(newValue) =>
                            onChangeSubstitution(userDefinedPropertyType.id, newValue)
                        }
                    />
                </div>

                <div>
                    <button
                        type="button"
                        title="Delete rule"
                        onClick={() => onDelete(userDefinedPropertyType.id)}
                    >
                        &times;
                    </button>
                </div>
            </section>

            {validationError && <div className="error-message">{validationError}</div>}
            {compiledRegExp && (
                <div className="compiled-reg-exp">
                    <span>Compiled RegExp:</span> <span>{compiledRegExp?.toString()}</span>
                </div>
            )}
        </>
    );
}
