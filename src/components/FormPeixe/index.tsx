import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { IPeixe } from '../../interfaces/Peixe';
import InputHora from '../InputHora';
import InputText from '../InputText';
import InputSelect from '../InputSelect';
import { catitiESaoFranciscoDaMangueira, comunidadeJussara, saoFranciscoDaMangueira } from '../../utils/lagos';
import SelectComunidade from '../SelectComunidade/SelectComunidade';
import SelectLago from '../SelectLago/SelectLago';

interface Props {
    onSubmit: (dados: IPeixe) => void;
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

/**
 * FormPeixe
 * - Preenche dados de um pescado.
 * - Regra: se sexo === 'M', estágio gonadal deve ser "não possui" (não editável via opções).
 */
const FormPeixe: React.FC<Props> = ({ onSubmit, dadosIniciais }) => {
    const [dados, setDados] = useState<IPeixe>(dadosIniciais || initialDados);

    const lagosPorComunidade: { [key: string]: string[] } = {
        mangueira: saoFranciscoDaMangueira.lagos,
        catite: catitiESaoFranciscoDaMangueira.lagos,
        jussara: comunidadeJussara.lagos,
    };

    const handleChange = (field: keyof IPeixe, value: string) => {
        // Mantém a coerência: força 'gona' quando sexo muda.
        setDados((prev) => {
            const next = { ...prev, [field]: value } as IPeixe;
            if (field === 'sexo') {
                if (value === 'M') {
                    next.gona = 'não possui';
                } else if (value === 'F') {
                    next.gona = '';
                } else {
                    next.gona = '';
                }
            }
            return next;
        });
    };

    const handleSubmit = () => {
        if (
            dados.sexo &&
            dados.lacre &&
            dados.comprimento &&
            dados.peso &&
            dados.hPesca &&
            dados.hEvisceramento &&
            dados.lago &&
            dados.comunidade !== ''
        ) {
            onSubmit(dados);
            setDados(initialDados);
        } else {
            Alert.alert('Preencha todos os campos');
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.cabecalhoContainer}>
                <View style={styles.containerText}>
                    <Text style={styles.title}>Preencha o formulário</Text>
                    <Text style={styles.subtitle}>Utilize as informações do pescado</Text>
                </View>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.containerDados}>
                    <InputText
                        label="Número do lacre"
                        placeholder="Digite o lacre"
                        value={dados.lacre}
                        onChangeText={(value) => handleChange('lacre', value)}
                        keyboardType="numeric"
                    />

                    <View style={styles.containerHorizontal}>
                        <View style={styles.inputWrapper}>
                            <InputSelect
                                title="Sexo"
                                value={dados.sexo}
                                handleValue={(value) => handleChange('sexo', value)}
                                label={["M", "F"]}
                            />
                        </View>

                        <InputSelect
                            title="Estágio Gonodal"
                            value={dados.gona}
                            handleValue={(value) => handleChange('gona', value)}
                            label={gonadalOptions}
                        />
                    </View>

                    <View style={styles.containerHorizontal}>
                        <View style={styles.inputWrapper}>
                            <InputText
                                label="Peso"
                                placeholder="Digite o peso"
                                value={dados.peso}
                                onChangeText={(value) => handleChange('peso', value)}
                                keyboardType="numeric"
                            />
                        </View>

                        <InputText
                            label="Comprimento"
                            placeholder="Comprimento"
                            value={dados.comprimento}
                            onChangeText={(value) => handleChange('comprimento', value)}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.containerHorizontal}>
                        <InputHora
                            text="Horário da pesca"
                            dados={dados}
                            handleDateChange={handleChange}
                            localArmazenamento="hPesca"
                        />
                        <InputHora
                            text="Horário de Evisceramento"
                            dados={dados}
                            handleDateChange={handleChange}
                            localArmazenamento="hEvisceramento"
                        />
                    </View>

                    <View style={styles.containerHorizontal}>
                        <View style={styles.inputWrapper}>
                            <SelectComunidade
                                title="Selecione a comunidade"
                                value={dados.comunidade}
                                onChange={(value) => {
                                    handleChange('comunidade', value);
                                    handleChange('lago', ''); // reset lago ao trocar comunidade
                                }}
                                errorMessage="Selecione uma comunidade"
                            />
                        </View>

                        <SelectLago
                            title="Lago"
                            comunidadeNome={dados.comunidade}
                            value={dados.lago}
                            handleValue={(value) => handleChange('lago', value)}
                        />
                    </View>

                    <TouchableOpacity style={styles.btnContainer} onPress={handleSubmit}>
                        <Text style={styles.btnText}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
        flexGrow: 1,
        justifyContent: 'space-between',
    },
    cabecalhoContainer: {
        height: '10%',
        flex: 1,
        justifyContent: 'center',
    },
    containerText: {
        marginBottom: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        color: '#EDF2FD',
        fontSize: 14,
        marginBottom: 20,
    },
    formContainer: {
        height: '80%',
    },
    containerDados: {
        flex: 1,
        justifyContent: 'space-between',
        height: '100%',
    },
    containerHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    inputWrapper: {
        marginRight: 10,
        width: '47%',
    },
    btnContainer: {
        marginBottom: 30,
        marginTop: 50,
        backgroundColor: '#871B21',
        borderRadius: 8,
        height: 36,
        justifyContent: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '800',
    },
});

export default FormPeixe;
