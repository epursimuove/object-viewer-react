import type { JSX } from "react";
import { AnchoredInfoBox } from "./anchored-info-box";
import { prettifyArithmeticAggregation } from "~/util/util";
import type { ArithmeticAggregation } from "~/types";

export function ArithmeticAggregation({
    labelAnchor,
    arithmeticAggregation,
}: {
    labelAnchor: string;
    arithmeticAggregation: ArithmeticAggregation;
}): JSX.Element {
    return (
        <AnchoredInfoBox
            labelAnchor={labelAnchor}
            tag="Aggregation"
            subTag={arithmeticAggregation.type}
        >
            <div className="arithmetic-aggregation-block">
                {prettifyArithmeticAggregation(arithmeticAggregation)}
            </div>
        </AnchoredInfoBox>
    );
}
