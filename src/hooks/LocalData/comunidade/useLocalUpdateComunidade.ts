// src/hooks/comunidade/useLocalUpdateComunidade.ts
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as comunidadeSchema from "../../../database/schemas/comunidadeSchema";
import { ComunidadeLocalService } from "../../../services/LocalData/comunidadeLocalService";
import { IComunidade } from "../../../interfaces/Comunidade";

export function useLocalUpdateComunidade() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: comunidadeSchema });

    async function updateComunidade(id: number, dados: Partial<IComunidade>) {
        return await ComunidadeLocalService.atualizar(db, id, dados);
    }

    return { updateComunidade };
}
