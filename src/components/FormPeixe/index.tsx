import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { IPeixe } from '../../types/Peixe';

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
            <Text>Espécie:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a espécie"
                value={dados.especie}
                onChangeText={(value) => handleChange('especie', value)}
            />

            <Text>Cat:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a categoria"
                keyboardType='numeric'
                value={dados.cat}
                onChangeText={(value) => handleChange('cat', value)}
            />

            <Text>Lacre:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o lacre"
                keyboardType='numeric'
                value={dados.lacre}
                onChangeText={(value) => handleChange('lacre', value)}
            />

            <Text>Sexo:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o sexo"
                value={dados.sexo}
                onChangeText={(value) => handleChange('sexo', value)}
            />

            <Text>Unidade:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o número"
                value={dados.unidade}
                onChangeText={(value) => handleChange('unidade', value)}
            />

            <Text>Est. gona:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o estado da gona"
                value={dados.gona}
                onChangeText={(value) => handleChange('gona', value)}
            />

            <Text>Comprimento:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o comprimento"
                keyboardType='numeric'
                value={dados.comprimento}
                onChangeText={(value) => handleChange('comprimento', value)}
            />

            <Text>Peso:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o peso"
                keyboardType='numeric'
                value={dados.peso}
                onChangeText={(value) => handleChange('peso', value)}
            />

            <Text>Horário da pesca:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o horário"
                keyboardType='numeric'
                value={dados.hPesca}
                onChangeText={(value) => handleChange('hPesca', value)}
            />

            <Text>Lago:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o lago"
                value={dados.lago}
                onChangeText={(value) => handleChange('lago', value)}
            />

            <Text>Comunidade:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a comunidade"
                value={dados.comunidade}
                onChangeText={(value) => handleChange('comunidade', value)}
            />

            <Text>Horário de Evisceramento:</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o horário de evisceramento"
                value={dados.hEvisceramento}
                onChangeText={(value) => handleChange('hEvisceramento', value)}
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
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    btnContainer: {
        marginBottom: 16,
    },
});

export default FormPeixe;
