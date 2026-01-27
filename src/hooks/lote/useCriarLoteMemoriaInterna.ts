import { useState } from "react";
import { Alert } from "react-native";
import { ILote } from "../../interfaces/Lote";
import { IPeixe } from "../../interfaces/Peixe";
import * as peixeSchema from "../../database/schemas/peixeSchema";
import * as loteSchema from "../../database/schemas/loteSchema";
import { eq } from "drizzle-orm";

export function useCriarLoteMemoriaInterna() {
    const [loading, setLoading] = useState(false);

    const registrarLote = async (db: any, dbLote: any, dados: ILote, peixes: IPeixe[]) => {
        setLoading(true);

        // Converter a data para um formato string, por exemplo, ISO
        const dataString = dados.data.toISOString(); // Converte para string ISO

        // Transforme o array de peixes em uma string JSON
        const pesoTotalString = JSON.stringify(dados.pesoTotal);
        const peixesString = JSON.stringify(dados.peixes);

        // Criação do objeto myLoteData
        const myLoteData = {
            planilha: dados.planilha,
            comunidade: dados.comunidade,
            setor: dados.setor,
            assistente: dados.assistente,
            barco: dados.barco,
            data: dataString, // Armazena a data como string
            apetrechos: dados.apetrechos,
            ambiente: dados.ambiente,
            quantidade: dados.quantidade,
            quantidadeF: dados.quantidadeF,
            quantidadeM: dados.quantidadeM,
            pesoTotal: pesoTotalString,
            peixes: peixesString, // Armazena como string JSON
        };

        try {
            for (const peixe of peixes) {
                if (dados.peixes.includes(peixe.lacre)) {
                    await db
                        .update(peixeSchema.peixe)
                        .set({ ativo: 0 })
                        .where(eq(peixeSchema.peixe.id, Number(peixe.id)));
                }
            }

            // Insere os dados do lote na base de dados
            const response = await dbLote.insert(loteSchema.lote).values(myLoteData);
            Alert.alert("Cadastrado com o ID: " + response.lastInsertRowId);
        } catch (error) {
            console.error("Erro ao processar peixes ou cadastrar o lote:", error);
            Alert.alert("Erro", "Não foi possível concluir o processo. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return { registrarLote, loading };
}
