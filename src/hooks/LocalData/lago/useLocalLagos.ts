// src/hooks/lago/useLocalLagos.ts
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as lagoSchema from "../../../database/schemas/lagoSchema";
import { ILago } from "../../../interfaces/Lago";
import { LagoLocalService } from "../../../services/LocalData/lagoLocalService";

export function useLocalLagos() {
    const [lagos, setLagos] = useState<ILago[]>([]);
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: lagoSchema });

    async function listarLagos() {
        const lista = await LagoLocalService.listar(db);
        setLagos(lista);
    }

    useEffect(() => {
        listarLagos();
    }, []);

    return { lagos, listarLagos };
}
