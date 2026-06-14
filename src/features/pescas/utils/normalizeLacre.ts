import { LACRE_MAX_LENGTH } from "../constants/pesca.constants";

export function normalizeLacre(value: string): string {
    return value.replace(/\D/g, "").slice(0, LACRE_MAX_LENGTH);
}

export function getLacreFormatError(value: string): string | null {
    const normalized = normalizeLacre(value);

    if (!normalized) {
        return "Lacre obrigatorio.";
    }

    if (!/^\d+$/.test(normalized)) {
        return "Lacre deve conter apenas numeros.";
    }

    if (normalized.length > LACRE_MAX_LENGTH) {
        return `Lacre deve ter no maximo ${LACRE_MAX_LENGTH} digitos.`;
    }

    return null;
}
