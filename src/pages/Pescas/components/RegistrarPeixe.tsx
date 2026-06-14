import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    StyleSheet,
    Alert,
    TouchableWithoutFeedback,
    ImageBackground,
} from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { and, eq } from 'drizzle-orm';
import { useMemo, useState } from 'react';

import { RootStackParamList } from '../../../navigation/types';
import { IPeixe } from '../../../interfaces/Peixe';

import * as peixeSchema from '../../../database/schemas/peixeSchema';
import * as comunidadeSchema from '../../../database/schemas/comunidadeSchema';
import * as lagoSchema from '../../../database/schemas/lagoSchema';
import { validarENormalizarPeixeFormulario } from '../../../utils/validarPeixeFormulario';

import AppButton from '../../../components/ui/AppButton';
import FormPeixe from './PeixeForm';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarPeixe'>;

export default function RegistrarPeixe({ navigation }: Props) {
    const theme = useTheme();
    const [pescaRegistrada, setPescaRegistrada] = useState<boolean>(false);

    const database = useSQLiteContext();
    const db = useMemo(
        () =>
            drizzle(database, {
                schema: {
                    ...peixeSchema,
                    ...comunidadeSchema,
                    ...lagoSchema,
                },
            }),
        [database],
    );

    const registrarPeixe = async (dados: IPeixe): Promise<boolean> => {
        console.info('[RegistrarPescado] Iniciando cadastro');

        try {
            const payload = validarENormalizarPeixeFormulario(dados);

            console.info('[RegistrarPescado] Banco pronto');
            console.info('[RegistrarPescado] Dados validados');

            await db.transaction(async (tx) => {
                const [comunidade] = await tx
                    .select({ id: comunidadeSchema.comunidades.id })
                    .from(comunidadeSchema.comunidades)
                    .where(eq(comunidadeSchema.comunidades.nome, payload.comunidade))
                    .limit(1);

                if (!comunidade) {
                    throw new Error('Selecione uma comunidade valida.');
                }

                const [lago] = await tx
                    .select({ id: lagoSchema.lagos.id })
                    .from(lagoSchema.lagos)
                    .where(
                        and(
                            eq(lagoSchema.lagos.nome, payload.lago),
                            eq(lagoSchema.lagos.comunidadeId, comunidade.id),
                        ),
                    )
                    .limit(1);

                if (!lago) {
                    throw new Error('Selecione um lago valido para a comunidade.');
                }

                const [lacreExistente] = await tx
                    .select({ id: peixeSchema.peixe.id })
                    .from(peixeSchema.peixe)
                    .where(eq(peixeSchema.peixe.lacre, payload.lacre))
                    .limit(1);

                if (lacreExistente) {
                    throw new Error('Ja existe um pescado com este numero de lacre.');
                }

                await tx.insert(peixeSchema.peixe).values(payload);
            });

            console.info('[RegistrarPescado] Cadastro concluido');
            setPescaRegistrada(true);
            return true;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Nao foi possivel registrar o pescado.';

            console.error('[RegistrarPescado] Falha', error);
            Alert.alert('Erro ao registrar pescado', message);
            return false;
        }
    };

    return (
        <Surface
            style={[
                styles.screen,
                { backgroundColor: theme.colors.background },
            ]}
        >
            {pescaRegistrada ? (
                <TouchableWithoutFeedback
                    onPress={() => setPescaRegistrada(false)}
                >
                    <ImageBackground
                        source={require('../../../../assets/img/fundoPescaRegistrada.png')}
                        style={styles.containerImage}
                        resizeMode="cover"
                    >
                        <Surface
                            mode="elevated"
                            elevation={2}
                            style={[
                                styles.feedbackCard,
                                {
                                    backgroundColor: theme.colors.surface,
                                    borderColor: theme.colors.outline,
                                },
                            ]}
                        >
                            <Surface
                                style={[
                                    styles.textContainer,
                                    {
                                        backgroundColor: 'transparent',
                                    },
                                ]}
                            >
                                <Text
                                    variant="headlineSmall"
                                    style={[
                                        styles.mainText,
                                        { color: theme.colors.primary },
                                    ]}
                                >
                                    Pesca Registrada
                                </Text>

                                <Text
                                    variant="bodyMedium"
                                    style={[
                                        styles.secondaryText,
                                        {
                                            color: theme.colors.onSurfaceVariant,
                                        },
                                    ]}
                                >
                                    Sua pesca foi registrada com êxito
                                </Text>
                            </Surface>

                            <AppButton
                                mode="contained"
                                onPress={() => setPescaRegistrada(false)}
                            >
                                Continuar
                            </AppButton>
                        </Surface>
                    </ImageBackground>
                </TouchableWithoutFeedback>
            ) : (
                <FormPeixe onSubmit={registrarPeixe} />
            )}
        </Surface>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
    },
    containerImage: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    feedbackCard: {
        width: '100%',
        minHeight: '38%',
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 40,
        borderWidth: 1,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 48,
        gap: 5,
        elevation: 0,
    },
    mainText: {
        fontWeight: '700',
        textAlign: 'center',
    },
    secondaryText: {
        textAlign: 'center',
    },
});
