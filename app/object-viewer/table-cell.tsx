import type { JSX } from "react";
import { AnchoredInfoBox } from "~/components/anchored-info-box";
import { ObjectPropertyValue } from "~/components/object-property-value";
import type { TableCell } from "~/types";

export function TableCell({ tableCell }: { tableCell: TableCell }): JSX.Element {
    const tableCellElement: JSX.Element = (
        <td>
            {tableCell.primitiveLeaf.propertyMetaData ? (
                <AnchoredInfoBox
                    labelAnchor={<ObjectPropertyValue displayRow={tableCell.primitiveLeaf} />}
                    tag="Additional info"
                    type="info"
                >
                    {/* <ObjectPropertyValue displayRow={cell.primitiveLeaf} /> */}
                    {tableCell.primitiveLeaf.propertyMetaData}
                </AnchoredInfoBox>
            ) : (
                <ObjectPropertyValue displayRow={tableCell.primitiveLeaf} />
            )}
        </td>
    );

    // return <td key={index}>{"" + cell.cellValue}</td>;
    return tableCellElement;
}
