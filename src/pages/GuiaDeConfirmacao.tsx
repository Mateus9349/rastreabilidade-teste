import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import SelectLoteConfirmacao from "../components/SelectLoteConfirmacao";
import CardListaConfirma from "../components/CardListaConfirma";
import { useLotes } from "../hooks/lote/useLotes";
import { IPeixe } from "../interfaces/Peixe";

interface ILote {
    id?: string;
    planilha: number; // Número da planilha associada ao lote
    comunidade: string; // Nome da comunidade do lote
    setor: string; // Setor relacionado ao lote
    assistente: string; // Nome do assistente responsável pelo lote
    barco: string; // Nome do barco usado para a pesca
    data: string; // Data do lote no formato ISO 8601
    apetrechos: string; // Tipo de apetrechos usados na pesca
    ambiente: string; // Ambiente onde foi feito o lote
    quantidade: number; // Quantidade total de peixes no lote
    quantidadeF: number; // Quantidade de peixes fêmeas no lote
    quantidadeM: number; // Quantidade de peixes machos no lote
    pesoTotal: number; // Peso total do lote em kg
    peixes: IPeixe[]; // IDs dos peixes pertencentes ao lote
    ativo: number; // Status do lote (1 para ativo, 0 para inativo)
    recebidoSalgadeira: boolean; // Indica se o lote foi recebido na salgadeira
    createdBy: string; // Usuário que está cadastrando o lote  
}

export default function GuiaDeConfirmacao() {
    const { lotes, loading, error } = useLotes();
    const [click, setClick] = useState<boolean>(true);
    const [loteSelected, setLoteSelected] = useState<any>(undefined);

    const selectLote = (lote: ILote) => {
        setClick(false);
        setLoteSelected(lote);
    }

    return (
        <>
            {click ?
                <>
                    <Text style={{ color: '#FFFFFF', fontSize: 25, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>
                        Escolha o lote enviado para confirmar:
                    </Text>

                    {loading ? (
                        <Text>Carregando dados...</Text>
                    ) : error ? (
                        <Text>Erro ao carregar lotes, verifique sua conexão</Text>
                    ) : (
                        <SelectLoteConfirmacao
                            lotes={lotes.filter((lote: ILote) => lote.recebidoSalgadeira === false)}
                            selectLote={selectLote}
                        />
                    )}
                </>
                :
                <ScrollView>
                    <View style={{ width: '90%', marginHorizontal: 'auto', marginVertical: 32 }}>
                        <Text style={{ color: '#EDF2FD', fontWeight: 'bold', fontSize: 24 }}>
                            Guias de Confirmação
                        </Text>

                        <Text style={{ color: '#BBBBBB', fontSize: 16 }}>
                            Confirme as informações de pescado como lacre e peso.
                        </Text>
                    </View>

                    <CardListaConfirma
                        lote={loteSelected}
                    />
                </ScrollView>
            }
        </>
    )
}
