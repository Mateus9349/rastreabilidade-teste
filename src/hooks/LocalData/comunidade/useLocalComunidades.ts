// src/hooks/comunidade/useLocalComunidades.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as comunidadeSchema from "../../../database/schemas/comunidadeSchema";
import { IComunidade } from "../../../interfaces/Comunidade";
import { ComunidadeLocalService } from "../../../services/LocalData/comunidadeLocalService";


export function useLocalComunidades() {
  const [comunidades, setComunidades] = useState<IComunidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const database = useSQLiteContext();
  const db = useMemo(() => drizzle(database, { schema: comunidadeSchema }), [database]);

  const listarComunidades = useCallback(async (
    shouldApply: () => boolean = () => true,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const lista = await ComunidadeLocalService.listar(db);
      if (shouldApply()) {
        setComunidades(lista);
      }
    } catch (err) {
      console.error("[Comunidades] Erro ao listar comunidades locais", err);
      if (shouldApply()) {
        setError(err);
        setComunidades([]);
      }
    } finally {
      if (shouldApply()) {
        setLoading(false);
      }
    }
  }, [db]);

  useEffect(() => {
    let active = true;
    listarComunidades(() => active);

    return () => {
      active = false;
    };
  }, [listarComunidades]);

  return { comunidades, listarComunidades, loading, error };
}
