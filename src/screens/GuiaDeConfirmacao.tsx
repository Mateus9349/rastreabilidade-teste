import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import * as loteSchema from '../database/schemas/loteSchema';
import SelectLoteConfirmacao from "../components/SelectLoteConfirmacao";
import * as peixeSchema from "../database/schemas/peixeSchema";
import { IPeixe } from "../types/Peixe";
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
    const [peixes, setPeixes] = useState<IPeixe[]>([]);
    const [click, setClick] = useState<boolean>(true);
    const [peixesSelected, setPeixesSelected] = useState<IPeixe[]>([]);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: loteSchema });
    const dbPeixes = drizzle(database, { schema: peixeSchema });

    async function fetchLotes() {
        try {
            const response = await db.query.lote.findMany();
            const responsePeixes = await dbPeixes.query.peixe.findMany();
            setLotes(response);
            setPeixes(responsePeixes);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchLotes();
    }, []);

    const selectLote = (lote: Lote) => {
        setClick(false);
        const peixesDoLote: IPeixe[] = peixes.filter((peixe) => lote.peixes.includes(peixe.lacre));
        setPeixesSelected(peixesDoLote);
    }

    return (
        <>
            <Text>Escolha o lote para confirmar: </Text>

            {click ?
                <SelectLoteConfirmacao
                    lotes={lotes}
                    selectLote={selectLote}
                />
                :
                <View>
                    <CardListaConfirma peixes={peixesSelected}/>
                    <Button title="voltar" onPress={() => setClick(true)} />
                </View>
            }

        </>
    )
}