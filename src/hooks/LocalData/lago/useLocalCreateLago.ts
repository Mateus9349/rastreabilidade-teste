// src/hooks/lago/useLocalCreateLago.ts
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as lagoSchema from "../../../database/schemas/lagoSchema";
import { LagoLocalService } from "../../../services/LocalData/lagoLocalService";
import { ILago } from "../../../interfaces/Lago";

export function useLocalCreateLago() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: lagoSchema });

    async function createLago(dados: ILago) {
        return await LagoLocalService.criar(db, dados);
    }

    return { createLago };
}
