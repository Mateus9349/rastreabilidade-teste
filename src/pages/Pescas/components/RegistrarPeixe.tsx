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
import { useState } from 'react';

import { RootStackParamList } from '../../../navigation/types';
import { IPeixe } from '../../../interfaces/Peixe';

import * as peixeSchema from '../../../database/schemas/peixeSchema';

import AppButton from '../../../components/ui/AppButton';
import FormPeixe from './PeixeForm';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarPeixe'>;

export default function RegistrarPeixe({ navigation }: Props) {
    const theme = useTheme();
    const [pescaRegistrada, setPescaRegistrada] = useState<boolean>(false);

    const database = useSQLiteContext();
    const db = drizzle(database, { schema: peixeSchema });

    const registrarPeixe = async (dados: IPeixe) => {
        try {
            const peixesRegistrados: IPeixe[] = await db.query.peixe.findMany();
            const lacreExistente = peixesRegistrados.some(
                peixe => peixe.lacre === dados.lacre,
            );

            if (lacreExistente) {
                Alert.alert('Já existe um pescado com este número de lacre!');
            } else {
                await db.insert(peixeSchema.peixe).values(dados);
                setPescaRegistrada(true);
            }
        } catch (error) {
            console.error('Erro ao cadastrar o peixe:', error);
            Alert.alert(
                'Erro',
                'Não foi possível cadastrar o peixe. Tente novamente.',
            );
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