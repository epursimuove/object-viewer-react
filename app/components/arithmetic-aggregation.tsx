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
            textContent={prettifyArithmeticAggregation(arithmeticAggregation)}
        />
    );
}
