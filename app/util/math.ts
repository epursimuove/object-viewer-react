import type { ArithmeticAggregation } from "~/types";

const maxNumberOfDecimals = (n: number, numberOfDecimals = 2): number =>
    Math.round(n * Math.pow(10, numberOfDecimals)) / Math.pow(10, numberOfDecimals);

export const calculateAggregations = (numbers: number[]): ArithmeticAggregation => {
    const numberOfItems: number = numbers.length;
    if (numberOfItems === 0) {
        return {};
    }

    const sortedValues: number[] = numbers.toSorted((a, b) => a - b);
    const min: number = sortedValues.at(0)!;
    const max: number = sortedValues.at(-1)!;
    const sum: number = sortedValues.reduce((previous, current) => previous + current, 0);
    const mean: number = maxNumberOfDecimals(sum / numberOfItems);
    const median: number = maxNumberOfDecimals(calculateMedian(sortedValues));

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

export const convertDecimalToHex = (decimal: string): string =>
    parseInt(decimal, 10).toString(16).toUpperCase().padStart(2, "0");

export const getNumberOfIntegerDigits = (n: number) => {
    // Purely math, no strings in this solution.
    const numberOfIntegerDigits: number =
        n === 0 ? 1 : Math.floor(Math.log10(Math.floor(Math.abs(n)))) + 1;

    return numberOfIntegerDigits;
};
