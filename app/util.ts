import type {
    ArithmeticAggregation,
    DisplayRow,
    HistoryItem,
    NodeBase,
    ObjectNode,
    ObjectTree,
    PrimitiveLeaf,
    PropertyTypeEnhanced,
    PropertyTypeOriginal,
    PropertyValue,
} from "~/types";
import { Temporal } from "@js-temporal/polyfill";
import { useLog } from "~/log-manager/LogManager";

const { debug, error, info, trace, warning } = useLog("util.ts");

const getNow = (): Temporal.Instant => Temporal.Now.instant();

export const now: Temporal.Instant = getNow();

export const systemTimeZone: string = Temporal.Now.timeZoneId();

export const BASE_NAME_URL_PREFIX: string = "/projects/objectViewer";

export const regExpTimestamp: RegExp = /^(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d(:\d\d(\.\d+)?)?)Z$/;

const regExpLocalDate: RegExp = /^\d\d\d\d-\d\d-\d\d$/;

const regExpLocalTime: RegExp = /^\d\d:\d\d(:\d\d)?$/;

const regExpTimeZone: RegExp =
    /^((Etc\/)?UTC)|((Africa|America|Antarctica|Atlantic|Asia|Australia|Europe|Indian|Pacific)\/[A-Z][A-Za-z_-]+)$/;

const regExpCountryCode: RegExp = /^[A-Z]{2}$/;

const regExpLocale: RegExp = /^[a-z]{2}[_-][A-Z]{2}$/;

const regExpEmailAddress: RegExp =
    /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,}$/;

const regExpSecureURL: RegExp = /^https:\/\/[^ ]+$/;

const regExpInsecureURL: RegExp = /^http:\/\/[^ ]+$/;

const regExpLocalhostURL: RegExp = /^localhost:[\d]{1,5}[^ ]*$/;

const regExpArrayIndexString: RegExp = /^\[\d+\]$/;

const regExpHexColorRGB: RegExp = /^#[0-9a-fA-F]{6}$/;

const regExpRGBColorRGB: RegExp = /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/;

const regExpSemanticVersioning: RegExp = /^\d+\.\d+\.\d+$/;

const regExpIPv4: RegExp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

const regExpExpandedIPv6: RegExp = /^(([0-9A-Fa-f]{1,4})(:[0-9A-Fa-f]{1,4}){7})$/;
const regExpPartialCanonicalIPv6: RegExp = /^(([0-9A-Fa-f]{1,4})(:[0-9A-Fa-f]{1,4})*)?$/;

const regExpPhoneNumber: RegExp = /^\+\d{2}\d{2,3}\d{7}$/; // Swedish mobile number.

const httpMethods: string[] = [
    "CONNECT",
    "DELETE",
    "GET",
    "HEAD",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
    "TRACE",
];

const httpStatusCodes: Map<number, string> = new Map<number, string>([
    // 1xx: Informational
    [100, "Continue - server received headers, proceed with body"],
    [101, "Switching Protocols - protocol change accepted"],
    [102, "Processing (WebDAV) - request is still being handled"],
    [103, "Early Hints - headers sent before final response"],

    // 2xx: Success
    [200, "OK - request succeeded"],
    [201, "Created - resource successfully created"],
    [202, "Accepted - request accepted but not completed"],
    [203, "Non-Authoritative Information - modified proxy response"],
    [204, "No Content - successful, no response body"],
    [205, "Reset Content - reset document view"],
    [206, "Partial Content - delivery of partial resource"],
    [207, "Multi-Status (WebDAV) - multiple status values"],
    [208, "Already Reported (WebDAV) - previously listed"],
    [226, "IM Used - delta encoding applied to resource"],

    // 3xx: Redirection
    [300, "Multiple Choices - multiple representations available"],
    [301, "Moved Permanently - permanent redirect to new URL"],
    [302, "Found (temporary) - use GET at new Location"],
    [303, "See Other - redirect using GET"],
    [304, "Not Modified - cache still valid"],
    [305, "Use Proxy - deprecated"],
    [306, "Switch Proxy - no longer used"],
    [307, "Temporary Redirect - preserve HTTP method"],
    [308, "Permanent Redirect - preserve method on redirect"],

    // 4xx: Client errors
    [400, "Bad Request - malformed request syntax"],
    [401, "Unauthorized - authentication required"],
    [402, "Payment Required - reserved for future use"],
    [403, "Forbidden - authenticated but access denied"],
    [404, "Not Found - resource not found"],
    [405, "Method Not Allowed - method not supported"],
    [406, "Not Acceptable - cannot satisfy Accept headers"],
    [407, "Proxy Authentication Required - proxy login needed"],
    [408, "Request Timeout - client took too long"],
    [409, "Conflict - request conflicts with current state"],
    [410, "Gone - resource permanently removed"],
    [411, "Length Required - Content-Length header missing"],
    [412, "Precondition Failed - conditional headers not met"],
    [413, "Payload Too Large - entity too large"],
    [414, "URI Too Long - request URI too long"],
    [415, "Unsupported Media Type - format not supported"],
    [416, "Range Not Satisfiable - invalid range request"],
    [417, "Expectation Failed - Expect header unmet"],
    [421, "Misdirected Request - wrong server handling"],
    [422, "Unprocessable Entity - semantic errors (WebDAV)"],
    [423, "Locked - resource is locked"],
    [424, "Failed Dependency - dependent request failed"],
    [425, "Too Early - request replay risk"],
    [426, "Upgrade Required - must switch protocols, e.g. HTTPS"],
    [428, "Precondition Required - safe update conditions required"],
    [429, "Too Many Requests - rate limiting"],

    // 5xx: Server errors
    [500, "Internal Server Error - generic server failure"],
    [501, "Not Implemented - server lacks support"],
    [502, "Bad Gateway - invalid upstream response"],
    [503, "Service Unavailable - overloaded or down"],
    [504, "Gateway Timeout - upstream server timed out"],
    [505, "HTTP Version Not Supported - protocol version not supported"],
    [506, "Variant Also Negotiates - misconfigured content negotiation"],
    [507, "Insufficient Storage - cannot store representation"],
    [508, "Loop Detected (WebDAV) - infinite processing loop"],
    [510, "Not Extended - missing required extensions"],
    [511, "Network Authentication Required - login to gain network access"],
]);

const isTimestamp = (s: string): boolean => {
    const isTimestamp: boolean = regExpTimestamp.test(s);
    return isTimestamp;
};

const isLocalDate = (s: string): boolean => {
    const isLocalDate: boolean = regExpLocalDate.test(s);
    return isLocalDate;
};

const isLocalTime = (s: string): boolean => {
    const isLocalTime: boolean = regExpLocalTime.test(s);
    return isLocalTime;
};

const isTimeZone = (s: string): boolean => {
    const isTimeZone: boolean = regExpTimeZone.test(s);
    return isTimeZone;
};

const isURL = (s: string): boolean => {
    const isURL: boolean =
        regExpSecureURL.test(s) || regExpInsecureURL.test(s) || regExpLocalhostURL.test(s);
    return isURL;
};

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

const isIPv4Address = (s: string): boolean => regExpIPv4.test(s);

const canonicalFormatSeparatorIPv6 = "::";

const isIPv6Address = (s: string): boolean => {
    if (s.includes(canonicalFormatSeparatorIPv6)) {
        const [before, after] = s.split(canonicalFormatSeparatorIPv6);

        return regExpPartialCanonicalIPv6.test(before) && regExpPartialCanonicalIPv6.test(after);
    } else {
        return regExpExpandedIPv6.test(s);
    }
};

const isHTTPMethod = (s: string): boolean => httpMethods.includes(s);

const isHTTPStatus = (n: number): boolean => Array.from(httpStatusCodes.keys()).includes(n);

const isEpoch = (n: number): boolean =>
    (1000000000 <= n && n <= 3000000000) || (1000000000000 <= n && n <= 3000000000000);

const templateRootObjectNode: ObjectNode = {
    nodeType: "object",
    convenientIdentifierWhenCollapsed: "/Root of tree/",
    id: "0",
    level: 0,
    depthBelow: -1,
    numberOfDescendants: -1,
    path: "$",
    isExpanded: false,
    isVisible: false,
    length: -8888,
    propertyMetaData: "/Root of tree/",
    propertyName: "<root>",
    propertyTypeEnhanced: "object",
    propertyTypeOriginal: "object",
    containedProperties: {},
};

const templateEmptyObjectNode: ObjectNode = {
    nodeType: "object",
    id: "/Not defined yet/",
    isExpanded: false,
    isVisible: false,
    length: -7777,
    level: -7777,
    depthBelow: -111,
    numberOfDescendants: -111,
    parentId: "/Not defined yet/",
    path: "/Not defined yet/",
    propertyMetaData: "/Object node template/",
    propertyName: "/Object node template/",
    propertyTypeEnhanced: "object",
    propertyTypeOriginal: "object",
    containedProperties: {},
};

function createEmptyRoot(): ObjectNode {
    return structuredClone(templateRootObjectNode);
}

function createEmptyObjectNode(): ObjectNode {
    return structuredClone(templateEmptyObjectNode);
}

function createEmptyArrayNode(): ObjectNode {
    const objectNode: ObjectNode = structuredClone(templateEmptyObjectNode);
    objectNode.nodeType = "array";
    objectNode.propertyTypeEnhanced = "array";
    return objectNode;
}

export const logPropertyNamesArray = (array: string[], label: string) => {
    console.group(label);
    array.forEach((propertyName: string) => console.log("propertyName", propertyName));
    console.groupEnd();
};

export function convertObjectToTree(originalObject: Record<string, PropertyValue>): ObjectNode {
    info("Converting JSON object to object tree");

    resetIdCounter();

    const root: ObjectNode = createEmptyRoot();

    if (typeof originalObject === "object" && Array.isArray(originalObject)) {
        debug("IS ARRAY!!!! originalObject", originalObject);
        root.nodeType = "array";
        root.propertyTypeEnhanced = "array";

        const arrayAsObject: Record<string, PropertyValue> = convertArrayToObject<PropertyValue>(
            originalObject as PropertyValue[]
        );

        const foo: ObjectNode = convertObjectToTreeHelper(arrayAsObject, root, true);
    } else {
        const foo: ObjectNode = convertObjectToTreeHelper(originalObject, root);
    }

    info(`Created ${id} object tree nodes`);

    return root; // TODO return foo????
}

const sortPropertyNames = (propertyNameA: string, propertyNameB: string): number => {
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

let id: number = -999;
const nextId = (): number => id++;
const resetIdCounter = (): void => {
    id = 1;
};

let rowNumber: number = -777;
const nextRowNumber = (): number => rowNumber++;
const resetRowNumberCounter = (): void => {
    rowNumber = 1;
};

export function convertObjectToTreeHelper(
    originalObject: Record<string, PropertyValue>,
    currentObjectNode: ObjectNode,
    isArrayIndex: boolean = false
): ObjectNode {
    info(`Converting property "${currentObjectNode.propertyName}" to object tree`);
    const currentId = id;

    // - Sort properties alphabetically in the original object.
    // - For each property, traverse depth-first and create a sub object tree.

    const propertyNames: string[] = Object.getOwnPropertyNames(originalObject);
    const sortedPropertyNames: string[] = propertyNames.toSorted(sortPropertyNames);

    for (let i = 0; i < sortedPropertyNames.length; i++) {
        const propertyName: string = sortedPropertyNames[i];

        const propertyValue: PropertyValue = structuredClone(originalObject[propertyName]);

        const propertyTypeOriginal: PropertyTypeOriginal = typeof propertyValue;
        const propertyTypeEnhanced: PropertyTypeEnhanced = getPropertyTypeEnhanced(propertyValue);

        const isObject: boolean = propertyTypeOriginal === "object";
        const isArray: boolean = isObject && Array.isArray(propertyValue);
        const isNull: boolean = isObject && propertyValue === null;
        const isRecursive: boolean = !isNull && (isObject || isArray);

        if (!isRecursive) {
            trace("[PRIMITIVE LEAF FOUND] propertyName", propertyName);

            const leaf: PrimitiveLeaf = {
                nodeType: "leaf",
                id: `${currentObjectNode.id}.${nextId()}`,
                isNada: false,
                isVisible: false,
                level: currentObjectNode.level + 1,
                parentId: `${currentObjectNode.id}`,
                path: buildPath(currentObjectNode.path, propertyName, isArrayIndex),
                propertyMetaData: buildMetaData(propertyTypeEnhanced, propertyValue),
                propertyName,
                propertyTypeEnhanced,
                propertyTypeOriginal,
                propertyValue,
                isArrayIndex,
            };

            currentObjectNode.containedProperties[propertyName] = leaf;
        } else {
            if (isObject && !isArray) {
                trace("[OBJECT FOUND] propertyName", propertyName);

                if (propertyValue !== null) {
                    const objectNode: ObjectNode = createEmptyObjectNode();
                    objectNode.propertyName = propertyName;
                    objectNode.level = currentObjectNode.level + 1;
                    objectNode.id = `${currentObjectNode.id}.${nextId()}`;
                    objectNode.parentId = `${currentObjectNode.id}`;
                    objectNode.path = buildPath(currentObjectNode.path, propertyName, isArrayIndex);
                    objectNode.isArrayIndex = isArrayIndex;

                    const subObject: ObjectNode = convertObjectToTreeHelper(
                        propertyValue as Record<string, PropertyValue>,
                        objectNode
                    );

                    debug(`subObject for "${propertyName}"`, subObject);

                    currentObjectNode.containedProperties[propertyName] = subObject;
                }
            } else {
                trace("[ARRAY FOUND] propertyName", propertyName);

                const arrayNode: ObjectNode = createEmptyArrayNode();
                arrayNode.propertyName = propertyName;
                arrayNode.level = currentObjectNode.level + 1;
                arrayNode.id = `${currentObjectNode.id}.${nextId()}`;
                arrayNode.parentId = `${currentObjectNode.id}`;
                arrayNode.path = buildPath(currentObjectNode.path, propertyName, isArrayIndex);
                arrayNode.isArrayIndex = isArrayIndex;

                const propertyValueAsObject: Record<string, PropertyValue> =
                    convertArrayToObject<PropertyValue>(propertyValue as PropertyValue[]);

                const subItems: ObjectNode = convertObjectToTreeHelper(
                    propertyValueAsObject,
                    arrayNode,
                    true
                );

                currentObjectNode.containedProperties[propertyName] = subItems;
            }
        }
    }

    currentObjectNode.length = Object.getOwnPropertyNames(
        currentObjectNode.containedProperties
    ).length;

    decideDescendantsAndDepthBelow(currentObjectNode);

    decideOptionalConvenientIdentifier(currentObjectNode);

    info(`Created ${id - currentId} object tree nodes under "${currentObjectNode.propertyName}"`);

    return currentObjectNode;
}

// Value is not nullish.
const valueIsDefined = (value: any): boolean => value !== undefined && value !== null;

const goodPropertyNames: string[] = [
    "uuid",
    "id",
    "name",
    "username",
    "fullName",
    "firstName",
    "lastName",
    "postCode",
    "city",
    "country",
    "x",
    "y",
    "z",
    "propertyName",
    "propertyValue",
    "depth",
    "width",
    "height",
    "type",
];

function getPossibleIdentifyingProperties(objectNode: ObjectNode): Record<string, PropertyValue> {
    const result: Record<string, PropertyValue> = {};

    for (const propertyName of goodPropertyNames) {
        const propertyValue: PropertyValue = getPossiblePrimitiveValue(objectNode, propertyName);

        if (propertyValue !== null) {
            result[propertyName] = propertyValue;
        }
    }

    return result;
}

function decideDescendantsAndDepthBelow(currentObjectNode: ObjectNode) {
    const containedPropertyNames: string[] = Object.getOwnPropertyNames(
        currentObjectNode.containedProperties
    );

    let depthBelow = 0;
    let numberOfDescendants = 0;

    for (let i = 0; i < containedPropertyNames.length; i++) {
        const propertyName: string = containedPropertyNames[i];

        const property: ObjectTree = currentObjectNode.containedProperties[propertyName];

        if (property && property.nodeType !== "leaf") {
            depthBelow = Math.max(depthBelow, (property as NodeBase).depthBelow);
            numberOfDescendants += (property as NodeBase).numberOfDescendants + 1;
        } else {
            numberOfDescendants += 1;
        }
    }

    currentObjectNode.depthBelow = depthBelow + 1;
    currentObjectNode.numberOfDescendants = numberOfDescendants;

    currentObjectNode.propertyMetaData = `Level: ${currentObjectNode.level}, depth below: ${currentObjectNode.depthBelow}, descendants: ${currentObjectNode.numberOfDescendants}`;
}

function decideOptionalConvenientIdentifier(currentObjectNode: ObjectNode) {
    if (currentObjectNode.nodeType !== "leaf") {
        debug(
            "currentObjectNode.propertyName",
            currentObjectNode.propertyName,
            Object.getOwnPropertyNames(currentObjectNode.containedProperties).length,
            currentObjectNode.containedProperties
        );

        const {
            id,
            uuid,
            name,
            username,
            fullName,
            firstName,
            lastName,
            postCode,
            city,
            country,
            x,
            y,
            z,
            propertyName,
            propertyValue,
            depth,
            width,
            height,
            type,
        }: Record<string, PropertyValue> = getPossibleIdentifyingProperties(currentObjectNode);

        const identifyingValueParts: string[] = [];

        if (id || uuid) {
            identifyingValueParts.push(uuid ? `Uuid: ${uuid}` : `Id: ${id}`);
        }
        if (type) {
            identifyingValueParts.push(`Type: ${type}`);
        }
        if (username) {
            identifyingValueParts.push(`Username: ${username}`);
        }
        if (name || fullName) {
            identifyingValueParts.push(fullName ? `Name: ${fullName}` : `Name: ${name}`);
        } else {
            if (firstName) {
                if (lastName) {
                    identifyingValueParts.push(`Name: ${firstName} ${lastName}`);
                } else {
                    identifyingValueParts.push(`Name: ${firstName}`);
                }
            } else if (lastName) {
                identifyingValueParts.push(`Name: ${lastName}`);
            }
        }
        if (postCode) {
            identifyingValueParts.push(`${postCode}`);
        }
        if (city) {
            identifyingValueParts.push(`${city}`);
        }
        if (country) {
            identifyingValueParts.push(`${country}`);
        }
        if (valueIsDefined(x)) {
            identifyingValueParts.push(`x: ${x}`);
        }
        if (valueIsDefined(y)) {
            identifyingValueParts.push(`y: ${y}`);
        }
        if (valueIsDefined(z)) {
            identifyingValueParts.push(`z: ${z}`);
        }
        if (valueIsDefined(width)) {
            identifyingValueParts.push(`width: ${width}`);
        }
        if (valueIsDefined(height)) {
            identifyingValueParts.push(`height: ${height}`);
        }
        if (valueIsDefined(depth)) {
            identifyingValueParts.push(`depth: ${depth}`);
        }
        if (propertyName || propertyValue) {
            if (propertyName) {
                if (propertyValue) {
                    identifyingValueParts.push(`${propertyName} = ${propertyValue}`);
                } else {
                    identifyingValueParts.push(`${propertyName}`);
                }
            }
        }

        if (identifyingValueParts.length > 0) {
            currentObjectNode.convenientIdentifierWhenCollapsed = identifyingValueParts.join(", ");
        }

        if (currentObjectNode.nodeType === "array") {
            const typeOriginalOfItems: Set<PropertyTypeOriginal> = new Set(
                Object.values(currentObjectNode.containedProperties).map(
                    (objectTree: ObjectTree) => objectTree.propertyTypeOriginal
                )
            );

            if (typeOriginalOfItems.size === 1) {
                const arrayTypeOriginal: PropertyTypeOriginal = [...typeOriginalOfItems][0];

                let arrayTypeToDisplay: PropertyTypeOriginal | PropertyTypeEnhanced =
                    arrayTypeOriginal;

                if (arrayTypeOriginal === "string" || arrayTypeOriginal === "number") {
                    const typeEnhancedOfItems: Set<PropertyTypeEnhanced> = new Set(
                        Object.values(currentObjectNode.containedProperties).map(
                            (objectTree: ObjectTree) => objectTree.propertyTypeEnhanced
                        )
                    );

                    if (arrayTypeOriginal === "string") {
                        if (typeEnhancedOfItems.size === 1) {
                            arrayTypeToDisplay = [...typeEnhancedOfItems][0];
                        }
                    } else if (arrayTypeOriginal === "number") {
                        if (typeEnhancedOfItems.size === 1) {
                            arrayTypeToDisplay = [...typeEnhancedOfItems][0];
                        } /*else if (typeEnhancedOfItems.size === 2) {
                            if (
                                typeEnhancedOfItems.has("Zero") &&
                                typeEnhancedOfItems.has("Integer")
                            ) {
                                arrayTypeToDisplay = "Integer";
                            }
                        }*/
                    }
                }

                currentObjectNode.convenientIdentifierWhenCollapsed = `${arrayTypeToDisplay}[]`;

                if (arrayTypeOriginal === "number") {
                    const values: number[] = Object.values(
                        currentObjectNode.containedProperties
                    ).map(
                        (objectTree: ObjectTree) => (objectTree as PrimitiveLeaf).propertyValue
                    ) as number[];

                    const aggregation: ArithmeticAggregation = calculateAggregations(values);
                    currentObjectNode.arithmeticAggregation = aggregation;
                }
            }
        }
    }
}

const maxNumberOfDecimals = (n: number, numberOfDecimals = 2): number =>
    Math.round(n * Math.pow(10, numberOfDecimals)) / Math.pow(10, numberOfDecimals);

const calculateAggregations = (numbers: number[]): ArithmeticAggregation => {
    const numberOfItems: number = numbers.length;
    if (numberOfItems === 0) {
        return {};
    }

    const sortedValues: number[] = numbers.toSorted((a, b) => a - b);
    const min: number = sortedValues.at(0)!;
    const max: number = sortedValues.at(-1)!;
    const sum: number = sortedValues.reduce((previous, current) => previous + current, 0);
    const mean: number = maxNumberOfDecimals(sum / numberOfItems);
    const median: number = calculateMedian(sortedValues);

    return { length: numberOfItems, min, max, mean, median, sum };
};

const calculateMedian = (numbers: number[]): number => {
    const numberOfItems: number = numbers.length;
    const middleIndex = Math.floor(numberOfItems / 2);

    const sortedArray: number[] = numbers.toSorted((a, b) => a - b);

    return numberOfItems % 2 === 0
        ? (sortedArray[middleIndex] + sortedArray[middleIndex - 1]) / 2
        : sortedArray[middleIndex];
};

export function convertTreeToDisplayRows(objectRoot: ObjectNode): DisplayRow[] {
    info(`Converting object tree to display rows`);

    // - Traverse objectTree in depth-first in-order with the properties alphabetically sorted.
    // - Create a DisplayRow for each node/leaf.

    resetRowNumberCounter();

    const displayRows: DisplayRow[] = [];

    const hardcodedRoot: DisplayRow = {
        rowNumber: nextRowNumber(),
        indentationLevel: objectRoot.level,
        recursiveToggleIcon: "-",
        convenientIdentifierWhenCollapsed: objectRoot.convenientIdentifierWhenCollapsed,
        isExpanded: true,
        isVisible: true,
        propertyMetaData: objectRoot.propertyMetaData,
        propertyName: objectRoot.propertyName,
        propertyTypeEnhanced: objectRoot.propertyTypeEnhanced,
        propertyTypeOriginal: objectRoot.propertyTypeOriginal,
        hasChildren: false,
        numberOfChildren: -1,
        id: objectRoot.id,
        parentId: objectRoot.parentId,
        path: objectRoot.path,
        rowType: objectRoot.nodeType,
        isNada: false,
        arithmeticAggregation: objectRoot.arithmeticAggregation,
        isArrayIndex: objectRoot.isArrayIndex,
    };

    const children: Record<string, ObjectTree> = objectRoot.containedProperties;

    // TODO This ugly block does not need to be duplicated. See duplikat i helper-metoden.
    const propertyNames: string[] = Object.getOwnPropertyNames(children);
    debug("propertyNames", propertyNames);

    hardcodedRoot.numberOfChildren = Object.getOwnPropertyNames(children).length;
    hardcodedRoot.hasChildren = hardcodedRoot.numberOfChildren > 0;

    displayRows.push(hardcodedRoot);

    for (let i = 0; i < propertyNames.length; i++) {
        const propertyName: string = propertyNames[i];

        const child: ObjectTree = children[propertyName];

        trace("child.propertyName", child.propertyName);

        convertTreeToDisplayRowsHelper(child, displayRows);
    }

    info(`Created ${rowNumber} display rows`);

    return displayRows;
}

export function convertTreeToDisplayRowsHelper(
    currentObjectNode: ObjectTree,
    displayRows: DisplayRow[]
): DisplayRow[] {
    info(`Converting object tree "${currentObjectNode.propertyName}" to display row`);

    const currentRowNumber: number = rowNumber;

    const hardcodedNode: DisplayRow = {
        rowNumber: nextRowNumber(),
        indentationLevel: currentObjectNode.level,
        recursiveToggleIcon: "",
        isExpanded: true,
        isVisible: true,
        propertyMetaData: currentObjectNode.propertyMetaData,
        propertyName: currentObjectNode.propertyName,
        propertyTypeEnhanced: currentObjectNode.propertyTypeEnhanced,
        propertyTypeOriginal: currentObjectNode.propertyTypeOriginal,
        hasChildren: false,
        numberOfChildren: 0,
        id: currentObjectNode.id,
        parentId: currentObjectNode.parentId,
        path: currentObjectNode.path,
        rowType: currentObjectNode.nodeType,
        isNada: false,
        isArrayIndex: currentObjectNode.isArrayIndex,
    };

    if (currentObjectNode.nodeType === "leaf") {
        const propertyValue: PropertyValue = (currentObjectNode as PrimitiveLeaf).propertyValue;

        hardcodedNode.propertyValue = propertyValue;

        const isNada: boolean =
            (currentObjectNode.propertyTypeOriginal === "string" && propertyValue === "") ||
            (currentObjectNode.propertyTypeOriginal === "number" && propertyValue === 0) ||
            (currentObjectNode.propertyTypeOriginal === "boolean" && !propertyValue) ||
            currentObjectNode.propertyTypeEnhanced === "NullValue" ||
            currentObjectNode.propertyTypeEnhanced === "UndefinedValue";

        hardcodedNode.isNada = isNada;
    }

    displayRows.push(hardcodedNode);

    if (currentObjectNode.nodeType === "object" || currentObjectNode.nodeType === "array") {
        const children: Record<string, ObjectTree> = (currentObjectNode as ObjectNode)
            .containedProperties;

        const propertyNames: string[] = Object.getOwnPropertyNames(children);
        debug("propertyNames", propertyNames);

        hardcodedNode.numberOfChildren = propertyNames.length;
        hardcodedNode.hasChildren = propertyNames.length > 0;
        hardcodedNode.recursiveToggleIcon = hardcodedNode.hasChildren ? "-" : "∅";
        hardcodedNode.convenientIdentifierWhenCollapsed = (
            currentObjectNode as ObjectNode
        ).convenientIdentifierWhenCollapsed;
        hardcodedNode.arithmeticAggregation = (
            currentObjectNode as ObjectNode
        ).arithmeticAggregation;

        for (let i = 0; i < propertyNames.length; i++) {
            const propertyName: string = propertyNames[i];

            const child: ObjectTree = children[propertyName];

            trace("child.propertyName", child.propertyName);

            convertTreeToDisplayRowsHelper(child, displayRows);
        }
    }

    info(
        `Created ${rowNumber - currentRowNumber} display rows under "${
            currentObjectNode.propertyName
        }"`
    );

    return []; // TODO ÄR DETTA RÄTT?!?!?
}

const getPropertyTypeEnhanced = (propertyValue: PropertyValue): PropertyTypeEnhanced => {
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

const padTimestampToMilliseconds = (timestamp: Temporal.Instant): string =>
    timestamp.toString().padEnd(24);

const buildMetaData = (
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
        propertyTypeEnhanced === "TimeZone"
    ) {
        if (propertyTypeEnhanced === "Timestamp") {
            const timestamp: Temporal.Instant = Temporal.Instant.from(propertyValue as string);

            const duration: Temporal.Duration = now.since(timestamp);

            const roundedDuration: Temporal.Duration = duration.round({
                largestUnit: "years",
                // roundingMode: "ceil",
                // Use the ISO calendar; you can convert to another calendar using
                // withCalendar()
                relativeTo: now.toZonedDateTimeISO("UTC"),
            });

            return `${prettifiedDuration(roundedDuration)}`;
        } else if (propertyTypeEnhanced === "LocalDate") {
            const localDate: Temporal.PlainDate = Temporal.PlainDate.from(propertyValue as string);

            const duration: Temporal.Duration = now
                .toZonedDateTimeISO("UTC")
                .since(localDate.toZonedDateTime("UTC"));

            const roundedDuration: Temporal.Duration = duration.round({
                largestUnit: "years",
                // roundingMode: "ceil",
                // Use the ISO calendar; you can convert to another calendar using
                // withCalendar()
                relativeTo: now.toZonedDateTimeISO("UTC"),
            });

            return `${prettifiedDuration(roundedDuration)}`;
        } else if (propertyTypeEnhanced === "TimeZone") {
            try {
                const zonedDateTime: Temporal.ZonedDateTime = now.toZonedDateTimeISO(
                    propertyValue as string
                );
                const localDateTime: Temporal.PlainDateTime = zonedDateTime.toPlainDateTime();

                const { dayOfWeek, day, month } = localDateTime;
                const localTimeString: string = localDateTime.toPlainTime().toString().slice(0, 5);

                return `${weekDays[dayOfWeek - 1]} ${day} ${
                    monthNames[month - 1]
                } ${localTimeString} [${zonedDateTime.offset}]`;
            } catch (error) {
                if (error instanceof RangeError) {
                    return `RangeError: ${error.message}`;
                } else if (error instanceof Error) {
                    return `Error: ${error.message}`;
                } else {
                    return `Unknown Error: ${error}`;
                }
            }
        }
    }

    if (propertyTypeEnhanced === "Epoch") {
        const epochValue: number = propertyValue as number;
        const epochMilliSeconds = epochValue >= 1000000000000 ? epochValue : epochValue * 1000;

        const timestamp: Temporal.Instant =
            Temporal.Instant.fromEpochMilliseconds(epochMilliSeconds);

        const duration: Temporal.Duration = now.since(timestamp);

        const roundedDuration: Temporal.Duration = duration.round({
            largestUnit: "years",
            // roundingMode: "ceil",
            // Use the ISO calendar; you can convert to another calendar using
            // withCalendar()
            relativeTo: now.toZonedDateTimeISO("UTC"),
        });

        trace(`TIMESTAMP ${timestamp} and NOW ${now} => ${duration}`);
        return `${padTimestampToMilliseconds(timestamp)} - ${prettifiedDuration(roundedDuration)}`;
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

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

const convertDecimalToHex = (decimal: string): string =>
    parseInt(decimal, 10).toString(16).toUpperCase().padStart(2, "0");

export const getNumberOfIntegerDigits = (n: number) => {
    // Purely math, no strings in this solution.
    const numberOfIntegerDigits: number =
        n === 0 ? 1 : Math.floor(Math.log10(Math.floor(Math.abs(n)))) + 1;

    return numberOfIntegerDigits;
};

const convertToHexRGB = (colorCodeRGB: string): string => {
    const rgbParts: string[] = colorCodeRGB.slice(4).split(",");
    const red: string = convertDecimalToHex(rgbParts[0]);
    const green: string = convertDecimalToHex(rgbParts[1]);
    const blue: string = convertDecimalToHex(rgbParts[2]);

    return `${red}${green}${blue}`;
};

const prettifiedDuration = (duration: Temporal.Duration): string => {
    let durationPart: string = "??????";
    let inThePast: boolean = true;

    if (duration.years !== 0) {
        durationPart = `${Math.abs(duration.years)} years`;
        inThePast = duration.years > 0;
    } else if (duration.months !== 0) {
        durationPart = `${Math.abs(duration.months)} months`;
        inThePast = duration.months > 0;
    } else if (duration.days !== 0) {
        durationPart = `${Math.abs(duration.days)} days`;
        inThePast = duration.days > 0;
    } else if (duration.hours !== 0) {
        durationPart = `${Math.abs(duration.hours)} hours`;
        inThePast = duration.hours > 0;
    } else if (duration.minutes !== 0) {
        durationPart = `${Math.abs(duration.minutes)} minutes`;
        inThePast = duration.minutes > 0;
    } else if (duration.seconds !== 0) {
        durationPart = `${Math.abs(duration.seconds)} seconds`;
        inThePast = duration.seconds > 0;
    } else {
        return "Just now";
    }

    return inThePast ? `More than ${durationPart} ago` : `In about ${durationPart}`;
};

const convertArrayToObject = <T>(array: T[]): Record<string, T> => {
    const object: Record<string, T> = {};

    for (let i = 0; i < array.length; i++) {
        object[i] = array[i];
    }

    return object;
};

const getPossiblePrimitiveValue = (
    objectNode: ObjectNode,
    requestedPropertyName: string
): PropertyValue => {
    // Search for matching property is case-insensitive.

    const propertyNames: string[] = Object.getOwnPropertyNames(objectNode.containedProperties);

    const matchingPropertyName: string | undefined = propertyNames.find(
        (propertyName) => requestedPropertyName.toLowerCase() === propertyName.toLowerCase()
    );

    if (matchingPropertyName) {
        const possibleProperty: ObjectTree = objectNode.containedProperties[matchingPropertyName];

        if (possibleProperty && possibleProperty.nodeType === "leaf") {
            return (possibleProperty as PrimitiveLeaf).propertyValue;
        }
    }

    return null;
};

export const isDescendant = (id: string, descendantId: string) => {
    return descendantId.startsWith(`${id}.`);
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

const buildPath = (currentPath: string, propertyName: string, isArrayIndex: boolean): string => {
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
