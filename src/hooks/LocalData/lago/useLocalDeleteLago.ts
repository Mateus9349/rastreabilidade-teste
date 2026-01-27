// src/hooks/lago/useLocalDeleteLago.ts
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as lagoSchema from "../../../database/schemas/lagoSchema";
import { LagoLocalService } from "../../../services/LocalData/lagoLocalService";

export function useLocalDeleteLago() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: lagoSchema });

    async function deleteLago(id: number) {
        return await LagoLocalService.deletar(db, id);
    }

    return { deleteLago };
}
