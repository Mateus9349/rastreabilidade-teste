import { useCallback, useMemo } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { and, eq } from "drizzle-orm";

import * as comunidadeSchema from "../database/schemas/comunidadeSchema";
import * as lagoSchema from "../database/schemas/lagoSchema";
import { comunidades } from "./lagos";

export function useCriaComunidadesELagosBase() {
    const database = useSQLiteContext();
    const db = useMemo(
        () => drizzle(database, { schema: { ...comunidadeSchema, ...lagoSchema } }),
        [database],
    );

    const criarBase = useCallback(async () => {
        console.info("[DatabaseBootstrap] Iniciando base de comunidades e lagos");

        for (const comunidade of comunidades) {
            const existente = await db
                .select({ id: comunidadeSchema.comunidades.id })
                .from(comunidadeSchema.comunidades)
                .where(eq(comunidadeSchema.comunidades.nome, comunidade.nome))
                .limit(1);

            let comunidadeId = existente[0]?.id;

            if (comunidadeId == null) {
                const result = await db
                    .insert(comunidadeSchema.comunidades)
                    .values({
                        nome: comunidade.nome,
                        latitude: 0,
                        longitude: 0,
                    });

                comunidadeId = Number(result.lastInsertRowId);

                if (!Number.isFinite(comunidadeId)) {
                    throw new Error(
                        `Nao foi possivel obter o id da comunidade ${comunidade.nome}.`,
                    );
                }
            }

            for (const lago of comunidade.lagos) {
                const lagoExistente = await db
                    .select({ id: lagoSchema.lagos.id })
                    .from(lagoSchema.lagos)
                    .where(
                        and(
                            eq(lagoSchema.lagos.nome, lago.nome),
                            eq(lagoSchema.lagos.comunidadeId, comunidadeId),
                        ),
                    )
                    .limit(1);

                if (lagoExistente.length === 0) {
                    await db.insert(lagoSchema.lagos).values({
                        nome: lago.nome,
                        latitude: lago.latitude ?? 0,
                        longitude: lago.longitude ?? 0,
                        comunidadeId,
                    });
                }
            }
        }

        console.info("[DatabaseBootstrap] Base de comunidades e lagos pronta");
    }, [db]);

    return { criarBase };
}
