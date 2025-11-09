import type { Temporal } from "@js-temporal/polyfill";
import type { unknownCommonPropertyTypeAncestor } from "./object-viewer/display-array-as-table";

export type PropertyName = string;

export const originalPropertyTypes = [
    "array", // TODO Is this really original???
    "bigint",
    "boolean",
    "function",
    "number",
    "object",
    "string",
    "symbol",
    "undefined",
] as const;

export const enhancedPropertyTypes = [
    "AbsolutePath",
    "BooleanFalse",
    "BooleanTrue",
    "ColorRGB",
    "CountryCode",
    "EmailAddress",
    "EmptyString",
    "Epoch",
    "HTTPMethod",
    "HTTPStatus",
    "Integer",
    "IPv4",
    "IPv6",
    "LocalDate",
    "Locale",
    "LocalTime",
    "NullValue",
    "PhoneNumber",
    "RegExp",
    "RelativePath",
    "SemVer",
    "Timestamp",
    "TimeZone",
    //"UndefinedValue",
    "URL",
    "Zero",
] as const;

const allPropertyTypes = [...originalPropertyTypes, ...enhancedPropertyTypes] as const;

export type PropertyTypeOriginal = (typeof originalPropertyTypes)[number];

export type PropertyTypeEnhanced = (typeof allPropertyTypes)[number];

export type CommonPropertyTypeAncestor =
    | PropertyTypeEnhanced
    | typeof unknownCommonPropertyTypeAncestor;

export type PropertyValue = number | string | boolean | null | object | undefined;

export type ExtraSpaces =
    | "start"
    | "middle"
    | "end"
    | "start-middle"
    | "start-end"
    | "middle-end"
    | "start-middle-end";

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

export interface TableCell {
    columnName: string;
    propertyTypeOriginal: PropertyTypeOriginal;
    propertyTypeEnhanced: PropertyTypeEnhanced;
    cellValue: PropertyValue;
    primitiveLeaf: PrimitiveLeaf & { rowType: "leaf" };
}
export interface TableRow {
    cellMap: Map<string, TableCell>; // columnName -> TableCell.
}

export type TableRowComparator = (tableRowA: TableRow, tableRowB: TableRow) => number;

export type TableRowSorterConfiguration = { columnName: string; ascending: boolean };
