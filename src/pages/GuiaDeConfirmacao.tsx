import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import * as loteSchema from '../database/schemas/loteSchema';
import SelectLoteConfirmacao from "../components/SelectLoteConfirmacao";
import CardListaConfirma from "../components/CardListaConfirma";

interface Lote {
    id: number;
    ambiente: string;
    apetrechos: string;
    assistente: string;
    barco: string;
    comunidade: string;
    data: string;
    peixes: string;
    pesoTotal: string;
    planilha: number;
    quantidade: number;
    quantidadeF: number;
    quantidadeM: number;
    setor: string;
}

export default function GuiaDeConfirmacao() {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [click, setClick] = useState<boolean>(true);
    const [loteSelected, setLoteSelected] = useState<any>(undefined);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: loteSchema });

    async function fetchLotes() {
        try {
            const response = await db.query.lote.findMany();
            const lotesEnviados = response.filter(lote => lote.ativo === 0);
            setLotes(lotesEnviados);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchLotes();
    }, []);

    const selectLote = (lote: Lote) => {
        setClick(false);
        setLoteSelected(lote);
    }

    return (
        <>
            {click ?
                <>
                    <Text style={{ color: '#2C205E', fontSize: 25, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>
                        Escolha o lote enviado para confirmar:
                    </Text>
                    <SelectLoteConfirmacao
                        lotes={lotes}
                        selectLote={selectLote}
                    />
                </>
                :
                <ScrollView>
                    <View style={{ width: '90%', marginHorizontal: 'auto', marginVertical: 32 }}>
                        <Text style={{ color: '#2C205E', fontWeight: 'bold', fontSize: 24 }}>
                            Guias de Confirmação
                        </Text>

                        <Text style={{ color: '#4B465E', fontSize: 16 }}>
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
