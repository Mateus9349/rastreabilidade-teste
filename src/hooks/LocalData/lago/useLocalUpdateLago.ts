// src/hooks/lago/useLocalUpdateLago.ts
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as lagoSchema from "../../../database/schemas/lagoSchema";
import { LagoLocalService } from "../../../services/LocalData/lagoLocalService";
import { ILago } from "../../../interfaces/Lago";

export function useLocalUpdateLago() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: lagoSchema });

    async function updateLago(id: number, dados: Partial<ILago>) {
        return await LagoLocalService.atualizar(db, id, dados);
    }

    return { updateLago };
}
