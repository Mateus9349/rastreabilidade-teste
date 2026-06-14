export function parseBrazilianDecimal(value: string): number | null {
    const normalized = value.trim().replace(/\s/g, "").replace(",", ".");

    if (!normalized) {
        return null;
    }

    if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
        return null;
    }

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeDecimal(value: string): number | null {
    return parseBrazilianDecimal(value);
}

export function sanitizeDecimalInput(value: string): string {
    const sanitized = value
        .replace(/\s/g, "")
        .replace(/,/g, ".")
        .replace(/[^0-9.-]/g, "");

    const sign = sanitized.startsWith("-") ? "-" : "";
    const unsigned = sanitized.replace(/-/g, "");
    const [integerPart, ...decimalParts] = unsigned.split(".");

    if (decimalParts.length === 0) {
        return `${sign}${integerPart}`;
    }

    return `${sign}${integerPart}.${decimalParts.join("")}`;
}
