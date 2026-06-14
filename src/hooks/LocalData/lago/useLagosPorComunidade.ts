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
        let active = true;
        const comunidadeNome = filtro.nome?.trim();

        if (filtro.comunidadeId == null && !comunidadeNome) {
            setData([]);
            setError(null);
            setLoading(false);

            return () => {
                active = false;
            };
        }

        (async () => {
            try {
                setLoading(true);
                setError(null);
                console.info("[Pescas][Lagos] Consulta local iniciada");
                const { comunidades } = comunidadeSchema;
                const { lagos } = lagoSchema;

                let rows: ILago[] = [];
                if (filtro.comunidadeId != null) {
                    rows = await db.select().from(lagos).where(eq(lagos.comunidadeId, filtro.comunidadeId));
                } else if (comunidadeNome) {
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
                        .where(eq(comunidades.nome, comunidadeNome));
                }

                if (active) {
                    console.info("[Pescas][Lagos] Consulta local concluida");
                    setData(rows);
                }
            } catch (e) {
                if (active) {
                    console.error("[Pescas][Lagos] Falha ao listar lagos", e);
                    setError(e);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [db, filtro.comunidadeId, filtro.nome]);

    return { data, loading, error };
}
