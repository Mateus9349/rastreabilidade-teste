import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { IPeixe } from '../../types/Peixe';
import InputHora from '../InputHora';
import InputText from '../InputText';
import InputSelect from '../InputSelect';

interface Props {
    onSubmit: (dados: IPeixe) => void;
    dadosIniciais?: IPeixe;
}

const initialDados: IPeixe = {
    especie: '',
    cat: '',
    lacre: '',
    sexo: '',
    unidade: '',
    gona: '',
    comprimento: '',
    peso: '',
    hPesca: '',
    lago: '',
    comunidade: '',
    hEvisceramento: '',
};

const FormPeixe: React.FC<Props> = ({ onSubmit, dadosIniciais }) => {
    const [click, setClick] = useState<boolean>(false);
    const [clickImage, setClickImage] = useState<boolean>(false);
    const [dados, setDados] = useState<IPeixe>(dadosIniciais || initialDados);

    const handleNextForm = () => {
        if (dados.especie && dados.sexo && dados.cat && dados.lacre && dados.comprimento && dados.peso && dados.gona !== '') {
            setClick(true);
            setClickImage(true);
        } else {
            Alert.alert('Preencha todos os campos');
        }
    }

    const handleChange = (field: keyof IPeixe, value: string) => {
        setDados((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (dados.hPesca && dados.hEvisceramento && dados.lago && dados.comunidade !== '') {
            onSubmit(dados);
            setDados(initialDados); // Reseta os dados
            setClick(false);
            setClickImage(false);
        } else {
            Alert.alert('Preencha todos os campos');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.cabecalhoContainer}>
                {!clickImage ? (
                    <Image source={require('../../../assets/img/Progresso_Status_Bar.png')} style={styles.image} />

                ) : (
                    <Image source={require('../../../assets/img/Progresso_Status_Bar2.png')} style={styles.image} />
                )}

                <View style={styles.containerText}>
                    <Text style={styles.title}>Preencha o formulário</Text>
                    <Text style={styles.subtitle}>Utilize as informações do pescado</Text>
                </View>
            </View>

            <View style={styles.formContainer}>
                {!click ? (
                    <View style={styles.containerDados}>
                        <View>
                            <InputSelect
                                title='Espécie'
                                value={dados.especie}
                                handleValue={(value: string) => handleChange('especie', value)}
                                label={['Pirarucu', 'Tambaqui', 'Bodeco']}
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
                                    title='Categoria'
                                    value={dados.cat}
                                    handleValue={(value) => handleChange('cat', value)}
                                    label={['IE(Inteiro Eviscerado)', 'I(Inteiro)', 'EM(Em Mantas)']}
                                />
                            </View>
                            <View style={styles.containerHorizontal}>
                                <View style={styles.inputWrapper}>
                                    <InputText
                                        label='Número do lacre'
                                        placeholder="Digite o lacre"
                                        value={dados.lacre}
                                        onChangeText={(value) => handleChange('lacre', value)}
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
                                <View style={styles.inputWrapper}>
                                    <InputText
                                        label='Peso'
                                        placeholder='Digite o peso'
                                        value={dados.peso}
                                        onChangeText={(value) => handleChange('peso', value)}
                                        keyboardType='numeric'
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
                        </View>

                        <TouchableOpacity style={styles.btnContainer} onPress={handleNextForm}>
                            <Text style={styles.btnText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.containerDados}>
                        <View>
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
                        </View>

                        <TouchableOpacity style={styles.btnContainer} onPress={handleSubmit}>
                            <Text style={styles.btnText}>Finalizar</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        height: '20%',
        marginBottom: 20
    },
    image: {
        width: '100%',
        resizeMode: 'contain',
        marginBottom: 40,
        marginTop: 20,
    },
    containerText: {
        minHeight: '15%',
        marginBottom: 32,
    },
    title: {
        color: '#2C205E',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
