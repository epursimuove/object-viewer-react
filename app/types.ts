export type PropertyName = string;

export type PropertyTypeOriginal =
    "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "bigint"
    | "symbol"
    | "function"
    | "undefined";

// TODO Is is possible to extend from PropertyTypeOriginal?!?
export type PropertyTypeEnhanced =
    "string"
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
    | "CountryCode"
    | "Locale"
    | "EmailAddress"
    | "NullValue"
    | "UndefinedValue"
    | "EmptyString"
    | "Integer"
    | "Zero";

export type PropertyValue = number | string | boolean | null | object | undefined;

export interface TreeBase {
    nodeType: "leaf" | "object" | "array";
    id: string;
    parentId?: string;
    level: number;
    
    isVisible: boolean;
    
    propertyName: PropertyName;
    propertyTypeOriginal: PropertyTypeOriginal;
    propertyTypeEnhanced: PropertyTypeEnhanced;
    propertyMetaData?: string;
}

export interface NodeBase {
    length: number;
    convenientIdentifierWhenCollapsed?: string;
    isExpanded: boolean;
}

export interface PrimitiveLeaf extends TreeBase {
    propertyValue: PropertyValue;
    isNada: boolean;
}

export interface ObjectNode extends TreeBase, NodeBase {
    containedProperties: Record<string, ObjectTree>; // Can also be indexes for arrays ("0", "1", "2", ...).
}

export type ObjectTree = PrimitiveLeaf | ObjectNode;

export interface DisplayRow {
    rowType: "leaf" | "object" | "array";
    rowNumber: number;
    indentationLevel: number; // Or string???
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
    isNada: boolean;
}

export interface UserConfigurationContextType {
    indentObjectTree: boolean;
    showPropertyType: boolean;
    showMetaData: boolean;
    showNadaValues: boolean;
    showLeafs: boolean;
    showIdentifyingValues: boolean;
    filterOnProperty: string;

    setIndentObjectTree: (value: boolean) => void;
    setShowPropertyType: (value: boolean) => void;
    setShowMetaData: (value: boolean) => void;
    setShowNadaValues: (value: boolean) => void;
    setShowLeafs: (value: boolean) => void;
    setShowIdentifyingValues: (value: boolean) => void;
    setFilterOnProperty: (value: string) => void;
}
