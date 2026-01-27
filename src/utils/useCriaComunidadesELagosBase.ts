import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { eq } from "drizzle-orm";
import * as comunidadeSchema from "../database/schemas/comunidadeSchema";
import * as lagoSchema from "../database/schemas/lagoSchema";
import { comunidades } from "./lagos"; // o arquivo com seus dados

export function useCriaComunidadesELagosBase() {
    const database = useSQLiteContext();
    const db = drizzle(database, { schema: { ...comunidadeSchema, ...lagoSchema } });

    async function criarBase() {
        try {
            console.log("🚀 Iniciando criação de comunidades e lagos base...");

            for (const comunidade of comunidades) {
                // 1️⃣ Verifica se a comunidade já existe
                const existente = await db
                    .select()
                    .from(comunidadeSchema.comunidades)
                    .where(eq(comunidadeSchema.comunidades.nome, comunidade.nome))
                    .limit(1);

                let comunidadeId: number;

                if (existente.length === 0) {
                    // 2️⃣ Cria comunidade nova
                    const result = await db
                        .insert(comunidadeSchema.comunidades)
                        .values({
                            nome: comunidade.nome,
                            latitude: 0,
                            longitude: 0,
                        });

                    // o drizzle com SQLite retorna { changes, lastInsertRowId }
                    comunidadeId = (result as any).lastInsertRowId;
                    console.log(`✅ Comunidade '${comunidade.nome}' criada (id ${comunidadeId})`);
                } else {
                    comunidadeId = existente[0].id;
                    console.log(`⚠️ Comunidade '${comunidade.nome}' já existe (id ${comunidadeId})`);
                }

                // 3️⃣ Cria lagos associados
                for (const lago of comunidade.lagos) {
                    const lagoExistente = await db
                        .select()
                        .from(lagoSchema.lagos)
                        .where(eq(lagoSchema.lagos.nome, lago.nome))
                        .limit(1);

                    if (lagoExistente.length === 0) {
                        await db.insert(lagoSchema.lagos).values({
                            nome: lago.nome,
                            latitude: lago.latitude ?? 0,
                            longitude: lago.longitude ?? 0,
                            comunidadeId, // 🔹 FK correta
                        });
                        console.log(`   🌊 Lago '${lago.nome}' criado.`);
                    } else {
                        console.log(`   ⚠️ Lago '${lago.nome}' já existe.`);
                    }
                }
            }

            console.log("🎉 Comunidades e lagos base criados/atualizados com sucesso!");
        } catch (error) {
            console.error("❌ Erro ao criar comunidades e lagos base:", error);
        }
    }

    return { criarBase };
}
