import { useCallback, useEffect, useMemo, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { createPescaRepository } from "../repositories/pescaRepository";
import { validatePescaFormData } from "../schemas/pescaFormSchema";
import { Pesca, PescaFormData } from "../types/pesca.types";
import { mapPescaFormToDatabase } from "../utils/mapPescaFormToDatabase";

export function usePescasRegistradas() {
    const database = useSQLiteContext();
    const repository = useMemo(() => createPescaRepository(database), [database]);
    const [pescas, setPescas] = useState<Pesca[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const carregarPescas = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setPescas(await repository.listAtivas());
        } catch (err) {
            const parsedError =
                err instanceof Error
                    ? err
                    : new Error("Nao foi possivel carregar as pescas.");
            console.error("[Pescas][Listagem] Falha", err);
            setError(parsedError);
        } finally {
            setLoading(false);
        }
    }, [repository]);

    const atualizarPesca = useCallback(
        async (id: number, data: PescaFormData) => {
            const validation = validatePescaFormData(data);
            if (!validation.success) {
                throw new Error("Revise os campos do formulario.");
            }

            await repository.update(id, mapPescaFormToDatabase(validation.data));
            await carregarPescas();
        },
        [carregarPescas, repository],
    );

    const removerPesca = useCallback(
        async (id: number) => {
            await repository.remove(id);
            await carregarPescas();
        },
        [carregarPescas, repository],
    );

    useEffect(() => {
        carregarPescas();
    }, [carregarPescas]);

    return {
        atualizarPesca,
        carregarPescas,
        error,
        loading,
        pescas,
        removerPesca,
    };
}
