// src/hooks/comunidade/useLocalDeleteComunidade.ts
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as comunidadeSchema from "../../../database/schemas/comunidadeSchema";
import { ComunidadeLocalService } from "../../../services/LocalData/comunidadeLocalService";

export function useLocalDeleteComunidade() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: comunidadeSchema });

    async function deleteComunidade(id: number) {
        return await ComunidadeLocalService.deletar(db, id);
    }

    return { deleteComunidade };
}
