import type { UserDefinedPropertyTypeDefinition, ActiveUserDefinedPropertyType } from "~/types";

export function userDefinedPropertyType(
    // savedUserDefinedPropertyTypes: UserDefinedPropertyTypeDefinition[],
    propertyName: string,
    propertyValue: string,
    // context: UserDefinedPropertyTypesContextType,
    rules: readonly ActiveUserDefinedPropertyType[],
): string | undefined {
    const matchingRule: ActiveUserDefinedPropertyType | undefined = rules.find(
        (userDefinedPropertyType: ActiveUserDefinedPropertyType) => {
            if (!userDefinedPropertyType.regExp) {
                return false;
            }

            const valueToTest =
                userDefinedPropertyType.whatToCheck === "propertyName"
                    ? propertyName
                    : propertyValue;

            return userDefinedPropertyType.regExp.test(valueToTest);
        },
    );

    if (matchingRule) {
        const valueToTest =
            matchingRule.whatToCheck === "propertyName" ? propertyName : propertyValue;

        const resultingPropertyType =
            matchingRule.resultingPropertyType.includes("$") && matchingRule.regExp
                ? "\u00B2" +
                  valueToTest.replace(matchingRule.regExp, matchingRule.resultingPropertyType)
                : "\u00B9" + matchingRule.resultingPropertyType;

        // console.log("2 MATCH " + propertyValue, propertyName, resultingPropertyType, match.regExp);

        // return "°" + resultingPropertyType;
        return resultingPropertyType;
    }

    return;
}

// type PartialUserDefinedPropertyType = Omit<UserDefinedPropertyTypeDefinition, "id">;

type CompiledUserDefinedPropertyTypes = {
    activeRules: ActiveUserDefinedPropertyType[];
    errorsById: Map<string, string>;
};

export function compileUserDefinedPropertyTypes(
    definitions: readonly UserDefinedPropertyTypeDefinition[],
): CompiledUserDefinedPropertyTypes {
    const result: CompiledUserDefinedPropertyTypes = {
        activeRules: [],
        errorsById: new Map<string, string>(),
    };

    for (const definition of definitions) {
        if (!definition.enabled) {
            continue;
        }

        if (definition.userDefinedRegExp.trim() === "") {
            result.errorsById.set(definition.id, "Regular expression is required.");
            continue;
        }

        if (definition.resultingPropertyType.trim() === "") {
            result.errorsById.set(definition.id, "Resulting property type is required.");
            continue;
        }

        try {
            const regExp = createRegExp(definition.userDefinedRegExp);

            result.activeRules.push({
                ...definition,
                regExp,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            result.errorsById.set(definition.id, errorMessage);
        }
    }

    return result;
}

function createRegExp(userDefinedRegExp: string): RegExp {
    // const match = userDefinedRegExp.match(/^\/(.*)\/([gimsuy]*)$/);
    const match = userDefinedRegExp.match(/^\/(.*)\/([imsu]*)$/);

    const regExp = match ? new RegExp(match[1], match[2]) : new RegExp(userDefinedRegExp);

    // console.log("REGEXP", userDefinedRegExp, regExp);
    return regExp;
}
