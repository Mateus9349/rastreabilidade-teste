// src/utils/numberValidators.ts

export const parseDecimalBR = (value: string) => {
    if (!value) return null;

    const normalized = value.replace(',', '.');
    const number = Number(normalized);

    return Number.isFinite(number) ? number : null;
};

export const isDecimalBRInRange = (
    value: string,
    min: number,
    max: number
) => {
    const number = parseDecimalBR(value);

    if (number === null) return false;

    return number >= min && number <= max;
};

export const hasDecimalBRRangeError = (
    value: string,
    min: number,
    max: number
) => {
    if (!value) return false;

    return !isDecimalBRInRange(value, min, max);
};