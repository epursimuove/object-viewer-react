import type {
    DisplayRow,
    ObjectNode, ObjectTree, PrimitiveLeaf,
    PropertyTypeEnhanced, PropertyTypeOriginal,
     PropertyValue,
} from "~/types";
import {Temporal} from "@js-temporal/polyfill";
import {useLog} from "~/log-manager/LogManager";

const {debug, error, info, trace, warning} = useLog("util.ts");

const getNow = (): Temporal.Instant => Temporal.Now.instant();

export const now: Temporal.Instant = getNow();

export const BASE_NAME_URL_PREFIX: string = "/projects/objectViewer";

export const regExpTimestamp: RegExp = /^(\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d:\d\d)(\.\d+)?Z$/;

const regExpLocalDate: RegExp = /^\d\d\d\d-\d\d-\d\d$/;

const regExpLocalTime: RegExp = /^\d\d:\d\d:\d\d$/;

const regExpCountryCode: RegExp = /^[A-Z]{2}$/;

const regExpLocale: RegExp = /^[a-z]{2}-[A-Z]{2}$/;

const regExpEmailAddress: RegExp = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@[a-zA-Z0-9]+\.[a-zA-Z0-9]{3,}$/;

const regExpArrayIndexString: RegExp = /^\[\d+\]$/;

const isTimestamp = (s: string): boolean => {
    const isTimestamp: boolean = regExpTimestamp.test(s);
    // console.log('isTimestamp', isTimestamp, s);
    return isTimestamp;
};

const isLocalDate = (s: string): boolean => {
    const isLocalDate: boolean = regExpLocalDate.test(s);
    // console.log('isLocalDate', isLocalDate, s);
    return isLocalDate;
};

const isLocalTime = (s: string): boolean => {
    const isLocalTime: boolean = regExpLocalTime.test(s);
    // console.log('isLocalTime', isLocalTime, s);
    return isLocalTime;
};

const potentialCountryCode = (s: string): boolean => {
    const isPotentialCountryCode: boolean = regExpCountryCode.test(s);
    // console.log('isPotentialCountryCode', isPotentialCountryCode, s);
    return isPotentialCountryCode;
};

const potentialLocale = (s: string): boolean => {
    const isPotentialLocale: boolean = regExpLocale.test(s);
    // console.log('isPotentialLocale', isPotentialLocale, s);
    return isPotentialLocale;
};

const potentialEmailAddress = (s: string): boolean => {
    const isPotentialEmailAddress: boolean = regExpEmailAddress.test(s);
    // console.log('isPotentialEmailAddress', isPotentialEmailAddress, s);
    return isPotentialEmailAddress;
};

const isArrayIndex = (s: string): boolean => {
    const isArrayIndex: boolean = regExpArrayIndexString.test(s);
    // console.log('isArrayIndex', isArrayIndex, s);
    return isArrayIndex;
};




//------

const templateRootObjectNode: ObjectNode = {
    nodeType: "object",
    convenientIdentifierWhenCollapsed: "/Root of tree/",
    id: "0",
    level: 0,
    isExpanded: false,
    isVisible: false,
    length: -8888,
    //parentId: null,
    propertyMetaData: "/Root of tree/",
    propertyName: "<root>",
    propertyTypeEnhanced: "object",
    propertyTypeOriginal: "object",
    containedProperties: {},
};

const templateEmptyObjectNode: ObjectNode = {
    nodeType: "object",
    // convenientIdentifierWhenCollapsed: "/Object node template/",
    id: "/Not defined yet/",
    isExpanded: false,
    isVisible: false,
    length: -7777,
    level: -7777,
    parentId: "/Not defined yet/",
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

export const logPropertyNamesArray = (
    array: string[],
    label: string
) => {
    console.group(label);
    array
        .forEach((propertyName: string) => console.log('propertyName', propertyName));
    console.groupEnd();
}


export function convertObjectToTree(
    originalObject: Record<string, PropertyValue>
): ObjectNode {

    info("Converting JSON object to object tree");
    
    resetIdCounter();

    const root: ObjectNode = createEmptyRoot();

    if (typeof originalObject === "object" && Array.isArray(originalObject)) {
        console.log('IS ARRAY!!!! originalObject', originalObject);
        root.nodeType = "array";
        root.propertyTypeEnhanced = "array";

        const arrayAsObject: Record<string, PropertyValue> =
            convertArrayToObject<PropertyValue>(originalObject as PropertyValue[]);

        const foo: ObjectNode = convertObjectToTreeHelper(arrayAsObject, root);
        
    } else {

        const foo: ObjectNode = convertObjectToTreeHelper(originalObject, root);
        //console.warn('foo', foo);
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
}

let id: number = -999;
const nextId = (): number => id++;
const resetIdCounter = (): void => {id = 1};

let rowNumber: number = -777;
const nextRowNumber = (): number => rowNumber++;
const resetRowNumberCounter = (): void => {rowNumber = 1};

export function convertObjectToTreeHelper(
    originalObject: Record<string, PropertyValue>,
    currentObjectNode: ObjectNode,
): ObjectNode {

    // const currentObjectNode: ObjectNode = structuredClone(currentObjectNodeInput);

    info(`Converting property "${currentObjectNode.propertyName}" to object tree`);
    const currentId = id;
    
    // - Sort properties alphabetically in the original object.
    // - For each property, traverse depth-first and create a sub object tree.

    const propertyNames: string[] = Object.getOwnPropertyNames(originalObject);
    // const sortedPropertyNames: string[] = propertyNames.toSorted();
    const sortedPropertyNames: string[] = propertyNames.toSorted(sortPropertyNames);

    // logPropertyNamesArray(propertyNames, "Property names");
    // logPropertyNamesArray(sortedPropertyNames, "Sorted property names");
    
    for (let i = 0; i < sortedPropertyNames.length; i++) {
        const propertyName: string = sortedPropertyNames[i];

        const propertyValue: PropertyValue = structuredClone(originalObject[propertyName]);

        const propertyTypeOriginal: PropertyTypeOriginal = typeof propertyValue;
        const propertyTypeEnhanced: PropertyTypeEnhanced = getPropertyTypeEnhanced(propertyValue);

        const isObject: boolean = propertyTypeOriginal === "object";
        const isArray: boolean = isObject && Array.isArray(propertyValue);
        const isNull: boolean = isObject && propertyValue === null;
        // const isUndefined: boolean = isObject && propertyValue === undefined;
        const isRecursive: boolean = !isNull && (isObject || isArray);

        // console.log('Handling propertyName', propertyName, propertyTypeOriginal, isArray, isRecursive, propertyValue);

        if (!isRecursive) {
            // console.info('[PRIMITIVE LEAF FOUND] propertyName', propertyName);
            
            const leaf: PrimitiveLeaf = {
                nodeType: "leaf",
                id: `${currentObjectNode.id}.${nextId()}`,
                isNada: false,
                isVisible: false,
                level: currentObjectNode.level + 1,
                parentId: `${currentObjectNode.id}`,
                propertyMetaData: buildMetaData(propertyTypeEnhanced, propertyValue),
                // propertyMetaData: `${propertyName} = ${propertyValue}`,
                propertyName,
                propertyTypeEnhanced,
                propertyTypeOriginal,
                propertyValue,
            };

            currentObjectNode.containedProperties[propertyName] = leaf;

        } else {
            if (isObject && !isArray) {
                // console.error('[OBJECT FOUND] propertyName', propertyName);

                if (propertyValue !== null) {

                    const objectNode: ObjectNode = createEmptyObjectNode();
                    // objectNode.convenientIdentifierWhenCollapsed = `${propertyName}: ${propertyTypeEnhanced}`;
                    // objectNode.propertyName = `Property name is '${propertyName}'`;
                    objectNode.propertyName = propertyName;
                    objectNode.level = currentObjectNode.level + 1;
                    objectNode.id = `${currentObjectNode.id}.${nextId()}`;
                    objectNode.parentId = `${currentObjectNode.id}`;

                    const subObject: ObjectNode =
                        convertObjectToTreeHelper(propertyValue as Record<string, PropertyValue>, objectNode);

                    debug(`subObject for "${propertyName}"`, subObject);

                    currentObjectNode.containedProperties[propertyName] = subObject;
                    // currentObjectNode.containedProperties = {
                    //     ...currentObjectNode.containedProperties,
                    //     propertyName: subObject,
                    // };

                    
                }

            } else {
                // console.warn('[ARRAY FOUND] propertyName', propertyName);

                const arrayNode: ObjectNode = createEmptyArrayNode();
                // arrayNode.convenientIdentifierWhenCollapsed = `${propertyName}: ${propertyTypeEnhanced}`;
                arrayNode.propertyName = propertyName;
                arrayNode.level = currentObjectNode.level + 1;
                arrayNode.id = `${currentObjectNode.id}.${nextId()}`;
                arrayNode.parentId = `${currentObjectNode.id}`;

                const propertyValueAsObject: Record<string, PropertyValue> =
                    convertArrayToObject<PropertyValue>(propertyValue as PropertyValue[]);

                const subItems: ObjectNode =
                    convertObjectToTreeHelper(propertyValueAsObject, arrayNode);
                
                currentObjectNode.containedProperties[propertyName] = subItems;
            }
        }
    }

    currentObjectNode.length = Object.getOwnPropertyNames(currentObjectNode.containedProperties).length;

    decideOptionalConvenientIdentifier(currentObjectNode);

    info(`Created ${id - currentId} object tree nodes under "${currentObjectNode.propertyName}"`);

    return currentObjectNode;
}

// Value is not nullish.
const valueIsDefined = (value: any): boolean => value !== undefined && value !== null;

function getPossibleIdentifyingProperties(
    objectNode: ObjectNode,
): Record<string, PropertyValue> {

    const goodPropertyNames: string[] = ["uuid", "id", "name", "fullName", "firstName", "lastName", "postCode", "city", "country", "x", "y", "z", "propertyName", "propertyValue"];

    const result: Record<string, PropertyValue> = {};

    for (const propertyName of goodPropertyNames) {
        const propertyValue: PropertyValue = getPossiblePrimitiveValue(objectNode, propertyName);

        if (propertyValue !== null) {
            result[propertyName] = propertyValue;
        }
    }

    return result;
}

function decideOptionalConvenientIdentifier(currentObjectNode: ObjectNode) {

    if (currentObjectNode.nodeType !== "leaf") {

        warning('#### currentObjectNode.propertyName', currentObjectNode.propertyName, Object.getOwnPropertyNames(currentObjectNode.containedProperties).length, currentObjectNode.containedProperties);

        const {id, uuid, name, fullName, firstName, lastName, postCode, city, country, x, y, z, propertyName, propertyValue}: Record<string, PropertyValue> =
            getPossibleIdentifyingProperties(currentObjectNode);

        let identifyingValue: string = "";

        if (id || uuid) {
            identifyingValue += uuid ? ` Uuid: ${uuid}` : ` Id: ${id}`;
        }
        if (name || fullName) {
            identifyingValue += fullName ? ` Name: ${fullName}` : ` Name: ${name}`;
        } else {
            if (firstName) {
                identifyingValue += ` Name: ${firstName}`;
            }
            if (lastName) {
                identifyingValue += ` ${lastName}`;
            }
        }
        if (postCode) {
            identifyingValue += ` ${postCode}`;
        }
        if (city) {
            identifyingValue += ` ${city}`;
        }
        if (country) {
            identifyingValue += ` ${country}`;
        }
        if (valueIsDefined(x) && valueIsDefined(y) && valueIsDefined(z)) {
            identifyingValue += ` x: ${x}, y: ${y}, z: ${z}`;
        }
        else if (valueIsDefined(x) && valueIsDefined(y)) {
            identifyingValue += ` x: ${x}, y: ${y}`;
        }        
        if (propertyName || propertyValue) {
            if (propertyName) {
                identifyingValue += ` ${propertyName}`;
                if (propertyValue) {
                    identifyingValue += `=${propertyValue}`;
                }
            }
        }

        if (identifyingValue.length > 0 || 1 === 1) {
            currentObjectNode.convenientIdentifierWhenCollapsed = identifyingValue.trim();
        }
    }
}

export function convertTreeToDisplayRows(
    objectRoot: ObjectNode
): DisplayRow[] {

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
        rowType: objectRoot.nodeType,
        isNada: false,
    };

    const children: Record<string, ObjectTree> = objectRoot.containedProperties;



    // TODO This ugly block does not need to be duplicated. See duplikat i helper-metoden.
    const propertyNames: string[] = Object.getOwnPropertyNames(children);
    debug('propertyNames', propertyNames);

    hardcodedRoot.numberOfChildren = Object.getOwnPropertyNames(children).length;
    hardcodedRoot.hasChildren = hardcodedRoot.numberOfChildren > 0;

    displayRows.push(hardcodedRoot);


    for (let i = 0; i < propertyNames.length; i++) {
        const propertyName: string = propertyNames[i];

        const child: ObjectTree = children[propertyName];

        trace('child.propertyName', child.propertyName);
        
        convertTreeToDisplayRowsHelper(child, displayRows)
    }

    info(`Created ${rowNumber} display rows`);

    return displayRows;
}


export function convertTreeToDisplayRowsHelper(
    currentObjectNode: ObjectTree,
    displayRows: DisplayRow[],
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
        rowType: currentObjectNode.nodeType,
        isNada: false,
    };

    if (currentObjectNode.nodeType === "leaf") {
        const propertyValue: PropertyValue = (currentObjectNode as PrimitiveLeaf).propertyValue;
        
        hardcodedNode.propertyValue = propertyValue;

        const isNada: boolean =
            (currentObjectNode.propertyTypeOriginal === "string" && propertyValue === "") ||
            (currentObjectNode.propertyTypeOriginal === "number" && propertyValue === 0) ||
            (currentObjectNode.propertyTypeOriginal === "boolean" && !propertyValue) ||
            (currentObjectNode.propertyTypeEnhanced === "NullValue") ||
            (currentObjectNode.propertyTypeEnhanced === "UndefinedValue");
        
        hardcodedNode.isNada = isNada;
    }
    
    displayRows.push(hardcodedNode);

    if (currentObjectNode.nodeType === "object" || currentObjectNode.nodeType === "array") {
        
        const children: Record<string, ObjectTree> = (currentObjectNode as ObjectNode).containedProperties;


        const propertyNames: string[] = Object.getOwnPropertyNames(children);
        debug('propertyNames', propertyNames);

        hardcodedNode.numberOfChildren = propertyNames.length;
        hardcodedNode.hasChildren = propertyNames.length > 0;
        hardcodedNode.recursiveToggleIcon = hardcodedNode.hasChildren ? "-" : "∅";
        hardcodedNode.convenientIdentifierWhenCollapsed = (currentObjectNode as ObjectNode).convenientIdentifierWhenCollapsed;
        
        for (let i = 0; i < propertyNames.length; i++) {
            const propertyName: string = propertyNames[i];

            const child: ObjectTree = children[propertyName];

            trace('child.propertyName', child.propertyName);

            convertTreeToDisplayRowsHelper(child, displayRows)
        }
    }

    info(`Created ${rowNumber - currentRowNumber} display rows under "${currentObjectNode.propertyName}"`);
    
    return []; // TODO ÄR DETTA RÄTT?!?!?
}

const getPropertyTypeEnhanced = (propertyValue: PropertyValue): PropertyTypeEnhanced => {

    const propertyTypeOriginal: PropertyTypeOriginal = typeof propertyValue;

    const propertyTypEnhanced: PropertyTypeEnhanced =
        propertyTypeOriginal === "object" && Array.isArray(propertyValue) ?
            "array" :
            propertyTypeOriginal === "object" && propertyValue === null ?
                "NullValue" :
                propertyTypeOriginal === "number" && propertyValue === 0 ?
                    "Zero" :
                    propertyTypeOriginal === "number" && Number.isInteger(propertyValue) ?
                        "Integer" :
                        propertyTypeOriginal === "string" && isTimestamp(propertyValue as string) ?
                            "Timestamp" :
                            propertyTypeOriginal === "string" && isLocalDate(propertyValue as string) ?
                                "LocalDate" :
                                propertyTypeOriginal === "string" && isLocalTime(propertyValue as string) ?
                                    "LocalTime" :
                                    propertyTypeOriginal === "string" && potentialCountryCode(propertyValue as string) ?
                                        "CountryCode" :
                                        propertyTypeOriginal === "string" && potentialLocale(propertyValue as string) ?
                                            "Locale" :
                                            propertyTypeOriginal === "string" && potentialEmailAddress(propertyValue as string) ?
                                                "EmailAddress" :
                                                propertyTypeOriginal === "string" && propertyValue === "" ?
                                                    "EmptyString" :
                                                    propertyTypeOriginal;
    // TODO More options

    return propertyTypEnhanced;
};

function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function getRegionName(countryCode: string): string {
    return regionNames.of(countryCode) || "?";
}

const buildMetaData = (
    propertyTypeEnhanced: PropertyTypeEnhanced,
    propertyValue: PropertyValue,
): string | undefined => {

    if (propertyTypeEnhanced === "string") {
        return `${(propertyValue as string).length} characters`;
    }

    if (propertyTypeEnhanced === "CountryCode") {
        const countryCode: string = propertyValue as string;
        // return getFlagEmoji(propertyValue as string);
        return `${getFlagEmoji(countryCode)} ${getRegionName(countryCode)}`
    }

    if (propertyTypeEnhanced === "Timestamp" ||
        propertyTypeEnhanced === "LocalDate" ||
        propertyTypeEnhanced === "LocalTime") {
        
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
        }
    }
}

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

    }

    return inThePast ? `More than ${durationPart} ago` : `In about ${durationPart}`;
}

const convertArrayToObject = <T>(array: T[]): Record<string, T> => {
    const object: Record<string, T> = {};

    for (let i = 0; i < array.length; i++) {
        object[`[${i}]`] = array[i];
    }

    return object;
};

const getPossiblePrimitiveValue = (objectNode: ObjectNode, requestedPropertyName: string): PropertyValue => {

    // Search for matching property is case-insensitive.
    
    const propertyNames: string[] = Object.getOwnPropertyNames(objectNode.containedProperties);

    const matchingPropertyName: string | undefined =
        propertyNames.find(propertyName => requestedPropertyName.toLowerCase() === propertyName.toLowerCase());

    if (matchingPropertyName) {
        const possibleProperty: ObjectTree =
            objectNode.containedProperties[matchingPropertyName];
        
        if (possibleProperty && possibleProperty.nodeType === "leaf") {
            return (possibleProperty as PrimitiveLeaf).propertyValue;
        }
    }
    
    return null;
};

export const isAncestor = (id: string, ancestorId: string) => {
    return id.split(".").includes(ancestorId); // TODO FUNKAR NOG INTE!!!!!
};

export const isDescendant = (id: string, descendantId: string) => {
    return descendantId.startsWith(`${id}.`);
};



