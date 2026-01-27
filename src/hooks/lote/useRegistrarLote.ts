import { useState } from "react";
import { Alert } from "react-native";
import { ILote } from "../../interfaces/Lote";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as loteSchema from "../../database/schemas/loteSchema";
import * as peixeSchema from "../../database/schemas/peixeSchema";
import { eq } from "drizzle-orm";

export function useRegistrarLote(dbLote: any, dbPeixe: any, peixes: any[]) {
    const [isLoading, setIsLoading] = useState(false);

    const registrarLote = async (dados: ILote) => {
        setIsLoading(true);

        try {
            // Converter a data para um formato string, por exemplo, ISO
            const dataString = dados.data.toISOString(); // Converte para string ISO

            // Transforme o array de peixes e peso total em strings JSON
            const pesoTotalString = JSON.stringify(dados.pesoTotal);
            const peixesString = JSON.stringify(dados.peixes);

            // Criação do objeto myLoteData
            const myLoteData = {
                planilha: dados.planilha,
                comunidade: dados.comunidade,
                setor: dados.setor,
                assistente: dados.assistente,
                barco: dados.barco,
                data: dataString,
                apetrechos: dados.apetrechos,
                ambiente: dados.ambiente,
                quantidade: dados.quantidade,
                quantidadeF: dados.quantidadeF,
                quantidadeM: dados.quantidadeM,
                pesoTotal: pesoTotalString,
                peixes: peixesString,
            };

            // Atualizar o status dos peixes
            for (const peixe of peixes) {
                if (dados.peixes.includes(peixe.lacre)) {
                    await dbPeixe
                        .update(peixeSchema.peixe)
                        .set({ ativo: 0 })
                        .where(eq(peixeSchema.peixe.id, Number(peixe.id)));
                }
            }

            // Inserir o lote no banco de dados
            const response = await dbLote.insert(loteSchema.lote).values(myLoteData);

            Alert.alert("Lote cadastrado com o ID: " + response.lastInsertRowId);
        } catch (error) {
            console.error("Erro ao processar peixes ou cadastrar o lote:", error);
            Alert.alert("Erro", "Não foi possível concluir o processo. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return { registrarLote, isLoading };
}
