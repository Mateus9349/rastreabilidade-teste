import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import {
    Button,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import DateInput from '../DataInput';
import { IPeixe } from '../../interfaces/Peixe';
import { ILote } from '../../interfaces/Lote';

export default function FormLote({
    peixes,
    post,
}: {
    peixes: IPeixe[];
    post: (lote: ILote) => void;
}) {
    const theme = useTheme();

    const [lote, setLote] = useState<ILote>({
        planilha: 0,
        comunidade: '',
        setor: '',
        assistente: '',
        barco: '',
        data: new Date(),
        apetrechos: '',
        ambiente: '',
        quantidade: 0,
        quantidadeF: 0,
        quantidadeM: 0,
        pesoTotal: 0,
        peixes: [],
    });

    useEffect(() => {
        const quantidadeFemeas = peixes.filter(
            (peixe) => peixe.sexo === 'F'
        ).length;

        const quantidadeMachos = peixes.filter(
            (peixe) => peixe.sexo === 'M'
        ).length;

        const quantidadeTotal = peixes.length;

        const pesoTotal = peixes.reduce(
            (acc, peixe) => acc + Number(peixe.peso),
            0
        );

        const lacres = peixes.map((peixe) => peixe.lacre);

        handleChange('quantidade', quantidadeTotal);
        handleChange('quantidadeF', quantidadeFemeas);
        handleChange('quantidadeM', quantidadeMachos);
        handleChange('pesoTotal', pesoTotal);
        handleChange('peixes', lacres);
    }, [peixes]);

    const handleChange = (
        field: keyof ILote,
        value: string | number | Date | string[]
    ) => {
        setLote((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (
            lote.assistente !== '' &&
            lote.apetrechos !== '' &&
            lote.barco !== '' &&
            lote.ambiente !== '' &&
            lote.quantidade > 0 &&
            lote.pesoTotal > 0 &&
            lote.quantidadeF >= 0 &&
            lote.quantidadeM >= 0 &&
            lote.data !== null
        ) {
            post(lote);
        } else {
            Alert.alert('Preencha todos os campos obrigatórios!');
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.content}
            enableOnAndroid
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <Text
                variant="titleMedium"
                style={[
                    styles.formTitle,
                    {
                        color: theme.colors.primary,
                    },
                ]}
            >
                Informações do lote
            </Text>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Assistente"
                        placeholder="Ex.: João da Silva"
                        value={lote.assistente}
                        onChangeText={(text) =>
                            handleChange('assistente', text)
                        }
                    />
                </View>

                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Setor"
                        placeholder="Ex.: Setor 1"
                        value={lote.setor}
                        onChangeText={(text) => handleChange('setor', text)}
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Ambiente"
                        placeholder="Ex.: Rio, Lago"
                        value={lote.ambiente}
                        onChangeText={(text) =>
                            handleChange('ambiente', text)
                        }
                    />
                </View>

                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Apetrechos"
                        placeholder="Ex.: Rede de arrasto"
                        value={lote.apetrechos}
                        onChangeText={(text) =>
                            handleChange('apetrechos', text)
                        }
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Barco"
                        placeholder="Ex.: Mangueira"
                        value={lote.barco}
                        onChangeText={(text) => handleChange('barco', text)}
                    />
                </View>

                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Destino"
                        placeholder="Ex.: Salgadeira"
                        value={lote.comunidade}
                        onChangeText={(text) =>
                            handleChange('comunidade', text)
                        }
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Quantidade"
                        placeholder="Quantidade"
                        value={String(lote.quantidade)}
                        editable={false}
                    />
                </View>

                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Peso Total"
                        placeholder="Peso total"
                        value={Number(lote.pesoTotal).toFixed(2)}
                        editable={false}
                    />
                </View>
            </View>

            <View style={styles.horizontal}>
                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Quantidade Fêmeas"
                        placeholder="Quantidade de fêmeas"
                        value={String(lote.quantidadeF)}
                        editable={false}
                    />
                </View>

                <View style={styles.input}>
                    <TextInput
                        mode="outlined"
                        dense
                        label="Quantidade Machos"
                        placeholder="Quantidade de machos"
                        value={String(lote.quantidadeM)}
                        editable={false}
                    />
                </View>
            </View>

            <View style={styles.dateContainer}>
                <DateInput
                    label="Data"
                    value={lote.data}
                    onChange={(date) => handleChange('data', date)}
                />
            </View>

            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
            >
                Finalizar lote
            </Button>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        flexGrow: 1,
        paddingBottom: 16,
        gap: 12,
    },
    formTitle: {
        fontWeight: '700',
        marginBottom: 4,
    },
    horizontal: {
        flexDirection: 'row',
        gap: 12,
    },
    input: {
        flex: 1,
    },
    dateContainer: {
        marginTop: 4,
    },
    submitButton: {
        borderRadius: 12,
        marginTop: 12,
    },
    buttonContent: {
        minHeight: 44,
    },
});