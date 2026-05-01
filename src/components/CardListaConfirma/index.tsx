import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable, Alert, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { IPeixe } from "../../interfaces/Peixe";
import FormPeixe from '../../pages/Pescas/components/PeixeForm';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as peixeSchema from '../../database/schemas/peixeSchema';
import * as loteSchema from '../../database/schemas/loteSchema';
import { eq } from 'drizzle-orm';

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

interface Props {
    lote: ILote | undefined;
}

export default function CardListaConfirma({ lote }: Props) {
    /* const [peixesNoLote, setPeixesNoLote] = useState<IPeixe[]>([]); */
    const [selectedPeixes, setSelectedPeixes] = useState<number[]>([]);
    const [editingPeixeId, setEditingPeixeId] = useState<number | null>(null);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });
    const dbLote = drizzle(database, { schema: loteSchema });

    /* useEffect(() => {
        fetchPeixes();
    }, [editingPeixeId]);

    async function fetchPeixes() {
        if (lote !== undefined) {
            try {
                await db.transaction(async tx => {
                    const response = await db.query.peixe.findMany();
                    const peixesDoLote = response.filter((peixe) => lote.peixes.includes(peixe.lacre));
                    setPeixesNoLote(peixesDoLote);
                });
            } catch (error) {
                console.log('Error ao carregar os peixes do Lote: ' + error);
            }
        }
    } */

    async function editarPeixe(peixe: IPeixe, id: number | undefined) {
        if (id === undefined || id === 0) {
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
            setEditingPeixeId(null);
        } catch (error) {
            console.log(error);
        }
    }

    const togglePeixe = (id: number) => {
        if (selectedPeixes.includes(id)) {
            setSelectedPeixes(selectedPeixes.filter(peixeId => peixeId !== id));
        } else {
            setSelectedPeixes([...selectedPeixes, id]);
        }
    };

    const handleConfirm = async () => {
        if (lote !== undefined) {
            try {
                await dbLote.update(loteSchema.lote).set({ ativo: 2 }).where(eq(loteSchema.lote.id, Number(lote.id)));
                Alert.alert("Aguardando confirmação da salgadeira!");
            } catch (error) {
                Alert.alert("Error ao atualizar o lote no banco interno: " + error);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {lote?.peixes.map(peixe => (
                    <View key={peixe.id} style={styles.itemContainer}>
                        <View style={styles.containerCheck}>
                            <View style={styles.containerCheck2}>
                                <CheckBox
                                    checked={selectedPeixes.includes(peixe.id!)}
                                    onPress={() => togglePeixe(peixe.id!)}
                                    checkedColor="#871B21"
                                    uncheckedColor="#871B21"
                                />
                                <View>
                                    <Text style={styles.title}>#{peixe.lacre}</Text>
                                </View>
                            </View>
                            <Pressable
                                style={styles.containerIcon}
                                onPress={() => {
                                    if (peixe.id !== undefined) {
                                        // Toggle editing for the specific fish
                                        setEditingPeixeId(editingPeixeId === peixe.id ? null : peixe.id);
                                    }
                                }}
                            >
                                <Image style={styles.icon} source={require('../../../assets/icons/editar.png')} />
                            </Pressable>
                        </View>

                        {/* Render only the editing form for the specific fish */}
                        {editingPeixeId === peixe.id && (
                            <View style={styles.formContainer}>
                                <FormPeixe
                                    dadosIniciais={peixe}
                                    onSubmit={(dadosEditados: IPeixe) => editarPeixe(dadosEditados, peixe.id)}
                                />
                            </View>
                        )}

                        <View style={styles.containerText}>
                            <View >
                                <Text style={styles.title}>{peixe.lacre}</Text>
                                <Text style={styles.text}>Lacre</Text>
                            </View>
                            <View style={styles.peixeInfo}>
                                <Text style={styles.title}>{peixe.peso} kg</Text>
                                <Text style={styles.text}>Peso</Text>
                            </View>
                        </View>
                    </View>
                ))}

                <TouchableOpacity
                    onPress={handleConfirm}
                    disabled={selectedPeixes.length < (lote?.peixes?.length ?? 0)}
                    style={[styles.confirmButton, selectedPeixes.length < (lote?.peixes?.length ?? 0) && styles.disabledButton]}
                >
                    <Text style={styles.confirmButtonText}>Confirmar Seleção</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 15,
    },
    container: {
        borderRadius: 8,
    },
    itemContainer: {
        flexDirection: 'column',
        padding: 10,
        borderRadius: 15,
        borderColor: '#EDF2FD',
        borderWidth: 0.2,
        marginBottom: 15,
    },
    checkboxContainer: {
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    containerCheck: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    containerCheck2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    containerIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 35
    },
    icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 10,
    },
    formContainer: {
        padding: 10,
    },
    containerText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingLeft: 35
    },
    peixeInfo: {
        marginLeft: 50,
        width: 80,
    },
    confirmButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#871B21',
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#373737',
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14
    },
    text: {
        color: '#BBBBBB'
    },
});
