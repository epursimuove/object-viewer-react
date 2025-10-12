import type {
    ExtraSpaces,
    PropertyTypeEnhanced,
    PropertyTypeOriginal,
    PropertyValue,
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
} from "./dateAndTime";
import { convertDecimalToHex } from "./math";

const { debug, error, info, trace, warning } = useLog("util.ts");

export const versions = {
    appVersion: __APP_VERSION__,
    reactVersion: __REACT_VERSION__,
    reactRouterVersion: __REACT_ROUTER_VERSION__,
    typescriptVersion: __TYPESCRIPT_VERSION__,
};

export const BASE_NAME_URL_PREFIX: string = "/projects/objectViewer";

export const regExpCountryCode: RegExp = /^[A-Z]{2}$/;

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

export const getPropertyTypeEnhanced = (propertyValue: PropertyValue): PropertyTypeEnhanced => {
    const propertyTypeOriginal: PropertyTypeOriginal = typeof propertyValue;

    const propertyTypEnhanced: PropertyTypeEnhanced =
        propertyTypeOriginal === "object" && Array.isArray(propertyValue)
            ? "array"
            : propertyTypeOriginal === "object" && propertyValue === null
              ? "NullValue"
              : propertyTypeOriginal === "number" && propertyValue === 0
                ? "Zero"
                : propertyTypeOriginal === "number" && isHTTPStatus(propertyValue as number)
                  ? "HTTPStatus"
                  : propertyTypeOriginal === "number" && isEpoch(propertyValue as number)
                    ? "Epoch"
                    : propertyTypeOriginal === "number" && Number.isInteger(propertyValue)
                      ? "Integer"
                      : propertyTypeOriginal === "boolean" && propertyValue
                        ? "BooleanTrue"
                        : propertyTypeOriginal === "boolean" && !propertyValue
                          ? "BooleanFalse"
                          : propertyTypeOriginal === "string" &&
                              isTimestamp(propertyValue as string)
                            ? "Timestamp"
                            : propertyTypeOriginal === "string" &&
                                isLocalDate(propertyValue as string)
                              ? "LocalDate"
                              : propertyTypeOriginal === "string" &&
                                  isLocalTime(propertyValue as string)
                                ? "LocalTime"
                                : propertyTypeOriginal === "string" &&
                                    isTimeZone(propertyValue as string)
                                  ? "TimeZone"
                                  : propertyTypeOriginal === "string" &&
                                      potentialCountryCode(propertyValue as string)
                                    ? "CountryCode"
                                    : propertyTypeOriginal === "string" &&
                                        potentialLocale(propertyValue as string)
                                      ? "Locale"
                                      : propertyTypeOriginal === "string" &&
                                          potentialEmailAddress(propertyValue as string)
                                        ? "EmailAddress"
                                        : propertyTypeOriginal === "string" && propertyValue === ""
                                          ? "EmptyString"
                                          : propertyTypeOriginal === "string" &&
                                              isURL(propertyValue as string)
                                            ? "URL"
                                            : propertyTypeOriginal === "string" &&
                                                isColorRGB(propertyValue as string)
                                              ? "ColorRGB"
                                              : propertyTypeOriginal === "string" &&
                                                  isSemanticVersioning(propertyValue as string)
                                                ? "SemVer"
                                                : propertyTypeOriginal === "string" &&
                                                    isIPv4Address(propertyValue as string)
                                                  ? "IPv4"
                                                  : propertyTypeOriginal === "string" &&
                                                      isIPv6Address(propertyValue as string)
                                                    ? "IPv6"
                                                    : propertyTypeOriginal === "string" &&
                                                        isPhoneNumber(propertyValue as string)
                                                      ? "PhoneNumber"
                                                      : propertyTypeOriginal === "string" &&
                                                          isHTTPMethod(propertyValue as string)
                                                        ? "HTTPMethod"
                                                        : propertyTypeOriginal === "string" &&
                                                            isAbsolutePath(propertyValue as string)
                                                          ? "AbsolutePath"
                                                          : propertyTypeOriginal === "string" &&
                                                              isRelativePath(
                                                                  propertyValue as string
                                                              )
                                                            ? "RelativePath"
                                                            : propertyTypeOriginal === "string" &&
                                                                isRegularExpression(
                                                                    propertyValue as string
                                                                )
                                                              ? "RegExp"
                                                              : propertyTypeOriginal;
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

export const buildMetaData = (
    propertyTypeEnhanced: PropertyTypeEnhanced,
    propertyValue: PropertyValue
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
    }

    if (propertyTypeEnhanced === "CountryCode") {
        const countryCode: string = propertyValue as string;
        return `${getFlagEmoji(countryCode)} ${getRegionName(countryCode)}`;
    }

    if (propertyTypeEnhanced === "Locale") {
        const locale: string = propertyValue as string;
        const languageCode: string = locale.slice(0, 2);
        const countryCode: string = locale.slice(-2);
        return `${getLanguageName(languageCode)} (in ${getFlagEmoji(countryCode)} ${getRegionName(
            countryCode
        )})`;
    }

    if (
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
        } else if (propertyTypeEnhanced === "TimeZone") {
            return assembleTimeZoneInformation(propertyValue as string);
        } else if (propertyTypeEnhanced === "Epoch") {
            return durationRelativeToNowForEpoch(propertyValue as number);
        }
    }

    if (propertyTypeEnhanced === "ColorRGB") {
        const colorCode: string = propertyValue as string;
        if (colorCode.startsWith("#")) {
            const { red, green, blue } = splitIntoColorParts(colorCode);

            return `rgb(${red}, ${green}, ${blue})`;
        } else if (colorCode.startsWith("rgb(")) {
            const hexRGB = convertToHexRGB(colorCode);

            return `#${hexRGB}`;
        }
    }

    if (propertyTypeEnhanced === "HTTPStatus") {
        return httpStatusCodes.get(propertyValue as number);
    }
};

const splitIntoColorParts = (
    colorCodeHexRGB: string
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
    isArrayIndex: boolean
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
    return (
        propertyName
            // Insert space before capital letters, unless they're part of an acronym (e.g., "userID" → "user ID", not "user I D").
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .toLowerCase()
            // Capitalize the first character.
            .replace(/^./, (str) => str.toUpperCase())
    );
};
