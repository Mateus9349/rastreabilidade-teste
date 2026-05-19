import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Surface, Text, useTheme } from 'react-native-paper';

import { RootStackParamList } from '../navigation/types';
import { IPeixe } from '../interfaces/Peixe';
import FormPeixe from './Pescas/components/PeixeForm';

import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';

import * as peixeSchema from '../database/schemas/peixeSchema';
import * as loteSchema from '../database/schemas/loteSchema';

import FormLote from '../components/FormLote';
import { ILote } from '../interfaces/Lote';
import AppButton from '../components/ui/AppButton';

type Props = NativeStackScreenProps<RootStackParamList, 'PeixesRegistrados'>;

export default function PeixesRegistrados({ navigation }: Props) {
    const theme = useTheme();

    const [peixes, setPeixes] = useState<IPeixe[]>([]);
    const [editingPeixeId, setEditingPeixeId] = useState<number | null>(null);
    const [finalizar, setFinalizar] = useState<boolean>(false);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    async function fetchPeixes() {
        try {
            const response = await db.query.peixe.findMany();
            const peixesAtivos = response.filter((item) => item.ativo === 1);
            setPeixes(peixesAtivos);
        } catch (error) {
            console.log(error);
        }
    }

    async function editarPeixe(peixe: IPeixe, id: number | undefined) {
        if (id === undefined || id === 0) {
            Alert.alert('Erro', 'ID inválido.');
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

            await fetchPeixes();
            setEditingPeixeId(null);
        } catch (error) {
            console.log(error);
        }
    }

    async function remove(id: number | undefined) {
        if (id === undefined || id === 0) {
            Alert.alert('Erro', 'ID inválido.');
            return;
        }

        try {
            Alert.alert('Remover', 'Deseja remover?', [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sim',
                    onPress: async () => {
                        try {
                            await db
                                .delete(peixeSchema.peixe)
                                .where(eq(peixeSchema.peixe.id, id));

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
        fetchPeixes();
    }, [finalizar]);

    const dbLote = drizzle(database, { schema: loteSchema });

    const registrarLote = async (dados: ILote) => {
        const dataString = dados.data.toISOString();

        const pesoTotalString = JSON.stringify(dados.pesoTotal);
        const peixesString = JSON.stringify(dados.peixes);

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

        try {
            for (const peixe of peixes) {
                if (dados.peixes.includes(peixe.lacre)) {
                    await db
                        .update(peixeSchema.peixe)
                        .set({ ativo: 0 })
                        .where(eq(peixeSchema.peixe.id, Number(peixe.id)));
                }
            }

            const response = await dbLote.insert(loteSchema.lote).values(myLoteData);
            Alert.alert('Cadastrado com o ID: ' + response.lastInsertRowId);
            setFinalizar(false);
        } catch (error) {
            console.error('Erro ao processar peixes ou cadastrar o lote:', error);
            Alert.alert('Erro', 'Não foi possível concluir o processo. Tente novamente.');
        }
    };

    return (
        <>
            {!finalizar ? (
                <Surface
                    style={[
                        styles.screen,
                        { backgroundColor: theme.colors.background },
                    ]}
                >
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text
                                variant="headlineLarge"
                                style={[styles.title, { color: theme.colors.primary }]}
                            >
                                Pescas Atuais
                            </Text>

                            <Text
                                variant="bodyMedium"
                                style={[
                                    styles.subtitle,
                                    { color: theme.colors.onSurfaceVariant },
                                ]}
                            >
                                Confirme as informações de pescado como lacre e peso
                            </Text>
                        </View>

                        <View style={styles.listContainer}>
                            <FlatList
                                data={peixes}
                                keyExtractor={(item) => String(item.id)}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <View style={styles.cardWrapper}>
                                        <Surface
                                            mode="elevated"
                                            elevation={2}
                                            style={[
                                                styles.card,
                                                {
                                                    backgroundColor: theme.colors.surface,
                                                    borderColor: theme.colors.outline,
                                                },
                                            ]}
                                        >
                                            <View style={styles.cardContent}>
                                                <Surface
                                                    mode="flat"
                                                    style={[
                                                        styles.iconContainer,
                                                        { backgroundColor: theme.colors.primary },
                                                    ]}
                                                >
                                                    <Image
                                                        source={require('../../assets/icons/peixe.png')}
                                                        style={styles.fishIcon}
                                                    />
                                                </Surface>

                                                <View style={styles.cardTexts}>
                                                    <Text
                                                        variant="titleMedium"
                                                        style={[
                                                            styles.lacre,
                                                            { color: theme.colors.onSurface },
                                                        ]}
                                                    >
                                                        {item.lacre}
                                                    </Text>

                                                    <Text
                                                        variant="bodySmall"
                                                        style={{ color: theme.colors.onSurfaceVariant }}
                                                    >
                                                        Número do lacre
                                                    </Text>
                                                </View>
                                            </View>

                                            <Pressable
                                                onLongPress={() => remove(item.id)}
                                                onPress={() => {
                                                    if (item.id !== undefined) {
                                                        setEditingPeixeId(
                                                            editingPeixeId === item.id ? null : item.id,
                                                        );
                                                    }
                                                }}
                                                style={({ pressed }) => [
                                                    styles.editButton,
                                                    {
                                                        backgroundColor: theme.colors.primary,
                                                        opacity: pressed ? 0.75 : 1,
                                                    },
                                                ]}
                                            >
                                                <Image
                                                    source={require('../../assets/icons/editar.png')}
                                                    style={styles.editIcon}
                                                />
                                            </Pressable>
                                        </Surface>

                                        {editingPeixeId === item.id && (
                                            <View style={styles.formContainer}>
                                                <FormPeixe
                                                    dadosIniciais={item}
                                                    onSubmit={(dadosEditados: IPeixe) =>
                                                        editarPeixe(dadosEditados, item.id)
                                                    }
                                                />
                                            </View>
                                        )}
                                    </View>
                                )}
                                ListEmptyComponent={() => (
                                    <Surface
                                        mode="elevated"
                                        elevation={1}
                                        style={[
                                            styles.emptyCard,
                                            {
                                                backgroundColor: theme.colors.surface,
                                                borderColor: theme.colors.outline,
                                            },
                                        ]}
                                    >
                                        <Text
                                            variant="bodyMedium"
                                            style={{ color: theme.colors.onSurfaceVariant }}
                                        >
                                            Lista vazia.
                                        </Text>
                                    </Surface>
                                )}
                                contentContainerStyle={styles.listContent}
                            />
                        </View>

                        <AppButton
                            mode="contained"
                            onPress={() => navigation.navigate('PrepararLote')}
                            style={styles.button}
                        >
                            Preparar lote
                        </AppButton>
                    </View>
                </Surface>
            ) : (
                <FormLote peixes={peixes} post={registrarLote} />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingTop: 72,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 28,
    },
    title: {
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        maxWidth: 320,
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        gap: 16,
        paddingBottom: 16,
    },
    cardWrapper: {
        gap: 12,
    },
    card: {
        minHeight: 84,
        borderRadius: 18,
        borderWidth: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fishIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    cardTexts: {
        flex: 1,
    },
    lacre: {
        fontWeight: '700',
        marginBottom: 2,
    },
    editButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    editIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    formContainer: {
        marginTop: 4,
    },
    emptyCard: {
        borderRadius: 18,
        borderWidth: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 8,
    },
});