import { SQLiteDatabase } from "expo-sqlite";
import { and, eq, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";

import * as comunidadeSchema from "../../../database/schemas/comunidadeSchema";
import * as lagoSchema from "../../../database/schemas/lagoSchema";
import * as peixeSchema from "../../../database/schemas/peixeSchema";
import { NewPesca, Pesca, UpdatePesca } from "../types/pesca.types";
import { normalizeLacre } from "../utils/normalizeLacre";
import {
    DuplicateLacreError,
    InvalidPescaLocationError,
    PescaPersistenceError,
} from "../services/pescaErrors";

const schema = {
    ...peixeSchema,
    ...comunidadeSchema,
    ...lagoSchema,
};

const createDb = (database: SQLiteDatabase) => drizzle(database, { schema });
type PescaDb = ReturnType<typeof createDb>;
type PescaTransaction = Parameters<Parameters<PescaDb["transaction"]>[0]>[0];

const isUniqueConstraintError = (error: unknown) =>
    error instanceof Error &&
    /unique constraint failed|constraint failed/i.test(error.message);

export function createPescaRepository(database: SQLiteDatabase) {
    const db = createDb(database);

    const findById = async (id: number): Promise<Pesca | null> => {
        const [row] = await db
            .select()
            .from(peixeSchema.peixe)
            .where(eq(peixeSchema.peixe.id, id))
            .limit(1);

        return row ?? null;
    };

    const findByLacre = async (lacre: string): Promise<Pesca | null> => {
        const normalizedLacre = normalizeLacre(lacre);
        const [row] = await db
            .select()
            .from(peixeSchema.peixe)
            .where(eq(peixeSchema.peixe.lacre, normalizedLacre))
            .limit(1);

        return row ?? null;
    };

    const existsByLacre = async (
        lacre: string,
        ignoredPeixeId?: number,
    ): Promise<boolean> => {
        const normalizedLacre = normalizeLacre(lacre);
        const row = ignoredPeixeId
            ? await db
                .select({ id: peixeSchema.peixe.id })
                .from(peixeSchema.peixe)
                .where(
                    and(
                        eq(peixeSchema.peixe.lacre, normalizedLacre),
                        ne(peixeSchema.peixe.id, ignoredPeixeId),
                    ),
                )
                .limit(1)
            : await db
                .select({ id: peixeSchema.peixe.id })
                .from(peixeSchema.peixe)
                .where(eq(peixeSchema.peixe.lacre, normalizedLacre))
                .limit(1);

        return row.length > 0;
    };

    const assertLocalValido = async (
        data: Pick<NewPesca, "comunidade" | "lago">,
        tx: PescaDb | PescaTransaction,
    ) => {
        const [comunidade] = await tx
            .select({ id: comunidadeSchema.comunidades.id })
            .from(comunidadeSchema.comunidades)
            .where(eq(comunidadeSchema.comunidades.nome, data.comunidade))
            .limit(1);

        if (!comunidade) {
            throw new InvalidPescaLocationError("Selecione uma comunidade valida.");
        }

        const [lago] = await tx
            .select({ id: lagoSchema.lagos.id })
            .from(lagoSchema.lagos)
            .where(
                and(
                    eq(lagoSchema.lagos.nome, data.lago),
                    eq(lagoSchema.lagos.comunidadeId, comunidade.id),
                ),
            )
            .limit(1);

        if (!lago) {
            throw new InvalidPescaLocationError(
                "Selecione um lago valido para a comunidade.",
            );
        }
    };

    const listAtivas = async (): Promise<Pesca[]> => {
        return db
            .select()
            .from(peixeSchema.peixe)
            .where(eq(peixeSchema.peixe.ativo, 1));
    };

    const create = async (data: NewPesca): Promise<Pesca | null> => {
        const normalizedData: NewPesca = {
            ...data,
            lacre: normalizeLacre(data.lacre),
        };

        try {
            let insertedId: number | undefined;

            await db.transaction(async (tx) => {
                await assertLocalValido(normalizedData, tx);

                const [duplicate] = await tx
                    .select({ id: peixeSchema.peixe.id })
                    .from(peixeSchema.peixe)
                    .where(eq(peixeSchema.peixe.lacre, normalizedData.lacre))
                    .limit(1);

                if (duplicate) {
                    throw new DuplicateLacreError();
                }

                const result = await tx
                    .insert(peixeSchema.peixe)
                    .values(normalizedData);
                insertedId = Number(result.lastInsertRowId);
            });

            return insertedId ? findById(insertedId) : findByLacre(normalizedData.lacre);
        } catch (error) {
            if (
                error instanceof DuplicateLacreError ||
                error instanceof InvalidPescaLocationError
            ) {
                throw error;
            }

            if (isUniqueConstraintError(error)) {
                throw new DuplicateLacreError();
            }

            console.error("[Pescas][Repository] Falha ao criar pescado", error);
            throw new PescaPersistenceError();
        }
    };

    const update = async (
        id: number,
        data: UpdatePesca,
    ): Promise<Pesca | null> => {
        const normalizedData: UpdatePesca = {
            ...data,
            lacre: data.lacre ? normalizeLacre(data.lacre) : data.lacre,
        };

        try {
            await db.transaction(async (tx) => {
                if (normalizedData.comunidade && normalizedData.lago) {
                    await assertLocalValido(
                        {
                            comunidade: normalizedData.comunidade,
                            lago: normalizedData.lago,
                        },
                        tx,
                    );
                }

                if (normalizedData.lacre) {
                    const [duplicate] = await tx
                        .select({ id: peixeSchema.peixe.id })
                        .from(peixeSchema.peixe)
                        .where(
                            and(
                                eq(peixeSchema.peixe.lacre, normalizedData.lacre),
                                ne(peixeSchema.peixe.id, id),
                            ),
                        )
                        .limit(1);

                    if (duplicate) {
                        throw new DuplicateLacreError();
                    }
                }

                await tx
                    .update(peixeSchema.peixe)
                    .set(normalizedData)
                    .where(eq(peixeSchema.peixe.id, id));
            });

            return findById(id);
        } catch (error) {
            if (
                error instanceof DuplicateLacreError ||
                error instanceof InvalidPescaLocationError
            ) {
                throw error;
            }

            if (isUniqueConstraintError(error)) {
                throw new DuplicateLacreError();
            }

            console.error("[Pescas][Repository] Falha ao atualizar pescado", error);
            throw new PescaPersistenceError("Nao foi possivel atualizar o pescado.");
        }
    };

    const remove = async (id: number): Promise<void> => {
        await db.delete(peixeSchema.peixe).where(eq(peixeSchema.peixe.id, id));
    };

    const desativar = async (id: number): Promise<void> => {
        await db
            .update(peixeSchema.peixe)
            .set({ ativo: 0 })
            .where(eq(peixeSchema.peixe.id, id));
    };

    return {
        create,
        desativar,
        existsByLacre,
        findById,
        findByLacre,
        listAtivas,
        remove,
        update,
    };
}

export type PescaRepository = ReturnType<typeof createPescaRepository>;
