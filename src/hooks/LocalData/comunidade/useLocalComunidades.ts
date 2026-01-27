// src/hooks/comunidade/useLocalComunidades.ts
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as comunidadeSchema from "../../../database/schemas/comunidadeSchema";
import { IComunidade } from "../../../interfaces/Comunidade";
import { ComunidadeLocalService } from "../../../services/LocalData/comunidadeLocalService";


export function useLocalComunidades() {
  const [comunidades, setComunidades] = useState<IComunidade[]>([]);
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: comunidadeSchema });

  async function listarComunidades() {
    const lista = await ComunidadeLocalService.listar(db);
    setComunidades(lista);
  }

  useEffect(() => {
    listarComunidades();
  }, []);

  return { comunidades, listarComunidades };
}
