import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

import { IPeixe } from '../../../interfaces/Peixe';
import InputHora from './HoraImput';
import InputSelect from '../../../components/InputSelect';
import SelectComunidade from './SelectComunidade';
import SelectLago from './SelectLago';

import AppButton from '../../../components/ui/AppButton';
import AppInput from '../../../components/ui/AppInput';
import AppText from '../../../components/ui/AppText';

import {
    sanitizeDecimal,
    sanitizeInteger,
} from '../../../utils/inputSanitizers';

import {
    hasDecimalBRRangeError,
} from '../../../utils/numberValidators';
import { validarENormalizarPeixeFormulario } from '../../../utils/validarPeixeFormulario';

interface Props {
    onSubmit: (dados: IPeixe) => boolean | void | Promise<boolean | void>;
    dadosIniciais?: IPeixe;
}

const initialDados: IPeixe = {
    especie: 'Pirarucu',
    cat: 'IE(Inteiro Eviscerado)',
    lacre: '',
    sexo: '',
    unidade: '1',
    gona: '',
    comprimento: '',
    peso: '',
    hPesca: '',
    lago: '',
    comunidade: '',
    hEvisceramento: '',
};

const FormPeixe: React.FC<Props> = ({ onSubmit, dadosIniciais }) => {
    const theme = useTheme();
    const [dados, setDados] = useState<IPeixe>(dadosIniciais || initialDados);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const pesoHasError = hasDecimalBRRangeError(dados.peso, 40, 300);

    const comprimentoHasError = hasDecimalBRRangeError(
        dados.comprimento,
        1.5,
        3,
    );

    const handleChange = (field: keyof IPeixe, value: string) => {
        setDados((prev) => {
            const next = { ...prev, [field]: value } as IPeixe;

            if (field === 'sexo') {
                if (value === 'M') {
                    next.gona = 'não possui';
                } else {
                    next.gona = '';
                }
            }

            return next;
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        let payload: IPeixe;

        try {
            payload = validarENormalizarPeixeFormulario(dados);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Preencha todos os campos obrigatorios.';
            Alert.alert('Dados invalidos', message);
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await onSubmit(payload);

            if (result !== false) {
                setDados(initialDados);
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Nao foi possivel registrar o pescado.';
            console.error('[RegistrarPescado] Falha no envio do formulario', error);
            Alert.alert('Erro ao registrar pescado', message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const gonadalOptions =
        dados.sexo === 'M'
            ? ['não possui']
            : [
                'I - Roseo sem presença de Ova',
                'II - Roseo com presença de Ova',
                'III - Ovas Verde Claro',
                'IV - Ovas Verde Escuro',
            ];

    return (
        <Surface
            style={[
                styles.screen,
                { backgroundColor: theme.colors.background },
            ]}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Surface
                    style={[
                        styles.headerContainer,
                        { backgroundColor: 'transparent' },
                    ]}
                    elevation={0}
                >
                    <AppText
                        variant="headlineSmall"
                        color={theme.colors.primary}
                        style={styles.title}
                    >
                        Preencha o formulário
                    </AppText>

                    <AppText
                        variant="bodyMedium"
                        color={theme.colors.onSurfaceVariant}
                        style={styles.subtitle}
                    >
                        Utilize as informações do pescado
                    </AppText>
                </Surface>

                <Surface
                    mode="elevated"
                    elevation={2}
                    style={[
                        styles.formCard,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                        },
                    ]}
                >
                    <Surface
                        style={[
                            styles.containerDados,
                            { backgroundColor: 'transparent' },
                        ]}
                        elevation={0}
                    >
                        <AppInput
                            label="Número do lacre"
                            placeholder="Digite o lacre"
                            value={dados.lacre}
                            sanitize={sanitizeInteger}
                            onChangeText={(value: string) =>
                                handleChange('lacre', value)
                            }
                            keyboardType="numeric"
                        />

                        <Surface
                            style={[
                                styles.containerHorizontal,
                                { backgroundColor: 'transparent' },
                            ]}
                            elevation={0}
                        >
                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <InputSelect
                                    title="Sexo"
                                    value={dados.sexo}
                                    handleValue={(value: string) =>
                                        handleChange('sexo', value)
                                    }
                                    label={['M', 'F']}
                                />
                            </Surface>

                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <InputSelect
                                    title="Estágio Gonodal"
                                    value={dados.gona}
                                    handleValue={(value: string) =>
                                        handleChange('gona', value)
                                    }
                                    label={gonadalOptions}
                                />
                            </Surface>
                        </Surface>

                        <Surface
                            style={[
                                styles.containerHorizontal,
                                { backgroundColor: 'transparent' },
                            ]}
                            elevation={0}
                        >
                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <AppInput
                                    label="Peso"
                                    placeholder="Digite o peso"
                                    value={dados.peso}
                                    sanitize={sanitizeDecimal}
                                    onChangeText={(value: string) =>
                                        handleChange('peso', value)
                                    }
                                    keyboardType="decimal-pad"
                                    error={pesoHasError}
                                    helperText='O peso deve estar entre 40kg e 300kg'
                                />
                            </Surface>

                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <AppInput
                                    label="Comprimento"
                                    placeholder="Comprimento"
                                    value={dados.comprimento}
                                    sanitize={sanitizeDecimal}
                                    onChangeText={(value: string) =>
                                        handleChange('comprimento', value)
                                    }
                                    keyboardType="decimal-pad"
                                    error={comprimentoHasError}
                                    helperText='O comprimento deve estar entre 1,5m e 3m.'
                                />
                            </Surface>
                        </Surface>

                        <Surface
                            style={[
                                styles.containerHorizontal,
                                { backgroundColor: 'transparent' },
                            ]}
                            elevation={0}
                        >
                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <InputHora
                                    text="Pesca"
                                    dados={dados}
                                    handleDateChange={handleChange}
                                    localArmazenamento="hPesca"
                                />
                            </Surface>

                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <InputHora
                                    text="Evisceramento"
                                    dados={dados}
                                    handleDateChange={handleChange}
                                    localArmazenamento="hEvisceramento"
                                />
                            </Surface>
                        </Surface>

                        <Surface
                            style={[
                                styles.containerHorizontal,
                                { backgroundColor: 'transparent' },
                            ]}
                            elevation={0}
                        >
                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <SelectComunidade
                                    title="Comunidade"
                                    value={dados.comunidade}
                                    onChange={(value: string) => {
                                        handleChange('comunidade', value);
                                        handleChange('lago', '');
                                    }}
                                    errorMessage="Selecione uma comunidade"
                                />
                            </Surface>

                            <Surface
                                style={[
                                    styles.fieldHalf,
                                    { backgroundColor: 'transparent' },
                                ]}
                                elevation={0}
                            >
                                <SelectLago
                                    title="Lago"
                                    comunidadeNome={dados.comunidade}
                                    value={dados.lago}
                                    handleValue={(value: string) =>
                                        handleChange('lago', value)
                                    }
                                />
                            </Surface>
                        </Surface>

                        <AppButton
                            mode="contained"
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            loading={isSubmitting}
                            style={styles.button}
                        >
                            {isSubmitting ? 'Registrando...' : 'Registrar'}
                        </AppButton>
                    </Surface>
                </Surface>
            </ScrollView>
        </Surface>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 32,
    },
    headerContainer: {
        marginBottom: 24,
        gap: 6,
    },
    title: {
        fontWeight: '700',
    },
    subtitle: {
        lineHeight: 20,
    },
    formCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 24,
        padding: 20,
    },
    containerDados: {
        flex: 1,
        gap: 20,
    },
    containerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    fieldHalf: {
        flex: 1,
    },
    button: {
        marginTop: 24,
        marginBottom: 8,
    },
});

export default FormPeixe;
