import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Button,
    Card,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';

import * as peixeSchema from '../database/schemas/peixeSchema';
import * as loteSchema from '../database/schemas/loteSchema';

import FormLote from '../components/FormLote';
import { pegaPeixesSelecionados } from '../utils/pegaPeixesPorLacres';
import { IPeixe } from '../interfaces/Peixe';
import { ILote } from '../interfaces/Lote';
import { useCriarLoteMemoriaInterna } from '../hooks/lote/useCriarLoteMemoriaInterna';

export default function PrepararLoteScreen() {
    const theme = useTheme();

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });
    const dbLote = drizzle(database, { schema: loteSchema });

    const [peixes, setPeixes] = useState<IPeixe[]>([]);
    const [selectedPeixes, setSelectedPeixes] = useState<string[]>([]);
    const [finalizar, setFinalizar] = useState<boolean>(false);
    const [peixesSelecionados, setPeixesSelecionados] = useState<IPeixe[]>([]);

    const { registrarLote } = useCriarLoteMemoriaInterna();

    useEffect(() => {
        fetchPeixes();
    }, []);

    useEffect(() => {
        if (finalizar) {
            fetchPeixesSelecionados();
        }
    }, [finalizar, selectedPeixes]);

    async function fetchPeixes() {
        try {
            const response = await db.query.peixe.findMany();
            const peixesAtivos = response.filter((item) => item.ativo === 1);
            setPeixes(peixesAtivos);
        } catch (error) {
            console.error('Erro ao buscar peixes:', error);
        }
    }

    async function fetchPeixesSelecionados() {
        try {
            const peixesResult = await pegaPeixesSelecionados(
                db,
                selectedPeixes
            );
            setPeixesSelecionados(peixesResult);
        } catch (error) {
            console.error('Erro ao buscar peixes selecionados:', error);
        }
    }

    const toggleSelectPeixe = (lacre: string) => {
        setSelectedPeixes((prevSelected) =>
            prevSelected.includes(lacre)
                ? prevSelected.filter((item) => item !== lacre)
                : [...prevSelected, lacre]
        );
    };

    const toggleSelectAll = () => {
        if (selectedPeixes.length === peixes.length) {
            setSelectedPeixes([]);
        } else {
            setSelectedPeixes(peixes.map((peixe) => peixe.lacre));
        }
    };

    async function handleLote(lote: ILote) {
        await registrarLote(db, dbLote, lote, peixesSelecionados);
        fetchPeixes();
        setFinalizar(false);
    }

    if (finalizar) {
        return (
            <Surface
                style={[
                    styles.screen,
                    { backgroundColor: theme.colors.background },
                ]}
            >
                <View style={styles.content}>
                    <Text
                        variant="headlineLarge"
                        style={[
                            styles.title,
                            { color: theme.colors.primary },
                        ]}
                    >
                        Formar lote
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={[
                            styles.subtitle,
                            { color: theme.colors.onSurfaceVariant },
                        ]}
                    >
                        Confirme as informações do lote com os peixes
                        selecionados
                    </Text>

                    <Surface
                        mode="elevated"
                        elevation={2}
                        style={[
                            styles.formContainer,
                            { backgroundColor: theme.colors.surface },
                        ]}
                    >
                        <FormLote
                            peixes={peixesSelecionados}
                            post={handleLote}
                        />
                    </Surface>
                </View>
            </Surface>
        );
    }

    return (
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
                        style={[
                            styles.title,
                            { color: theme.colors.primary },
                        ]}
                    >
                        Selecionar peixes
                    </Text>

                    <Text
                        variant="bodyMedium"
                        style={[
                            styles.subtitle,
                            { color: theme.colors.onSurfaceVariant },
                        ]}
                    >
                        Escolha os peixes que irão compor o novo lote
                    </Text>

                    <Button
                        mode="contained-tonal"
                        icon={
                            selectedPeixes.length === peixes.length
                                ? 'checkbox-multiple-blank-outline'
                                : 'checkbox-multiple-marked-outline'
                        }
                        onPress={toggleSelectAll}
                        style={styles.selectAllButton}
                        contentStyle={styles.buttonContent}
                    >
                        {selectedPeixes.length === peixes.length
                            ? 'Desmarcar todos'
                            : 'Selecionar todos'}
                    </Button>
                </View>

                <FlatList
                    data={peixes}
                    keyExtractor={(item) => item.id?.toString() || ''}
                    renderItem={({ item }) => {
                        const isSelected = selectedPeixes.includes(item.lacre);

                        return (
                            <Card
                                mode="elevated"
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: isSelected
                                            ? theme.colors.primaryContainer
                                            : theme.colors.surface,
                                        borderColor: isSelected
                                            ? theme.colors.primary
                                            : theme.colors.outline,
                                    },
                                ]}
                            >
                                <TouchableRipple
                                    onPress={() =>
                                        toggleSelectPeixe(item.lacre)
                                    }
                                    borderless
                                >
                                    <View style={styles.cardContent}>
                                        <View
                                            style={[
                                                styles.imageContainer,
                                                {
                                                    backgroundColor:
                                                        theme.colors.primary,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={require('../../assets/icons/peixe.png')}
                                                style={styles.image}
                                            />
                                        </View>

                                        <View style={styles.cardInfo}>
                                            <Text
                                                variant="titleMedium"
                                                style={[
                                                    styles.cardTitle,
                                                    {
                                                        color: theme.colors
                                                            .primary,
                                                    },
                                                ]}
                                            >
                                                Lacre: {item.lacre}
                                            </Text>

                                            <Text
                                                variant="bodySmall"
                                                style={[
                                                    styles.cardDescription,
                                                    {
                                                        color: theme.colors
                                                            .onSurfaceVariant,
                                                    },
                                                ]}
                                            >
                                                Toque para selecionar ou remover
                                                este peixe do lote
                                            </Text>
                                        </View>

                                        {isSelected && (
                                            <MaterialIcons
                                                name="check-circle"
                                                size={26}
                                                color={theme.colors.primary}
                                            />
                                        )}
                                    </View>
                                </TouchableRipple>
                            </Card>
                        );
                    }}
                    ListEmptyComponent={
                        <Surface
                            mode="flat"
                            style={[
                                styles.emptyContainer,
                                {
                                    backgroundColor:
                                        theme.colors.surfaceVariant,
                                },
                            ]}
                        >
                            <Text
                                variant="bodyMedium"
                                style={[
                                    styles.emptyText,
                                    {
                                        color: theme.colors.onSurfaceVariant,
                                    },
                                ]}
                            >
                                Nenhum peixe ativo encontrado para formar lote.
                            </Text>
                        </Surface>
                    }
                    contentContainerStyle={[
                        styles.listContent,
                        peixes.length === 0 && styles.emptyListContent,
                    ]}
                    showsVerticalScrollIndicator={false}
                />

                <Button
                    mode="contained"
                    onPress={() => setFinalizar(true)}
                    disabled={selectedPeixes.length === 0}
                    style={styles.submitButton}
                    contentStyle={styles.buttonContent}
                >
                    Formar lote
                </Button>
            </View>
        </Surface>
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
        marginBottom: 24,
    },
    title: {
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        marginBottom: 20,
    },
    selectAllButton: {
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    listContent: {
        paddingBottom: 16,
        gap: 12,
    },
    emptyListContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    card: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
    },
    imageContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    image: {
        width: 34,
        height: 34,
        resizeMode: 'contain',
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontWeight: '700',
        marginBottom: 4,
    },
    cardDescription: {
        lineHeight: 18,
    },
    emptyContainer: {
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
    },
    submitButton: {
        borderRadius: 12,
        marginTop: 20,
    },
    buttonContent: {
        minHeight: 44,
    },
    formContainer: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
    },
});