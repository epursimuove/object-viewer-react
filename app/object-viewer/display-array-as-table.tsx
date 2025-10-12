import type {
    ObjectNode,
    ObjectTree,
    PrimitiveLeaf,
    PropertyValue,
    TableCell,
    TableRow,
} from "~/types";
import { TableHeader } from "./table-header";
import { TableBody } from "./table-body";

export function DisplayArrayAsTable({
    originalObject,
    objectTree,
}: {
    originalObject: Record<string, PropertyValue>;
    objectTree: ObjectNode;
}) {
    if (objectTree.numberOfDescendants > 1 && objectTree.depthBelow !== 2) {
        console.error(`Invalid depth: ${objectTree.depthBelow}`, objectTree);
    }

    const tableRows: TableRow[] = Object.entries(objectTree.containedProperties).map(
        ([_index, arrayElement]: [string, ObjectTree]) => {
            const cells: TableCell[] =
                arrayElement.nodeType === "object"
                    ? Object.entries((arrayElement as ObjectNode)["containedProperties"]).map(
                          ([_index, property]: [string, ObjectTree]) => {
                              if (property.nodeType !== "leaf") {
                                  console.error(`Why is ${property.propertyName} not a leaf?`);
                                  throw new Error(`Why is ${property.propertyName} not a leaf?`);
                              }
                              const primitiveLeaf = property as PrimitiveLeaf;
                              return {
                                  columnName: primitiveLeaf["propertyName"],
                                  propertyTypeEnhanced: primitiveLeaf["propertyTypeEnhanced"],
                                  cellValue: primitiveLeaf["propertyValue"],
                                  primitiveLeaf: { ...primitiveLeaf, rowType: "leaf" },
                              };
                          }
                      )
                    : [];

            return {
                cells,
            };
        }
    );

    // console.log(tableRows);

    return (
        <>
            <div className="table-wrapper">
                <table className="json-as-table">
                    <TableHeader tableRows={tableRows} />

                    <TableBody tableRows={tableRows} />
                </table>
            </div>
        </>
    );
}
