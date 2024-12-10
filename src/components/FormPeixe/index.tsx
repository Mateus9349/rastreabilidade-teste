import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { IPeixe } from '../../interfaces/Peixe';
import InputHora from '../InputHora';
import InputText from '../InputText';
import InputSelect from '../InputSelect';

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

const FormPeixe: React.FC<Props> = ({ onSubmit, dadosIniciais }) => {
    const [dados, setDados] = useState<IPeixe>(dadosIniciais || initialDados);

    const handleChange = (field: keyof IPeixe, value: string) => {
        setDados((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (
            /* dados.especie && */
            dados.sexo &&
            /* dados.cat && */
            dados.lacre &&
            dados.comprimento &&
            dados.peso &&
            dados.gona &&
            dados.hPesca &&
            dados.hEvisceramento &&
            dados.lago &&
            dados.comunidade !== ''
        ) {
            onSubmit(dados);
            setDados(initialDados); // Reseta os dados
        } else {
            Alert.alert('Preencha todos os campos');
        }
    };

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
                        label='Número do lacre'
                        placeholder="Digite o lacre"
                        value={dados.lacre}
                        onChangeText={(value) => handleChange('lacre', value)}
                        keyboardType='numeric'
                    />


                    <View style={styles.containerHorizontal}>
                        <View style={styles.inputWrapper}>
                            <InputSelect
                                title='Sexo'
                                value={dados.sexo}
                                handleValue={(value) => handleChange('sexo', value)}
                                label={['M', 'F']}
                            />
                        </View>

                        <InputSelect
                            title='Estágio Gonodal'
                            value={dados.gona}
                            handleValue={(value) => handleChange('gona', value)}
                            label={[
                                'I - Roseo sem presença de Ova',
                                'II - Roseo com presença de Ova',
                                'III - Ovas Verde Claro',
                                'IV - Ovas Verde Escuro'
                            ]}
                        />
                    </View>

                    <View style={styles.containerHorizontal}>
                        <View style={styles.inputWrapper}>
                            <InputText
                                label='Peso'
                                placeholder='Digite o peso'
                                value={dados.peso}
                                onChangeText={(value) => handleChange('peso', value)}
                                keyboardType='numeric'
                            />
                        </View>

                        <InputText
                            label='Comprimento'
                            placeholder='Comprimento'
                            value={dados.comprimento}
                            onChangeText={(value) => handleChange('comprimento', value)}
                            keyboardType='numeric'
                        />
                    </View>

                    <View style={styles.containerHorizontal}>
                        <InputHora
                            text='Horário da pesca'
                            dados={dados}
                            handleDateChange={handleChange}
                            localArmazenamento='hPesca'
                        />
                        <InputHora
                            text='Horário de Evisceramento'
                            dados={dados}
                            handleDateChange={handleChange}
                            localArmazenamento='hEvisceramento'
                        />
                    </View>
                    <View style={styles.containerHorizontal}>
                        <View style={styles.inputWrapper}>
                            <InputText
                                label='Lago'
                                placeholder="Digite o lago"
                                value={dados.lago}
                                onChangeText={(value) => handleChange('lago', value)}
                            />
                        </View>
                        <InputText
                            label='Comunidade'
                            placeholder="Digite a comunidade"
                            value={dados.comunidade}
                            onChangeText={(value) => handleChange('comunidade', value)}
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
        backgroundColor: '#fff',
        flexGrow: 1,
        justifyContent: 'space-between',
    },


    cabecalhoContainer: {
        height: '10%',
        flex: 1,
        justifyContent: 'center'
    },
    /* image: {
        width: '100%',
        resizeMode: 'contain',
        marginBottom: 40,
        marginTop: 20,
    }, */
    containerText: {
        marginBottom: 10,
    },
    title: {
        color: '#2C205E',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        color: '#2C205E',
        fontSize: 14,
        marginBottom: 20,
    },


    formContainer: {
        height: '80%'
    },
    containerDados: {
        flex: 1,
        justifyContent: 'space-between',
        height: '100%'
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
        backgroundColor: '#200393',
        borderRadius: 8,
        height: 36,
        justifyContent: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '800'
    },
});

export default FormPeixe;
