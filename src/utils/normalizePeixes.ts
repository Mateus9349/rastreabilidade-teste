// util local
export function normalizePeixes(input: unknown): any[] {
    if (Array.isArray(input)) return input;

    if (input == null) return [];

    if (typeof input === 'string') {
        const s = input.trim();
        // tenta JSON array
        if ((s.startsWith('[') && s.endsWith(']'))) {
            try {
                const arr = JSON.parse(s);
                return Array.isArray(arr) ? arr : [];
            } catch { /* continua */ }
        }
        // tenta CSV: "1,2,3"
        if (s.includes(',')) {
            return s.split(',').map(x => x.trim()).filter(Boolean);
        }
        // string única: "1"
        return s ? [s] : [];
    }

    // número único, objeto único, etc.
    return [input];
}
