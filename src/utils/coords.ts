// utils/coords.ts
export function toNumberOrNull(v: unknown): number | null {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v.replace(",", ".")); // aceita " -3,123 "
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

export function formatCoord(n: unknown, decimals = 6): string {
    const num = toNumberOrNull(n);
    return num === null ? "—" : num.toFixed(decimals);
}
