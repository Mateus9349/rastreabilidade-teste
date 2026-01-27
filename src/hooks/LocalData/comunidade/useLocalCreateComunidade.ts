import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as comunidadeSchema from "../../../database/schemas/comunidadeSchema";
import { ComunidadeLocalService } from "../../../services/LocalData/comunidadeLocalService";
import { IComunidade } from "../../../interfaces/Comunidade";


export function useLocalCreateComunidades() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: comunidadeSchema });

    async function createComunidade(dados: IComunidade) {
        return await ComunidadeLocalService.criar(db, dados);
    }

    return { createComunidade };
}
