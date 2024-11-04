import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable, Alert, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { IPeixe } from "../../types/Peixe";
import FormPeixe from '../FormPeixe';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as peixeSchema from '../../database/schemas/peixeSchema';
import * as loteSchema from '../../database/schemas/loteSchema';
import { eq } from 'drizzle-orm';

interface Props {
    lote: ILote | undefined;
}

export default function CardListaConfirma({ lote }: Props) {
    const [peixesNoLote, setPeixesNoLote] = useState<IPeixe[]>([]);
    const [selectedPeixes, setSelectedPeixes] = useState<number[]>([]);
    const [editingPeixeId, setEditingPeixeId] = useState<number | null>(null);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });
    const dbLote = drizzle(database, { schema: loteSchema });

    useEffect(() => {
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
    }

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
        console.log(lote, peixesNoLote);
        if (lote !== undefined) {
            try {
                await dbLote.update(loteSchema.lote).set({ ativo: 2 }).where(eq(loteSchema.lote.id, Number(lote.id)));
                Alert.alert("Confirmado na salgadeira!");
            } catch (error) {
                Alert.alert("Error ao atualizar o lote no banco interno: " + error);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {peixesNoLote.map(peixe => (
                    <View key={peixe.id} style={styles.itemContainer}>
                        <View style={styles.containerCheck}>
                            <View style={styles.containerCheck2}>
                                <CheckBox
                                    checked={selectedPeixes.includes(peixe.id!)}
                                    onPress={() => togglePeixe(peixe.id!)}
                                    containerStyle={styles.checkboxContainer}
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
                    disabled={selectedPeixes.length < peixesNoLote.length}
                    style={[styles.confirmButton, selectedPeixes.length < peixesNoLote.length && styles.disabledButton]}
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
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemContainer: {
        flexDirection: 'column',
        backgroundColor: '#F1F5FF',
        padding: 10,
        borderRadius: 8,
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
        width: 20,
        height: 20,
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
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    title: {
        color: '#2C205E',
        fontWeight: 'bold',
        fontSize: 14
    },
    text: {
        color: '#4B465E'
    },
});
