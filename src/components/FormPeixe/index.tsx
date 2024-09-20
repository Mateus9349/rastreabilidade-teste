import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { IPeixe } from '../../types/Peixe';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import InputHora from '../InputHora';

interface Props {
    onSubmit: (dados: IPeixe) => void;
    dadosIniciais?: IPeixe;
}

const FormPeixe: React.FC<Props> = ({ onSubmit, dadosIniciais }) => {
    const [dados, setDados] = useState<IPeixe>(dadosIniciais || {
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
        hEvisceramento: ''
    });

    const handleChange = (field: keyof IPeixe, value: string) => {
        setDados((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit(dados);
        setDados({
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
            hEvisceramento: ''
        });
    };

    return (
        <View style={styles.scrollContainer}>
            <TextInput
                style={styles.input}
                placeholder="Espécie: "
                value={dados.especie}
                onChangeText={(value) => handleChange('especie', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Cat:"
                keyboardType='numeric'
                value={dados.cat}
                onChangeText={(value) => handleChange('cat', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite o lacre"
                keyboardType='numeric'
                value={dados.lacre}
                onChangeText={(value) => handleChange('lacre', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite o sexo"
                value={dados.sexo}
                onChangeText={(value) => handleChange('sexo', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite o número"
                value={dados.unidade}
                onChangeText={(value) => handleChange('unidade', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite o estado da gona"
                value={dados.gona}
                onChangeText={(value) => handleChange('gona', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite o comprimento"
                keyboardType='numeric'
                value={dados.comprimento}
                onChangeText={(value) => handleChange('comprimento', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite o peso"
                keyboardType='numeric'
                value={dados.peso}
                onChangeText={(value) => handleChange('peso', value)}
            />

            <InputHora
                text='Horário da pesca'
                dados={dados}
                handleDateChange={handleChange}
                localArmazenamento='hPesca'
            />

            <TextInput
                style={styles.input}
                placeholder="Digite o lago"
                value={dados.lago}
                onChangeText={(value) => handleChange('lago', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Digite a comunidade"
                value={dados.comunidade}
                onChangeText={(value) => handleChange('comunidade', value)}
            />

            <InputHora
                text='Horário de Evisceramento:'
                dados={dados}
                handleDateChange={handleChange}
                localArmazenamento='hEvisceramento'
            />

            <View style={styles.btnContainer}>
                <Button title="Enviar" onPress={handleSubmit} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
        justifyContent: 'space-between',
        gap: 10
    },
    input: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingHorizontal: 16
    },
    btnContainer: {
        marginBottom: 16,
    },
});

export default FormPeixe;
