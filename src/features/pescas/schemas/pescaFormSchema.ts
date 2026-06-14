import {
    COMPRIMENTO_MAX,
    COMPRIMENTO_MIN,
    PESO_MAX,
    PESO_MIN,
    SEXO_OPTIONS,
} from "../constants/pesca.constants";
import {
    PescaFormData,
    PescaFormErrors,
    PescaFormField,
    PescaFormValidationResult,
} from "../types/pesca.types";
import { normalizeDate } from "../utils/normalizeDate";
import { parseBrazilianDecimal } from "../utils/normalizeDecimal";
import { getLacreFormatError, normalizeLacre } from "../utils/normalizeLacre";

const requiredText = (
    value: string | undefined,
    field: keyof PescaFormErrors,
    label: string,
    errors: PescaFormErrors,
) => {
    const normalized = (value ?? "").trim();

    if (!normalized) {
        errors[field] = `${label} obrigatorio.`;
    }

    return normalized;
};

const formatNumber = (value: number) => String(value).replace(".", ",");

export function validatePeso(value: string): string | null {
    const parsed = parseBrazilianDecimal(value);

    if (parsed === null) {
        return "Peso invalido.";
    }

    if (parsed <= 0) {
        return "Peso deve ser maior que zero.";
    }

    if (parsed < PESO_MIN) {
        return `Peso deve ser maior ou igual a ${formatNumber(PESO_MIN)} kg.`;
    }

    if (parsed > PESO_MAX) {
        return `Peso nao pode ultrapassar ${formatNumber(PESO_MAX)} kg.`;
    }

    return null;
}

export function validateComprimento(value: string): string | null {
    const parsed = parseBrazilianDecimal(value);

    if (parsed === null) {
        return "Comprimento invalido.";
    }

    if (parsed <= 0) {
        return "Comprimento deve ser maior que zero.";
    }

    if (parsed < COMPRIMENTO_MIN) {
        return `Comprimento deve ser maior ou igual a ${formatNumber(COMPRIMENTO_MIN)} m.`;
    }

    if (parsed > COMPRIMENTO_MAX) {
        return `Comprimento nao pode ultrapassar ${formatNumber(COMPRIMENTO_MAX)} m.`;
    }

    return null;
}

const normalizeValidatedDecimal = (
    value: string,
    field: keyof PescaFormErrors,
    validate: (value: string) => string | null,
    errors: PescaFormErrors,
) => {
    const error = validate(value);

    if (error) {
        errors[field] = error;
        return "";
    }

    const parsed = parseBrazilianDecimal(value);

    return parsed === null ? "" : String(parsed);
};

export function validatePescaFormField(
    formData: PescaFormData,
    field: PescaFormField,
): string | undefined {
    switch (field) {
        case "lacre":
            return getLacreFormatError(normalizeLacre(formData.lacre)) ?? undefined;
        case "peso":
            return validatePeso(formData.peso) ?? undefined;
        case "comprimento":
            return validateComprimento(formData.comprimento) ?? undefined;
        case "sexo": {
            const sexo = formData.sexo.trim();
            if (!sexo) {
                return "Sexo obrigatorio.";
            }
            return SEXO_OPTIONS.includes(sexo) ? undefined : "Sexo invalido.";
        }
        case "hPesca":
            return normalizeDate(formData.hPesca)
                ? undefined
                : "Horario da pesca invalido.";
        case "hEvisceramento": {
            const hEvisceramento = normalizeDate(formData.hEvisceramento);
            if (!hEvisceramento) {
                return "Horario da evisceracao invalido.";
            }

            const hPesca = normalizeDate(formData.hPesca);
            if (
                hPesca &&
                new Date(hEvisceramento).getTime() < new Date(hPesca).getTime()
            ) {
                return "Horario da evisceracao deve ser posterior ao da pesca.";
            }

            return undefined;
        }
        case "especie":
            return formData.especie.trim() ? undefined : "Especie obrigatorio.";
        case "cat":
            return formData.cat.trim() ? undefined : "Categoria obrigatorio.";
        case "unidade":
            return formData.unidade.trim() ? undefined : "Unidade obrigatorio.";
        case "gona":
            return formData.gona.trim() ? undefined : "Estagio gonodal obrigatorio.";
        case "lago":
            return formData.lago.trim() ? undefined : "Lago obrigatorio.";
        case "comunidade":
            return formData.comunidade.trim() ? undefined : "Comunidade obrigatorio.";
        case "id":
            return undefined;
        default:
            return undefined;
    }
}

export function validatePescaFormData(
    formData: PescaFormData,
): PescaFormValidationResult {
    const errors: PescaFormErrors = {};

    const lacre = normalizeLacre(formData.lacre);
    const lacreError = getLacreFormatError(lacre);

    if (lacreError) {
        errors.lacre = lacreError;
    }

    const sexo = requiredText(formData.sexo, "sexo", "Sexo", errors);
    if (sexo && !SEXO_OPTIONS.includes(sexo)) {
        errors.sexo = "Sexo invalido.";
    }

    const hPesca = normalizeDate(formData.hPesca);
    if (!hPesca) {
        errors.hPesca = "Horario da pesca invalido.";
    }

    const hEvisceramento = normalizeDate(formData.hEvisceramento);
    if (!hEvisceramento) {
        errors.hEvisceramento = "Horario da evisceracao invalido.";
    }

    if (hPesca && hEvisceramento) {
        const pescaTime = new Date(hPesca).getTime();
        const evisceramentoTime = new Date(hEvisceramento).getTime();

        if (evisceramentoTime < pescaTime) {
            errors.hEvisceramento =
                "Horario da evisceracao deve ser posterior ao da pesca.";
        }
    }

    const normalizedData: PescaFormData = {
        id: formData.id,
        especie: requiredText(formData.especie, "especie", "Especie", errors),
        cat: requiredText(formData.cat, "cat", "Categoria", errors),
        lacre,
        sexo,
        unidade: requiredText(formData.unidade, "unidade", "Unidade", errors),
        gona: requiredText(formData.gona, "gona", "Estagio gonodal", errors),
        comprimento: normalizeValidatedDecimal(
            formData.comprimento,
            "comprimento",
            validateComprimento,
            errors,
        ),
        peso: normalizeValidatedDecimal(
            formData.peso,
            "peso",
            validatePeso,
            errors,
        ),
        hPesca: hPesca ?? "",
        lago: requiredText(formData.lago, "lago", "Lago", errors),
        comunidade: requiredText(
            formData.comunidade,
            "comunidade",
            "Comunidade",
            errors,
        ),
        hEvisceramento: hEvisceramento ?? "",
    };

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    return { success: true, data: normalizedData };
}
