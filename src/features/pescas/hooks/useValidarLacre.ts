import { useEffect, useMemo, useRef, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { LACRE_DEBOUNCE_MS } from "../constants/pesca.constants";
import { createPescaRepository } from "../repositories/pescaRepository";
import { LacreValidationState } from "../types/pesca.types";
import { getLacreFormatError, normalizeLacre } from "../utils/normalizeLacre";

interface UseValidarLacreOptions {
    ignoredPeixeId?: number;
    enabled?: boolean;
}

export function useValidarLacre(
    lacre: string,
    options: UseValidarLacreOptions = {},
) {
    const database = useSQLiteContext();
    const repository = useMemo(() => createPescaRepository(database), [database]);
    const enabled = options.enabled ?? true;
    const ignoredPeixeId = options.ignoredPeixeId;
    const normalizedLacre = useMemo(() => normalizeLacre(lacre), [lacre]);
    const [state, setState] = useState<LacreValidationState>({ status: "idle" });
    const requestIdRef = useRef(0);

    useEffect(() => {
        requestIdRef.current += 1;
        const requestId = requestIdRef.current;
        let cancelled = false;

        if (!enabled || !normalizedLacre) {
            setState({ status: "idle" });
            return () => {
                cancelled = true;
                requestIdRef.current += 1;
            };
        }

        const formatError = getLacreFormatError(normalizedLacre);
        if (formatError) {
            setState({ status: "invalid", message: formatError });
            return () => {
                cancelled = true;
                requestIdRef.current += 1;
            };
        }

        console.info("[Pescas][Lacre] Debounce de validacao agendado");

        const timer = setTimeout(() => {
            if (cancelled || requestIdRef.current !== requestId) {
                return;
            }

            setState({ status: "checking" });
            console.info("[Pescas][Lacre] Consulta local iniciada");

            repository
                .existsByLacre(normalizedLacre, ignoredPeixeId)
                .then((exists) => {
                    if (cancelled || requestIdRef.current !== requestId) {
                        return;
                    }

                    console.info("[Pescas][Lacre] Consulta local concluida");
                    setState(
                        exists
                            ? {
                                status: "duplicate",
                                message: "Este lacre ja foi registrado.",
                            }
                            : {
                                status: "available",
                                message: "Lacre disponivel.",
                            },
                    );
                })
                .catch((error) => {
                    if (cancelled || requestIdRef.current !== requestId) {
                        return;
                    }

                    console.error("[Pescas][Lacre] Falha ao validar lacre", error);
                    setState({
                        status: "error",
                        message: "Nao foi possivel validar o lacre.",
                    });
                });
        }, LACRE_DEBOUNCE_MS);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            requestIdRef.current += 1;
        };
    }, [enabled, ignoredPeixeId, normalizedLacre, repository]);

    return state;
}
