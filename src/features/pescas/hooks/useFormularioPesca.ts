import { useCallback, useMemo, useState } from "react";

import {
    GONA_MACHO_OPTION,
    INITIAL_PESCA_FORM_DATA,
} from "../constants/pesca.constants";
import {
    validatePescaFormData,
    validatePescaFormField,
} from "../schemas/pescaFormSchema";
import {
    PescaFormData,
    PescaFormErrors,
    PescaFormField,
    PescaFormValidationResult,
} from "../types/pesca.types";
import { normalizeLacre } from "../utils/normalizeLacre";

const toFormData = (dadosIniciais?: PescaFormData): PescaFormData => ({
    ...INITIAL_PESCA_FORM_DATA,
    ...dadosIniciais,
});

export function useFormularioPesca(dadosIniciais?: PescaFormData) {
    const initialData = useMemo(() => toFormData(dadosIniciais), [dadosIniciais]);
    const [formData, setFormData] = useState<PescaFormData>(initialData);
    const [errors, setErrors] = useState<PescaFormErrors>({});
    const [touched, setTouched] = useState<Partial<Record<PescaFormField, boolean>>>({});

    const clearFieldError = (current: PescaFormErrors, field: PescaFormField) => {
        const next = { ...current };
        delete next[field];
        return next;
    };

    const updateField = useCallback((field: PescaFormField, value: string) => {
        setFormData((current) => {
            const next: PescaFormData = {
                ...current,
                [field]: field === "lacre" ? normalizeLacre(value) : value,
            };

            if (field === "sexo") {
                next.gona = value === "M" ? GONA_MACHO_OPTION : "";
            }

            if (field === "comunidade") {
                next.lago = "";
            }

            return next;
        });

        setErrors((current) => clearFieldError(current, field));
    }, []);

    const touchField = useCallback((field: PescaFormField) => {
        const fieldError = validatePescaFormField(formData, field);

        setTouched((current) => ({ ...current, [field]: true }));

        setErrors((current) => {
            const next = { ...current };

            if (fieldError) {
                next[field] = fieldError;
            } else {
                delete next[field];
            }

            return next;
        });
    }, [formData]);

    const validateForm = useCallback((): PescaFormValidationResult => {
        const result = validatePescaFormData(formData);

        if (!result.success) {
            setErrors(result.errors);
            setTouched(
                Object.keys(INITIAL_PESCA_FORM_DATA).reduce<
                    Partial<Record<PescaFormField, boolean>>
                >((acc, key) => {
                    acc[key as PescaFormField] = true;
                    return acc;
                }, {}),
            );
            return result;
        }

        setErrors({});
        setFormData(result.data);
        return result;
    }, [formData]);

    const setFieldError = useCallback(
        (field: PescaFormField, message: string) => {
            setErrors((current) => ({ ...current, [field]: message }));
            setTouched((current) => ({ ...current, [field]: true }));
        },
        [],
    );

    const reset = useCallback(() => {
        setFormData(initialData);
        setErrors({});
        setTouched({});
    }, [initialData]);

    const getVisibleError = useCallback(
        (field: PescaFormField) => (touched[field] ? errors[field] : undefined),
        [errors, touched],
    );

    return {
        errors,
        formData,
        getVisibleError,
        reset,
        setFieldError,
        touchField,
        touched,
        updateField,
        validateForm,
    };
}
