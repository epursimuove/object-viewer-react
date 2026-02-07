import type {
    ArithmeticAggregation,
    ArithmeticAggregationType,
    CommonPropertyTypeAncestor,
    ExtraSpaces,
    PropertyTypeEnhanced,
    PropertyTypeOriginal,
    PropertyValue,
    TableRow,
    TableRowComparator,
    TableRowSorterConfiguration,
} from "~/types";
import { useLog } from "~/log-manager/LogManager";
import {
    httpStatusCodes,
    isHTTPMethod,
    isHTTPStatus,
    isIPv4Address,
    isIPv6Address,
    isURL,
} from "./http";
import {
    isEpoch,
    isLocalDate,
    isLocalTime,
    isTimestamp,
    isTimeZone,
    durationRelativeToNowForLocalDate,
    durationRelativeToNowForTimestamp,
    assembleTimeZoneInformation,
    durationRelativeToNowForEpoch,
    durationRelativeToNowForLocalTime,
} from "./dateAndTime";
import { convertDecimalToHex, getNumberOfIntegerDigits } from "./math";

const { debug, error, info, trace, warning } = useLog("util.ts");

export const versions = {
    appVersion: __APP_VERSION__,
    reactVersion: __REACT_VERSION__,
    reactRouterVersion: __REACT_ROUTER_VERSION__,
    typescriptVersion: __TYPESCRIPT_VERSION__,
};

export const currentLocale: string = navigator.language || "sv-SE";

export const displayNameLocale: string | undefined = new Intl.DisplayNames(["en"], {
    type: "language",
}).of(currentLocale);

export const BASE_NAME_URL_PREFIX: string = "/projects/objectViewer";

export const regExpCountryCode: RegExp = /^[A-Z]{2}$/;

export const regExpCurrency: RegExp = /^[A-Z]{3}$/;

export const regExpLocale: RegExp = /^[a-z]{2}[_-][A-Z]{2}$/;

export const regExpEmailAddress: RegExp =
    /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/;

export const regExpArrayIndexString: RegExp = /^\[\d+\]$/;

export const regExpHexColorRGB: RegExp = /^#[0-9a-fA-F]{6}$/;

export const regExpRGBColorRGB: RegExp = /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/;

const regExpSemanticVersioning: RegExp = /^\d+\.\d+\.\d+$/;

const regExpPhoneNumber: RegExp = /^\+\d{2}\d{2,3}\d{7}$/; // Swedish mobile number.

export const regExpAbsolutePath: RegExp = /^\/([\/a-zA-Z0-9_-]+)*$/;

export const regExpRelativePath: RegExp = /^((\.){1,2}\/)+([\/a-zA-Z0-9_-]+)*$/;

// const regExpRegularExpression: RegExp = /^\/([\/\(\)\{\}\[\]\+\*\?a-zA-Z0-9_-]+)\/[dgimsuvy]{0,8}$/;
// const regExpRegularExpression: RegExp = /^\^([\\\(\)\{\}\[\]\+\*\?a-zA-Z0-9_-]+)\$$/;
// export const regExpRegularExpression: RegExp =
//     /^(\/\^|\^|\/)([\\/(){}[\]+*? #@.,a-zA-Z0-9_-]+)(\$\/|\$|\/)$/;
export const regExpRegularExpression: RegExp =
    /^(\/\^|\^|\/)([\\/(){}[\]+*?:^$| #@.,a-zA-Z0-9_-]+)(\$\/|\$|\/)$/;

const isColorRGB = (s: string): boolean => {
    const isColorRGB: boolean =
        regExpHexColorRGB.test(s) || regExpRGBColorRGB.test(s) || basicColorNames.includes(s);
    return isColorRGB;
};

const isSemanticVersioning = (s: string): boolean => regExpSemanticVersioning.test(s);

const isPhoneNumber = (s: string): boolean => regExpPhoneNumber.test(s);

const potentialCountryCode = (s: string): boolean => {
    const isPotentialCountryCode: boolean = regExpCountryCode.test(s);
    return isPotentialCountryCode;
};

const currencies = Intl.supportedValuesOf("currency");

const isCurrency = (s: string): boolean => {
    const isCurrency: boolean = regExpCurrency.test(s) && currencies.includes(s);
    return isCurrency;
};

const potentialLocale = (s: string): boolean => {
    const isPotentialLocale: boolean = regExpLocale.test(s);
    return isPotentialLocale;
};

const potentialEmailAddress = (s: string): boolean => {
    const isPotentialEmailAddress: boolean = regExpEmailAddress.test(s);
    return isPotentialEmailAddress;
};

const isArrayIndex = (s: string): boolean => {
    const isArrayIndex: boolean = regExpArrayIndexString.test(s);
    return isArrayIndex;
};

const isAbsolutePath = (s: string): boolean => {
    const isAbsolutePath: boolean = regExpAbsolutePath.test(s);
    return isAbsolutePath;
};

const isRelativePath = (s: string): boolean => {
    const isRelativePath: boolean = regExpRelativePath.test(s);
    return isRelativePath;
};

const isRegularExpression = (s: string): boolean => {
    const isRegularExpression: boolean = regExpRegularExpression.test(s);
    return isRegularExpression;
};

export const logPropertyNamesArray = (array: string[], label: string) => {
    console.group(label);
    array.forEach((propertyName: string) => console.log("propertyName", propertyName));
    console.groupEnd();
};

export const sortPropertyNames = (propertyNameA: string, propertyNameB: string): number => {
    const arrayIndexA: boolean = isArrayIndex(propertyNameA);
    const arrayIndexB: boolean = isArrayIndex(propertyNameB);

    if (arrayIndexA || arrayIndexB) {
        if (arrayIndexA && arrayIndexB) {
            const indexA: number = Number.parseInt(propertyNameA.slice(1, -1), 10);
            const indexB: number = Number.parseInt(propertyNameB.slice(1, -1), 10);

            return indexA - indexB;
        }

        if (arrayIndexA) {
            return +1;
        } else {
            return -1;
        }
    }

    return propertyNameA.localeCompare(propertyNameB);
};

const semanticVersioningCompare = (a: string, b: string): number => {
    trace(`Comparing ${a} and ${b}`);

    const [majorA, minorA, patchA]: number[] = a.split(".").map((n) => Number.parseInt(n));
    const [majorB, minorB, patchB]: number[] = b.split(".").map((n) => Number.parseInt(n));

    const diffMajor = majorA - majorB;
    const diffMinor = minorA - minorB;
    const diffPatch = patchA - patchB;

    // return diffMajor !== 0 ? diffMajor : diffMinor !== 0 ? diffMinor : diffPatch;
    return diffMajor || diffMinor || diffPatch;
};

const createTableRowSorter = ({
    columnName,
    ascending,
    commonPropertyTypeAncestorForColumn,
}: TableRowSorterConfiguration): TableRowComparator => {
    debug(
        `Sorting "${columnName}" which is handled as a ${commonPropertyTypeAncestorForColumn} column`,
    );

    const sortTableRowsByColumn = (tableRowA: TableRow, tableRowB: TableRow): number => {
        const a: PropertyValue = tableRowA.cellMap.get(columnName)?.cellValue;

        const b: PropertyValue = tableRowB.cellMap.get(columnName)?.cellValue;

        // Always move undefined values to bottom.
        if (a === undefined && b === undefined) return 0;
        if (a === undefined) return 1;
        if (b === undefined) return -1;

        const sortOrder = ascending ? +1 : -1;

        if (typeof a === "string" && typeof b === "string") {
            if (commonPropertyTypeAncestorForColumn === "SemVer") {
                return semanticVersioningCompare(a, b) * sortOrder;
            }
            return a.localeCompare(b, currentLocale) * sortOrder;
        }

        if (typeof a === "number" && typeof b === "number") {
            return (a - b) * sortOrder;
        }

        if (typeof a === "boolean" && typeof b === "boolean") {
            return (Number(a) - Number(b)) * sortOrder;
        }

        return 0;
    };

    return sortTableRowsByColumn;
};

export const sortTableBy = (
    tableRows: TableRow[],
    sorting: TableRowSorterConfiguration | null,
): TableRow[] => {
    if (sorting) {
        return tableRows.toSorted(createTableRowSorter(sorting));
    }
    return tableRows;
};

export const getPropertyTypeEnhanced = (propertyValue: PropertyValue): PropertyTypeEnhanced => {
    const propertyTypeOriginal: PropertyTypeOriginal = typeof propertyValue;

    let propertyTypEnhanced: PropertyTypeEnhanced;

    switch (propertyTypeOriginal) {
        case "object":
            propertyTypEnhanced = Array.isArray(propertyValue)
                ? "array"
                : propertyValue === null
                  ? "NullValue"
                  : propertyTypeOriginal;

            break;

        case "number":
            propertyTypEnhanced =
                propertyValue === 0
                    ? "Zero"
                    : isHTTPStatus(propertyValue as number)
                      ? "HTTPStatus"
                      : isEpoch(propertyValue as number)
                        ? "Epoch"
                        : Number.isInteger(propertyValue)
                          ? "Integer"
                          : propertyTypeOriginal;
            break;

        case "boolean":
            propertyTypEnhanced = propertyValue
                ? "BooleanTrue"
                : !propertyValue
                  ? "BooleanFalse"
                  : propertyTypeOriginal;
            break;

        case "string":
            const propertyValueAsString: string = propertyValue as string;

            propertyTypEnhanced =
                propertyValue === ""
                    ? "EmptyString"
                    : isTimestamp(propertyValueAsString)
                      ? "Timestamp"
                      : isLocalDate(propertyValueAsString)
                        ? "LocalDate"
                        : isLocalTime(propertyValueAsString)
                          ? "LocalTime"
                          : isTimeZone(propertyValueAsString)
                            ? "TimeZone"
                            : potentialCountryCode(propertyValueAsString)
                              ? "CountryCode"
                              : potentialLocale(propertyValueAsString)
                                ? "Locale"
                                : isCurrency(propertyValueAsString)
                                  ? "Currency"
                                  : potentialEmailAddress(propertyValueAsString)
                                    ? "EmailAddress"
                                    : isURL(propertyValueAsString)
                                      ? "URL"
                                      : isColorRGB(propertyValueAsString)
                                        ? "ColorRGB"
                                        : isSemanticVersioning(propertyValueAsString)
                                          ? "SemVer"
                                          : isIPv4Address(propertyValueAsString)
                                            ? "IPv4"
                                            : isIPv6Address(propertyValueAsString)
                                              ? "IPv6"
                                              : isPhoneNumber(propertyValueAsString)
                                                ? "PhoneNumber"
                                                : isHTTPMethod(propertyValueAsString)
                                                  ? "HTTPMethod"
                                                  : isAbsolutePath(propertyValueAsString)
                                                    ? "AbsolutePath"
                                                    : isRelativePath(propertyValueAsString)
                                                      ? "RelativePath"
                                                      : isRegularExpression(propertyValueAsString)
                                                        ? "RegExp"
                                                        : propertyTypeOriginal;
            break;

        default:
            propertyTypEnhanced = propertyTypeOriginal;
            break;
    }

    // TODO More options

    return propertyTypEnhanced;
};

function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

function getRegionName(countryCode: string): string {
    return regionNames.of(countryCode) || "?";
}

function getLanguageName(languageCode: string): string {
    return languageNames.of(languageCode) || "?";
}

const currencyDisplay = new Intl.DisplayNames(["en"], {
    type: "currency",
});

function translateCurrencyCodeToEnglishName(currencyCode: string) {
    return currencyDisplay.of(currencyCode);
}

function currencyExample(currencyCode: string) {
    return new Intl.NumberFormat("en", { style: "currency", currency: currencyCode }).format(100);
}

export const buildMetaData = (
    propertyTypeEnhanced: PropertyTypeEnhanced,
    propertyValue: PropertyValue,
): string | undefined => {
    if (
        [
            "string",
            "EmailAddress",
            "URL",
            "PhoneNumber",
            "SemVer",
            "IPv4",
            "IPv6",
            "HTTPMethod",
            "AbsolutePath",
            "RelativePath",
            "RegExp",
        ].includes(propertyTypeEnhanced)
    ) {
        return `${(propertyValue as string).length} characters`;
    } else if (propertyTypeEnhanced === "CountryCode") {
        const countryCode: string = propertyValue as string;
        return `${getFlagEmoji(countryCode)} ${getRegionName(countryCode)}`;
    } else if (propertyTypeEnhanced === "Currency") {
        return `${translateCurrencyCodeToEnglishName(propertyValue as string)} - ${currencyExample(propertyValue as string)}`;
    } else if (propertyTypeEnhanced === "Locale") {
        const locale: string = propertyValue as string;
        const languageCode: string = locale.slice(0, 2);
        const countryCode: string = locale.slice(-2);
        return `${getLanguageName(languageCode)} (in ${getFlagEmoji(countryCode)} ${getRegionName(
            countryCode,
        )})`;
    } else if (
        propertyTypeEnhanced === "Timestamp" ||
        propertyTypeEnhanced === "LocalDate" ||
        propertyTypeEnhanced === "LocalTime" ||
        propertyTypeEnhanced === "TimeZone" ||
        propertyTypeEnhanced === "Epoch"
    ) {
        if (propertyTypeEnhanced === "Timestamp") {
            return durationRelativeToNowForTimestamp(propertyValue as string);
        } else if (propertyTypeEnhanced === "LocalDate") {
            return durationRelativeToNowForLocalDate(propertyValue as string);
        } else if (propertyTypeEnhanced === "LocalTime") {
            return durationRelativeToNowForLocalTime(propertyValue as string);
        } else if (propertyTypeEnhanced === "TimeZone") {
            return assembleTimeZoneInformation(propertyValue as string);
        } else if (propertyTypeEnhanced === "Epoch") {
            return durationRelativeToNowForEpoch(propertyValue as number);
        }
    } else if (propertyTypeEnhanced === "ColorRGB") {
        const colorCode: string = propertyValue as string;
        if (colorCode.startsWith("#")) {
            const { red, green, blue } = splitIntoColorParts(colorCode);

            return `rgb(${red}, ${green}, ${blue})`;
        } else if (colorCode.startsWith("rgb(")) {
            const hexRGB = convertToHexRGB(colorCode);

            return `#${hexRGB}`;
        }
    } else if (propertyTypeEnhanced === "HTTPStatus") {
        return httpStatusCodes.get(propertyValue as number);
    }
};

const splitIntoColorParts = (
    colorCodeHexRGB: string,
): { red: number; green: number; blue: number } => {
    const redHex: string = colorCodeHexRGB.slice(1, 3);
    const greenHex: string = colorCodeHexRGB.slice(3, 5);
    const blueHex: string = colorCodeHexRGB.slice(5, 7);

    return {
        red: parseInt(redHex, 16),
        green: parseInt(greenHex, 16),
        blue: parseInt(blueHex, 16),
    };
};

const convertToHexRGB = (colorCodeRGB: string): string => {
    const rgbParts: string[] = colorCodeRGB.slice(4).split(",");
    const red: string = convertDecimalToHex(rgbParts[0]);
    const green: string = convertDecimalToHex(rgbParts[1]);
    const blue: string = convertDecimalToHex(rgbParts[2]);

    return `${red}${green}${blue}`;
};

export const convertArrayToObject = <T>(array: T[]): Record<string, T> => {
    const object: Record<string, T> = {};

    for (let i = 0; i < array.length; i++) {
        object[i] = array[i];
    }

    return object;
};

export const improveColor = (colorHex: string): string => {
    if (colorHex.length !== 6) {
        return colorHex;
    }

    const redPart: string = colorHex.slice(0, 2);
    const greenPart: string = colorHex.slice(2, 4);
    const bluePart: string = colorHex.slice(4, 6);

    const newRedPart: string = getImprovedColorPart(redPart);
    const newGreenPart: string = getImprovedColorPart(greenPart);
    const newBluePart: string = getImprovedColorPart(bluePart);

    return `${newRedPart}${newGreenPart}${newBluePart}`;
};

const getImprovedColorPart = (hex: string): string => {
    const current: number = Number.parseInt(hex, 16);

    if (current < 128) {
        return "00";
    }
    return "ff";
};

export const buildPath = (
    currentPath: string,
    propertyName: string,
    isArrayIndex: boolean,
): string => {
    if (isArrayIndex) {
        return `${currentPath}[${propertyName}]`;
    } else if (propertyName.includes(" ")) {
        return `${currentPath}["${propertyName}"]`;
    } else {
        return `${currentPath}.${propertyName}`;
    }
};

export const prettifyJSON = (value: any): string => JSON.stringify(value, null, 4);

const basicColorNames: string[] = [
    "black",
    "silver",
    "gray",
    "white",
    "maroon",
    "red",
    "purple",
    "fuchsia",
    "green",
    "lime",
    "olive",
    "yellow",
    "navy",
    "blue",
    "teal",
    "aqua",
];

export const containsExtraSpaces = (text: string): null | ExtraSpaces => {
    let result: string[] = [];

    if (text.startsWith(" ")) {
        result.push("start");
    }
    if (text.includes("  ")) {
        result.push("middle");
    }
    if (text.endsWith(" ")) {
        result.push("end");
    }

    if (result.length > 0) {
        return result.join("-") as ExtraSpaces;
    }

    return null;
};

export const numberOfDigits = (n: number): number => {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error(`Invalid number: ${n}`);
    }

    return Math.ceil(Math.log10(n + 1));
};

export const verifyRegExp = (s: string): string | null => {
    let errorMessage: string | null = null;

    try {
        new RegExp(s);
    } catch (error) {
        // console.warn(`Assuming that "${s}" is a regular expression failed`);
        if (error instanceof SyntaxError) {
            // console.warn(error.message);
            errorMessage = error.message;
        }
    }

    return errorMessage;
};

export const prettifyPropertyName = (propertyName: string): string => {
    // Get last part from a concatenated name, eg "foo.bar.baz" -> "baz".
    const actualPropertyName: string = propertyName.split(".").at(-1) || propertyName;

    const prettifiedPropertyName: string = actualPropertyName
        // "isFoo" and "hasFoo" should result in "Foo?".
        .replace(/^(?:is|has)([A-Z].*)/, "$1?")
        // Insert space before capital letters, unless they're part of an acronym (e.g., "userID" → "user ID", not "user I D").
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        // Capitalize the first character.
        .replace(/^./, (str) => str.toUpperCase());

    return prettifiedPropertyName;
};

export const flattenObjectIfNeeded = (
    object: Record<string, PropertyValue>,
    parentKey: string = "",
    accumulatedFlattenedObject: Record<string, PropertyValue> = {},
): Record<string, PropertyValue> => {
    trace(`Flatten object if needed`, parentKey, object, accumulatedFlattenedObject);

    for (const [propertyName, propertyValue] of Object.entries(object)) {
        const fullKey = parentKey ? `${parentKey}.${propertyName}` : propertyName;

        if (Array.isArray(propertyValue)) {
            // Skip arrays.
            continue;
        } else if (propertyValue && typeof propertyValue === "object") {
            // Recurse into nested objects.
            flattenObjectIfNeeded(
                propertyValue as Record<string, PropertyValue>,
                fullKey,
                accumulatedFlattenedObject,
            );
        } else {
            // Assign primitive value.
            accumulatedFlattenedObject[fullKey] = propertyValue;
        }
    }

    // console.log(object, accumulatedFlattenedObject);

    return accumulatedFlattenedObject;
};

export const prettifyArithmeticAggregation = (
    arithmeticAggregation: ArithmeticAggregation,
): string => {
    const largestNumber: number = Object.entries(arithmeticAggregation)
        .filter(
            ([_key, value]: [string, number | ArithmeticAggregationType]) =>
                typeof value === "number",
        )
        .map(([_key, value]: [string, number]) => Math.abs(value))
        .reduce((previousNumber, currentNumber) => Math.max(previousNumber, currentNumber));

    const maxNumberOfIntegerDigits: number = getNumberOfIntegerDigits(largestNumber);

    const lengthPlusMinusSign = 1;

    const neededLengthForIntegerPart: number = maxNumberOfIntegerDigits + lengthPlusMinusSign;

    const pad = (n: number | undefined): string => {
        if (n === undefined) {
            return "???";
        }
        const numberOfIntegerDigits: number = getNumberOfIntegerDigits(n);
        const lengthPlusMinusSign: number = n < 0 ? 1 : 0;

        const lengthForIntegerPart: number = numberOfIntegerDigits + lengthPlusMinusSign;

        const leftPadding: string = " ".repeat(neededLengthForIntegerPart - lengthForIntegerPart);

        return `${leftPadding}${n}`;
    };

    return [
        `Items:  ${pad(arithmeticAggregation.items)}`,
        `Sum:    ${pad(arithmeticAggregation.sum)}`,
        `Min:    ${pad(arithmeticAggregation.min)}`,
        `Max:    ${pad(arithmeticAggregation.max)}`,
        `Mean:   ${pad(arithmeticAggregation.mean)}`,
        `Median: ${pad(arithmeticAggregation.median)}`,
    ].join("\n");
};

export const excludedAggregationNumberPropertyTypes: CommonPropertyTypeAncestor[] = [
    "HTTPStatus",
    "Zero",
];

export const excludedAggregationStringPropertyTypes: CommonPropertyTypeAncestor[] = [
    "HTTPMethod",
    "LocalDate",
    "LocalTime",
    "Timestamp",
    "CountryCode",
    "Locale",
];

export const unknownCommonPropertyTypeAncestor = "???";

export const isEmpty = (object: Record<string, any>): boolean =>
    Object.entries(object).length === 0;
