import type { Temporal } from "@js-temporal/polyfill";

export type PropertyName = string;

export type PropertyTypeOriginal =
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array" // TODO Is this really original???
    | "bigint"
    | "symbol"
    | "function"
    | "undefined";

// TODO Is is possible to extend from PropertyTypeOriginal?!?
export type PropertyTypeEnhanced =
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "bigint"
    | "symbol"
    | "function"
    | "undefined"
    | "Timestamp"
    | "LocalDate"
    | "LocalTime"
    | "TimeZone"
    | "CountryCode"
    | "Locale"
    | "EmailAddress"
    | "NullValue"
    | "UndefinedValue"
    | "EmptyString"
    | "Integer"
    | "URL"
    | "Zero"
    | "ColorRGB"
    | "SemVer"
    | "PhoneNumber"
    | "BooleanFalse"
    | "BooleanTrue"
    | "IPv4"
    | "IPv6";

export type PropertyValue = number | string | boolean | null | object | undefined;

export interface TreeBase {
    nodeType: "leaf" | "object" | "array";
    id: string;
    parentId?: string;
    path: string;
    level: number;

    isVisible: boolean;

    propertyName: PropertyName;
    propertyTypeOriginal: PropertyTypeOriginal;
    propertyTypeEnhanced: PropertyTypeEnhanced;
    propertyMetaData?: string;

    isArrayIndex?: boolean;
}

export interface NodeBase {
    length: number;
    depthBelow: number;
    numberOfDescendants: number;
    convenientIdentifierWhenCollapsed?: string;
    isExpanded: boolean;
}

export interface PrimitiveLeaf extends TreeBase {
    propertyValue: PropertyValue;
    isNada: boolean;
}

export interface ObjectNode extends TreeBase, NodeBase {
    containedProperties: Record<string, ObjectTree>; // Can also be indexes for arrays ("0", "1", "2", ...).
    arithmeticAggregation?: ArithmeticAggregation;
}

export type ObjectTree = PrimitiveLeaf | ObjectNode;

export interface DisplayRow {
    rowType: "leaf" | "object" | "array";
    rowNumber: number;
    indentationLevel: number;
    recursiveToggleIcon: "" | "+" | "-" | "∅";
    propertyTypeOriginal: PropertyTypeOriginal;
    propertyTypeEnhanced: PropertyTypeEnhanced;
    propertyName: string;
    propertyValue?: PropertyValue;
    convenientIdentifierWhenCollapsed?: string;
    propertyMetaData?: string;
    hasChildren: boolean;
    numberOfChildren: number;
    isExpanded: boolean;
    isVisible: boolean;
    id: string;
    parentId?: string;
    path: string;
    isNada: boolean;
    arithmeticAggregation?: ArithmeticAggregation;
    isArrayIndex?: boolean;
}

export interface UserConfigurationContextType {
    indentObjectTree: boolean;
    showPropertyType: boolean;
    showMetaDataForLeaves: boolean;
    showMetaDataForNodes: boolean;
    showNadaValues: boolean;
    showLeaves: boolean;
    showIdentifyingValues: boolean;
    filterOnProperty: string;
    filterOnPropertyTypeEnhanced: PropertyTypeEnhanced[];

    setIndentObjectTree: (value: boolean) => void;
    setShowPropertyType: (value: boolean) => void;
    setShowMetaDataForLeaves: (value: boolean) => void;
    setShowMetaDataForNodes: (value: boolean) => void;
    setShowNadaValues: (value: boolean) => void;
    setShowLeaves: (value: boolean) => void;
    setShowIdentifyingValues: (value: boolean) => void;
    setFilterOnProperty: (value: string) => void;
    setFilterOnPropertyTypeEnhanced: (value: PropertyTypeEnhanced[]) => void;

    resetFilters: () => void;
}

export interface HistoryContextType {
    savedHistory: HistoryItem[];
    setSavedHistory: (value: HistoryItem[]) => void;
    clearSavedHistory: () => void;
}

export interface HistoryItem {
    id: string;
    checksum: string;
    object: Record<string, PropertyValue>;
    timestampFirstView: Temporal.Instant;
    timestampLastView: Temporal.Instant;
}

export interface ArithmeticAggregation {
    length?: number;
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    sum?: number;
}
