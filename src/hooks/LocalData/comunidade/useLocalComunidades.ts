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

  const listarComunidades = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const lista = await ComunidadeLocalService.listar(db);
      setComunidades(lista);
    } catch (err) {
      console.error("[Comunidades] Erro ao listar comunidades locais", err);
      setError(err);
      setComunidades([]);
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    listarComunidades();
  }, [listarComunidades]);

  return { comunidades, listarComunidades, loading, error };
}
