// hooks/lote/useCriarLoteCom500Auto.ts
import { useState } from "react";
import { Alert } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from "../../database/schemas/peixeSchema";
import * as loteSchema from "../../database/schemas/loteSchema";
import { ILote } from "../../interfaces/Lote";
import { IPeixe } from "../../interfaces/Peixe";

// -----------------------------------------------------------------------------
// Tipagens utilitárias
// -----------------------------------------------------------------------------

/** Drizzle db principal (fora de transação) */
type DrizzleDb = ReturnType<typeof drizzle>;

/**
 * Interface estrutural mínima para permitir uso tanto de `db` quanto `tx`
 * (ambos expõem `.insert(table).values(...)`).
 */
type Insertable = {
    insert: (table: any) => { values: (vals: any[] | any) => Promise<any> };
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function randFloat(min: number, max: number, decimals = 2) {
    const v = Math.random() * (max - min) + min;
    const f = Math.pow(10, decimals);
    return Math.round(v * f) / f;
}

/** Insere em chunks para não estourar o limite de parâmetros do SQLite */
async function insertChunkedPeixes(
    dbLike: Insertable, // aceita db OU tx
    values: IPeixe[],
    chunkSize = 100
) {
    for (let i = 0; i < values.length; i += chunkSize) {
        const slice = values.slice(i, i + chunkSize);
        await dbLike.insert(peixeSchema.peixe).values(slice);
    }
}

/** Lê todos os lacres existentes e retorna um Set<number> para checagem rápida */
async function getExistingLacresSet(db: DrizzleDb): Promise<Set<number>> {
    const rows = await db
        .select({ lacre: peixeSchema.peixe.lacre })
        .from(peixeSchema.peixe);

    const set = new Set<number>();
    for (const r of rows) {
        const n = Number(String(r.lacre).trim());
        if (Number.isFinite(n)) set.add(n);
    }
    return set;
}

/** Gera um lacre inteiro único, iniciando em seed, pulando o que já existir */
function gerarLacreSequencial(
    used: Set<number>,
    seed: number,
    offset: number
): number {
    let cand = seed + offset; // ex.: 1500 + i
    while (used.has(cand)) cand += 1; // pula se existir
    used.add(cand);
    return cand;
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useCriarLoteCom500Auto() {
    const [loading, setLoading] = useState(false);

    /**
     * Gera 500 peixes aleatórios e cria um lote com eles (numa transação).
     * @param db drizzle com schemas de peixe e lote na MESMA conexão
     * @param base Dados base do lote (data, barco, comunidade, etc.)
     *             quantidade/quantidadeF/quantidadeM/pesoTotal/peixes são calculados aqui
     * @param opts Customização de limites e campos padrões (opcional)
     */
    const criarLoteCom500Auto = async (
        db: DrizzleDb,
        base: Omit<
            ILote,
            "quantidade" | "quantidadeF" | "quantidadeM" | "pesoTotal" | "peixes"
        >,
        opts?: {
            /** Limites de geração aleatória */
            pesoMinKg?: number;       // padrão 5
            pesoMaxKg?: number;       // padrão 140 (requisito)
            compMinM?: number;        // padrão 0.6
            compMaxM?: number;        // padrão 1.7 (requisito)
            /** Rótulos padrão */
            especie?: string;         // padrão "Arapaima gigas"
            cat?: string;             // padrão "A"
            unidade?: string;         // padrão "kg"
            gona?: string;            // padrão "NA"
            lago?: string;            // padrão base.ambiente ou "Lago"
            createdBy?: string;       // opcional
            statusPeixe?: string;     // padrão "LOTEADO"
            /** Semente do lacre inteiro sequencial */
            startLacre?: number;      // padrão 1500
        }
    ) => {
        setLoading(true);
        try {
            const {
                pesoMinKg = 5,
                pesoMaxKg = 140,
                compMinM = 0.6,
                compMaxM = 1.7,
                especie = "Arapaima gigas",
                cat = "A",
                unidade = "kg",
                gona = "NA",
                lago = base.ambiente || "Lago",
                createdBy,
                statusPeixe = "LOTEADO",
                startLacre = 1500, // começa em 1500
            } = opts || {};

            if (!(base?.data instanceof Date)) {
                throw new Error("O campo 'data' do lote precisa ser um Date válido.");
            }

            // Conjunto de lacres já existentes no banco para garantir unicidade global
            const usedLacres = await getExistingLacresSet(db);

            const dataBase = new Date(base.data);
            const peixesGerados: IPeixe[] = [];
            let quantidadeF = 0;
            let quantidadeM = 0;
            let pesoTotal = 0;

            for (let i = 0; i < 500; i++) {
                // lacre inteiro único
                const lacreInt = gerarLacreSequencial(usedLacres, startLacre, i);
                const lacreStr = String(lacreInt); // schema atual usa string

                const sexo = Math.random() < 0.5 ? "F" : "M";
                if (sexo === "F") quantidadeF += 1;
                else quantidadeM += 1;

                const peso = randFloat(pesoMinKg, pesoMaxKg, 2);
                const comprimento = randFloat(compMinM, compMaxM, 2);

                // Horários realistas
                const hPesca = new Date(
                    dataBase.getTime() + Math.floor(Math.random() * 3) * 3600000
                ); // +0-2h
                const hEvisceramento = new Date(
                    hPesca.getTime() + (1 + Math.floor(Math.random() * 2)) * 3600000
                ); // +1-2h

                pesoTotal += peso;

                peixesGerados.push({
                    // id é autoincrement no SQLite — deixe undefined
                    especie,
                    cat,
                    lacre: lacreStr,                  // string, mas representa INTEIRO
                    sexo,                             // "F" ou "M"
                    unidade,                          // "kg"
                    gona,                             // maturação/observação
                    comprimento: String(comprimento), // string (modelo atual)
                    peso: String(peso),               // string (modelo atual)
                    hPesca: hPesca.toISOString(),
                    lago,
                    comunidade: base.comunidade,
                    hEvisceramento: hEvisceramento.toISOString(),
                    hChegadaSalgadeira: undefined,    // será preenchido na etapa da salgadeira
                    ativo: 0,                         // já entram loteados (não disponíveis p/ outro lote)
                    createdBy,
                    status: statusPeixe,              // "LOTEADO"
                });
            }

            const quantidade = 500;
            const pesoTotalStr = JSON.stringify(Number(pesoTotal.toFixed(3)));
            const lacres = peixesGerados.map(p => p.lacre);  // string[]
            const peixesStr = JSON.stringify(lacres);
            const dataStr = dataBase.toISOString();

            // Transação única (robusto)
            const result = await db.transaction(async (tx) => {
                // `tx` casa com Insertable (tem .insert().values())
                await insertChunkedPeixes(tx as unknown as Insertable, peixesGerados, 100);

                const loteInsert = await (tx as unknown as Insertable)
                    .insert(loteSchema.lote)
                    .values({
                        planilha: base.planilha,
                        comunidade: base.comunidade,
                        setor: base.setor,
                        assistente: base.assistente,
                        barco: base.barco,
                        data: dataStr,
                        apetrechos: base.apetrechos,
                        ambiente: base.ambiente,
                        quantidade,
                        quantidadeF,
                        quantidadeM,
                        pesoTotal: pesoTotalStr,
                        peixes: peixesStr, // guarda lista de lacres (string) no lote local
                    });

                return {
                    loteId: (loteInsert as any).lastInsertRowId,
                    quantidade,
                    quantidadeF,
                    quantidadeM,
                    pesoTotal: Number(pesoTotal.toFixed(3)),
                    lacres, // string[] representando inteiros
                };
            });

            Alert.alert("Sucesso", `Lote criado com ID: ${result.loteId}`);
            return result;
        } catch (err: any) {
            console.error("Erro ao criar lote com 500 peixes:", err);
            Alert.alert("Erro", err?.message || "Não foi possível criar o lote.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { criarLoteCom500Auto, loading };
}
