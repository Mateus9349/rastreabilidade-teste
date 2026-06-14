import { useEffect, useMemo, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import * as comunidadeSchema from "../../../database/schemas/comunidadeSchema";
import * as lagoSchema from "../../../database/schemas/lagoSchema";
import { ILago } from "../../../interfaces/Lago";

type Filtro = { comunidadeId?: number; nome?: string };

export function useLagosPorComunidade(filtro: Filtro) {
    const database = useSQLiteContext();
    const db = useMemo(() => drizzle(database, { schema: { ...lagoSchema, ...comunidadeSchema } }), [database]);

    const [data, setData] = useState<ILago[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError(null);
                const { comunidades } = comunidadeSchema;
                const { lagos } = lagoSchema;

                let rows: ILago[] = [];
                if (filtro.comunidadeId != null) {
                    rows = await db.select().from(lagos).where(eq(lagos.comunidadeId, filtro.comunidadeId));
                } else if (filtro.nome) {
                    rows = await db
                        .select({
                            id: lagos.id,
                            nome: lagos.nome,
                            latitude: lagos.latitude,
                            longitude: lagos.longitude,
                            comunidadeId: lagos.comunidadeId,
                        })
                        .from(lagos)
                        .innerJoin(comunidades, eq(lagos.comunidadeId, comunidades.id))
                        .where(eq(comunidades.nome, filtro.nome));
                } else {
                    rows = await db.select().from(lagos); // fallback
                }

                setData(rows);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [db, filtro.comunidadeId, filtro.nome]);

    return { data, loading, error };
}
