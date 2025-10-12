import type {
    ArithmeticAggregation,
    DisplayRow,
    NodeBase,
    ObjectNode,
    ObjectTree,
    PrimitiveLeaf,
    PropertyTypeEnhanced,
    PropertyTypeOriginal,
    PropertyValue,
} from "~/types";
import {
    convertArrayToObject,
    buildMetaData,
    buildPath,
    getPropertyTypeEnhanced,
    sortPropertyNames,
} from "./util";
import { useLog } from "~/log-manager/LogManager";
import { calculateAggregations } from "./math";

const { debug, error, info, trace, warning } = useLog("tree.ts");

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
            currentObjectNode.propertyTypeEnhanced === "NullValue"; /*||
            currentObjectNode.propertyTypeEnhanced === "UndefinedValue"*/

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
        `Created ${rowNumber - currentRowNumber} display rows under "${currentObjectNode.propertyName}"`
    );

    return []; // TODO ÄR DETTA RÄTT?!?!?
}

export const isDescendant = (id: string, descendantId: string) => {
    return descendantId.startsWith(`${id}.`);
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

export const couldBeDisplayedAsTable = (objectTree: ObjectNode): boolean => {
    if (
        objectTree.nodeType === "array" &&
        objectTree.depthBelow === 2 &&
        objectTree.convenientIdentifierWhenCollapsed === "object[]"
    ) {
        return true;
    }

    return false;
};
