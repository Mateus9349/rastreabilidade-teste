import { useCallback, useMemo, useRef, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { createPescaRepository } from "../repositories/pescaRepository";
import { validatePescaFormData } from "../schemas/pescaFormSchema";
import {
    DuplicateLacreError,
    InvalidPescaDataError,
    InvalidPescaLocationError,
} from "../services/pescaErrors";
import { PescaFormData, RegistrarPescaResult } from "../types/pesca.types";
import { mapPescaFormToDatabase } from "../utils/mapPescaFormToDatabase";

const toMessage = (error: Error) => {
    if (error instanceof DuplicateLacreError) {
        return "Nao foi possivel cadastrar: este lacre ja existe.";
    }

    if (error instanceof InvalidPescaLocationError) {
        return error.message;
    }

    if (error instanceof InvalidPescaDataError) {
        return "Revise os campos do formulario.";
    }

    return "Nao foi possivel concluir o cadastro. Tente novamente.";
};

export function useRegistrarPesca() {
    const database = useSQLiteContext();
    const repository = useMemo(() => createPescaRepository(database), [database]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const registrarPesca = useCallback(
        async (data: PescaFormData): Promise<RegistrarPescaResult> => {
            if (submittingRef.current) {
                const error = new Error("Cadastro ja esta em andamento.");
                return { success: false, error, message: error.message };
            }

            const validation = validatePescaFormData(data);
            if (!validation.success) {
                const error = new InvalidPescaDataError(
                    "Dados de pescado invalidos.",
                    validation.errors,
                );
                return { success: false, error, message: toMessage(error) };
            }

            submittingRef.current = true;
            setIsSubmitting(true);
            console.info("[Pescas][Registrar] Iniciando cadastro");

            try {
                const payload = mapPescaFormToDatabase(validation.data);
                const pesca = await repository.create(payload);
                console.info("[Pescas][Registrar] Cadastro concluido");

                return { success: true, pesca };
            } catch (error) {
                const parsedError =
                    error instanceof Error
                        ? error
                        : new Error("Erro inesperado ao registrar pescado.");
                console.error("[Pescas][Registrar] Falha", parsedError);

                return {
                    success: false,
                    error: parsedError,
                    message: toMessage(parsedError),
                };
            } finally {
                submittingRef.current = false;
                setIsSubmitting(false);
            }
        },
        [repository],
    );

    return { isSubmitting, registrarPesca };
}
