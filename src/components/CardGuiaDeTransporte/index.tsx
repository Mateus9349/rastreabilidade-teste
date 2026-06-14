import React, { useContext, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    ImageBackground,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { eq } from 'drizzle-orm';
import {
    Button,
    Card,
    Surface,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';

import { gerarEPDFDownloadExpo } from '../../utils/gerarPDFGuiaDeTransporte';
import * as peixeSchema from '../../database/schemas/peixeSchema';
import * as loteSchema from '../../database/schemas/loteSchema';
import { ILote } from '../../interfaces/Lote';
import { AuthContext } from '../../contexts/AuthContext';
import { useEnviarLoteCompleto } from '../../hooks/lote/useEnviarLoteCompleto';

export default function CardGuiaDeTransporte({
    lotes,
    remove,
}: {
    lotes: Object[] | undefined;
    remove: (id: number) => void;
}) {
    const theme = useTheme();
    const { user } = useContext(AuthContext);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    const { enviarLoteCompleto, loadingEnviar } = useEnviarLoteCompleto({
        createdBy: user?.nome ?? user?.email ?? '',
        chunkSize: 50,
        defaultsPeixe: {
            especie: 'Pirarucu',
            unidade: '1',
            status: 'PENDING',
        },
        resolvePeixeByLacre: async (lacre) => {
            const peixe = await db.query.peixe.findFirst({
                where: (tbl, { eq }) => eq(tbl.lacre, String(lacre)),
            });

            return peixe as any;
        },
    });

    const [gerarPDFLoading, setGerarPDFLoading] = useState<boolean>(false);
    const [loteEnviado, setLoteEnviado] = useState<boolean>(false);

    useEffect(() => {
        // opcional: efeitos relacionados aos lotes
    }, [lotes]);

    async function getPeixesDoLote(lote: ILote) {
        try {
            const todosPeixes = await db.query.peixe.findMany();

            const lotePeixes =
                typeof lote.peixes === 'string'
                    ? JSON.parse(lote.peixes)
                    : lote.peixes;

            const peixesFiltrados = todosPeixes.filter((peixe) =>
                (lotePeixes ?? []).includes(peixe.lacre?.toString())
            );

            return peixesFiltrados;
        } catch (error) {
            console.error('Erro ao buscar peixes do lote:', error);
            throw error;
        }
    }

    async function fetchPeixesDoLote(lote: ILote) {
        if (gerarPDFLoading) {
            return;
        }

        try {
            setGerarPDFLoading(true);

            const peixesFiltrados = await getPeixesDoLote(lote);

            await gerarEPDFDownloadExpo({
                peixes: peixesFiltrados,
                lote,
            });
        } catch (error) {
            console.error("Erro ao gerar o PDF:", error);
        } finally {
            setGerarPDFLoading(false);
        }
    }

    const enviaBarco = async (lote: ILote) => {
        if (user?.permissoes.find((p) => p === 'FAS_ADMIN')) {
            try {
                await enviarLoteCompleto(lote);
                await desativaLote(lote.id);
                setLoteEnviado(true);
            } catch (error) {
                Alert.alert('Erro ao enviar barco: ' + error);
            }
        } else {
            Alert.alert('Você não tem permissão para enviar dados ao banco');
        }
    };

    const desativaLote = async (id: number | undefined) => {
        if (id === undefined || id === 0) {
            Alert.alert('Erro', 'ID inválido.');
            return;
        }

        try {
            await db
                .update(loteSchema.lote)
                .set({ ativo: 0 })
                .where(eq(loteSchema.lote.id, id));
        } catch (error) {
            Alert.alert(
                'Erro ao atualizar o lote no banco interno: ' + error
            );
        }
    };

    if (loteEnviado) {
        return (
            <TouchableWithoutFeedback onPress={() => setLoteEnviado(false)}>
                <ImageBackground
                    source={require('../../../assets/img/fundoLoteEnviado.png')}
                    style={styles.successImage}
                    resizeMode="cover"
                >
                    <Surface
                        mode="elevated"
                        elevation={3}
                        style={[
                            styles.successPanel,
                            {
                                backgroundColor: theme.colors.surface,
                                borderColor: theme.colors.outline,
                            },
                        ]}
                    >
                        <View style={styles.successTextContainer}>
                            <Text
                                variant="headlineSmall"
                                style={[
                                    styles.successTitle,
                                    {
                                        color: theme.colors.primary,
                                    },
                                ]}
                            >
                                Lote enviado
                            </Text>

                            <Text
                                variant="bodyMedium"
                                style={[
                                    styles.successSubtitle,
                                    {
                                        color: theme.colors.onSurfaceVariant,
                                    },
                                ]}
                            >
                                Seu lote foi enviado com êxito
                            </Text>
                        </View>

                        <Button
                            mode="contained"
                            onPress={() => setLoteEnviado(false)}
                            style={styles.successButton}
                            contentStyle={styles.buttonContent}
                        >
                            Continuar
                        </Button>
                    </Surface>
                </ImageBackground>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <FlatList
            data={(lotes ?? []) as ILote[]}
            keyExtractor={(item, index) =>
                item.id?.toString() ?? index.toString()
            }
            renderItem={({ item }) => (
                <Card
                    mode="elevated"
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                        },
                    ]}
                >
                    <TouchableRipple borderless>
                        <View style={styles.cardContent}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoBlock}>
                                    <Text
                                        variant="titleMedium"
                                        numberOfLines={1}
                                        style={[
                                            styles.infoValue,
                                            {
                                                color: theme.colors.primary,
                                            },
                                        ]}
                                    >
                                        {item.barco}
                                    </Text>

                                    <Text
                                        variant="bodySmall"
                                        style={[
                                            styles.infoLabel,
                                            {
                                                color: theme.colors
                                                    .onSurfaceVariant,
                                            },
                                        ]}
                                    >
                                        Barco
                                    </Text>
                                </View>

                                <View style={styles.infoBlock}>
                                    <Text
                                        variant="titleMedium"
                                        style={[
                                            styles.infoValue,
                                            {
                                                color: theme.colors.primary,
                                            },
                                        ]}
                                    >
                                        {item.data
                                            ? new Date(
                                                item.data
                                            ).toLocaleDateString()
                                            : 'Data'}
                                    </Text>

                                    <Text
                                        variant="bodySmall"
                                        style={[
                                            styles.infoLabel,
                                            {
                                                color: theme.colors
                                                    .onSurfaceVariant,
                                            },
                                        ]}
                                    >
                                        Data de cadastro
                                    </Text>
                                </View>

                                <View style={styles.infoBlock}>
                                    <Text
                                        variant="titleMedium"
                                        style={[
                                            styles.infoValue,
                                            {
                                                color: theme.colors.primary,
                                            },
                                        ]}
                                    >
                                        {Number(item.pesoTotal)?.toFixed(2) || '0.00'} Kg
                                    </Text>

                                    <Text
                                        variant="bodySmall"
                                        style={[
                                            styles.infoLabel,
                                            {
                                                color: theme.colors
                                                    .onSurfaceVariant,
                                            },
                                        ]}
                                    >
                                        Peso
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.actions}>
                                <Button
                                    mode="contained"
                                    icon="send"
                                    onPress={() =>
                                        !loadingEnviar && enviaBarco(item)
                                    }
                                    onLongPress={() => {
                                        if (item.id) {
                                            remove(item.id);
                                        }
                                    }}
                                    disabled={loadingEnviar}
                                    loading={loadingEnviar}
                                    style={styles.actionButton}
                                    contentStyle={styles.smallButtonContent}
                                >
                                    {loadingEnviar ? 'Enviando...' : 'Enviar'}
                                </Button>

                                <Button
                                    mode="outlined"
                                    icon="download"
                                    onPress={() => fetchPeixesDoLote(item)}
                                    style={styles.actionButton}
                                    contentStyle={styles.smallButtonContent}
                                >
                                    {gerarPDFLoading
                                        ? 'Carregando...'
                                        : 'Baixar Guia'}
                                </Button>
                            </View>
                        </View>
                    </TouchableRipple>
                </Card>
            )}
            ListEmptyComponent={
                <Surface
                    mode="flat"
                    style={[
                        styles.emptyContainer,
                        {
                            backgroundColor: theme.colors.surfaceVariant,
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
                        Nenhum lote disponível para envio.
                    </Text>
                </Surface>
            }
            contentContainerStyle={[
                styles.listContent,
                (!lotes || lotes.length === 0) && styles.emptyListContent,
            ]}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 24,
        gap: 16,
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
        padding: 16,
        gap: 18,
    },
    infoRow: {
        gap: 14,
    },
    infoBlock: {
        gap: 2,
    },
    infoValue: {
        fontWeight: '700',
    },
    infoLabel: {
        lineHeight: 18,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        borderRadius: 12,
    },
    smallButtonContent: {
        minHeight: 40,
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
    successImage: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    successPanel: {
        width: '100%',
        padding: 30,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderWidth: 1,
    },
    successTextContainer: {
        alignItems: 'center',
        marginBottom: 32,
        gap: 6,
    },
    successTitle: {
        fontWeight: '700',
        textAlign: 'center',
    },
    successSubtitle: {
        textAlign: 'center',
    },
    successButton: {
        borderRadius: 12,
    },
    buttonContent: {
        minHeight: 44,
    },
});