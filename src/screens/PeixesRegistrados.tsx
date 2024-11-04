import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useEffect, useState } from "react";
import { IPeixe } from "../types/Peixe";
import { Alert, Button, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormPeixe from "../components/FormPeixe";


import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as peixeSchema from '../database/schemas/peixeSchema';
import { eq } from "drizzle-orm";
import FormLote from "../components/FormLote";
import * as loteSchema from "../database/schemas/loteSchema";


type Props = NativeStackScreenProps<RootStackParamList, 'PeixesRegistrados'>;

export default function PeixesRegistrados({ navigation }: Props) {
    const [peixes, setPeixes] = useState<IPeixe[]>([]);
    const [editingPeixeId, setEditingPeixeId] = useState<number | null>(null);
    const [finalizar, setFinalizar] = useState<boolean>(false);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    async function fetchPeixes() {
        try {
            const response = await db.query.peixe.findMany();
            const peixesAtivos = response.filter(item => item.ativo === 1); // Filtra apenas peixes ativos
            setPeixes(peixesAtivos); // Define apenas peixes ativos no estado
        } catch (error) {
            console.log(error);
        }
    }


    async function editarPeixe(peixe: IPeixe, id: number | undefined) {
        if (id === undefined || id === 0) {
            // Exibir uma mensagem de erro ou não fazer nada
            Alert.alert("Erro", "ID inválido.");
            return;
        }

        try {
            await db
                .update(peixeSchema.peixe)
                .set({
                    lacre: peixe.lacre,
                    especie: peixe.especie,
                    cat: peixe.cat,
                    sexo: peixe.sexo,
                    unidade: peixe.unidade,
                    gona: peixe.gona,
                    comprimento: peixe.comprimento,
                    peso: peixe.peso,
                    hPesca: peixe.hPesca,
                    lago: peixe.lago,
                    comunidade: peixe.comunidade,
                    hEvisceramento: peixe.hEvisceramento,
                })
                .where(eq(peixeSchema.peixe.id, id));

            // Atualiza a lista de peixes após a edição
            await fetchPeixes();
            setEditingPeixeId(null); // Fecha o formulário de edição
        } catch (error) {
            console.log(error);
        }
    }

    async function remove(id: number | undefined) {
        if (id === undefined || id === 0) {
            // Exibir uma mensagem de erro ou não fazer nada
            Alert.alert("Erro", "ID inválido.");
            return;
        }

        try {
            Alert.alert("Remover", "Deseja remover?", [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Sim",
                    onPress: async () => {
                        try {
                            await db
                                .delete(peixeSchema.peixe)
                                .where(eq(peixeSchema.peixe.id, id)); // Ajuste conforme a sintaxe correta da Drizzle ORM

                            await fetchPeixes();
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPeixes()
    }, [finalizar]);

    const dbLote = drizzle(database, { schema: loteSchema });

    const registrarLote = async (dados: ILote) => {
        // Converter a data para um formato string, por exemplo, ISO
        const dataString = dados.data.toISOString(); // Converte para string ISO

        // Transforme o array de peixes em uma string JSON
        const pesoTotalString = JSON.stringify(dados.pesoTotal);
        const peixesString = JSON.stringify(dados.peixes);

        // Criação do objeto myLoteData
        const myLoteData = { // Adicionado o sinal de igual (=)
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

            // Aqui você deve usar myLoteData em vez de dados
            const response = await dbLote.insert(loteSchema.lote).values(myLoteData);
            Alert.alert("Cadastrado com o ID: " + response.lastInsertRowId);
            setFinalizar(false);
        } catch (error) {
            console.error("Erro ao processar peixes ou cadastrar o lote:", error);
            Alert.alert("Erro", "Não foi possível concluir o processo. Tente novamente.");
        }

    };


    return <>
        {!finalizar ?
            <View style={style.containerMain}>
                <View style={style.containerTitle}>
                    <Text style={style.title}>Pescas Atuais</Text>

                    <Text style={style.p}>Confirme as informações de pescado como lacre e peso</Text>
                </View>

                <FlatList
                    data={peixes}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <View style={style.containerCards}>
                            <View style={style.card}>
                                <View style={style.containerTextCard}>
                                    <Image source={require('../../assets/icons/peixe.png')} />
                                    <View>
                                        <Text style={style.lacre}>{item.lacre}</Text>
                                        <Text style={style.text}>Número do lacre</Text>
                                    </View>
                                </View>

                                <Pressable
                                    onLongPress={() => remove(item.id)}
                                    onPress={() => {
                                        if (item.id !== undefined) {
                                            setEditingPeixeId(editingPeixeId === item.id ? null : item.id);
                                        }
                                    }}
                                >

                                    <Image source={require('../../assets/icons/editar.png')} />
                                </Pressable>
                            </View>

                            {editingPeixeId === item.id && (
                                <FormPeixe
                                    dadosIniciais={item}
                                    onSubmit={(dadosEditados: IPeixe) => editarPeixe(dadosEditados, item.id)}
                                />
                            )}
                        </View>
                    )}
                    ListEmptyComponent={() => <Text>Lista vazia.</Text>}
                    contentContainerStyle={{ gap: 16, margin: 0 }}
                />

                <TouchableOpacity style={style.btn} onPress={() => setFinalizar(true)}>
                    <Text style={style.btnText}>Preparar lote</Text>
                </TouchableOpacity>
            </View>
            :
            <FormLote
                peixes={peixes}
                post={registrarLote}
            />
        }
    </>
}

const style = StyleSheet.create({
    containerMain: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center', // Centraliza os itens horizontalmente
        marginTop: 20
    },

    containerTitle: {
        marginBottom: 16,
        marginLeft: 16,
        alignSelf: 'flex-start'
    },
    title: {
        color: '#2C205E',
        fontSize: 24,
        fontWeight: 'bold'
    },
    p: {
        color: '#4B465E',
        width: 280
    },

    containerCards: {

    },
    card: {
        width: '95%',
        marginLeft: 9,
        marginRight: 8,
        padding: 16,
        borderRadius: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Garante que o conteúdo interno esteja alinhado no centro
        backgroundColor: '#F1F5FF'
    },
    containerTextCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    lacre: {
        color: '#2C205E',
        fontWeight: 'bold',
        fontSize: 15
    },
    text: {
        color: '#4B465E'
    },

    btn: {
        maxHeight: 48,
        marginBottom: 16,
        backgroundColor: '#200393',
        width: '90%',
        borderRadius: 14,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    },
});
