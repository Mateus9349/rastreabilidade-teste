const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export function normalizeDate(value: string): string | null {
    const normalized = value.trim();

    if (!normalized || !ISO_DATE_RE.test(normalized)) {
        return null;
    }

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString();
}
