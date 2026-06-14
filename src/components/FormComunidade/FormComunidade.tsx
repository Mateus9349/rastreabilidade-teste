import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import * as Location from 'expo-location';

import type { IComunidade } from '../../interfaces/Comunidade';

interface FormComunidadeProps {
    comunidade?: IComunidade;
    onSubmit: (dados: IComunidade) => Promise<void> | void;
    onCancel?: () => void;
}

export default function FormComunidade({
    comunidade,
    onSubmit,
    onCancel,
}: FormComunidadeProps) {
    const theme = useTheme();

    const [nome, setNome] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    useEffect(() => {
        if (comunidade) {
            setNome(comunidade.nome ?? '');
            setLatitude(comunidade.latitude?.toString() ?? '');
            setLongitude(comunidade.longitude?.toString() ?? '');
        }
    }, [comunidade]);

    const handleSave = async () => {
        if (!nome.trim() || !latitude.trim() || !longitude.trim()) {
            Alert.alert(
                'Atenção',
                'Preencha todos os campos ou capte as coordenadas.'
            );
            return;
        }

        try {
            const dados: IComunidade = {
                ...comunidade,
                nome,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            };

            await onSubmit(dados);

            setNome('');
            setLatitude('');
            setLongitude('');

            Alert.alert(
                'Sucesso',
                comunidade ? 'Comunidade atualizada!' : 'Comunidade criada!'
            );
        } catch (error) {
            console.error(error);
            Alert.alert(
                'Erro',
                'Não foi possível salvar a comunidade. Tente novamente.'
            );
        }
    };

    const handleCapturarLocalizacao = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permissão negada',
                    'Não foi possível acessar a localização.'
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});

            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível capturar a localização.');
        }
    };

    return (
        <View style={styles.container}>
            <Text
                variant="titleMedium"
                style={[
                    styles.formTitle,
                    {
                        color: theme.colors.primary,
                    },
                ]}
            >
                {comunidade ? 'Editar comunidade' : 'Nova comunidade'}
            </Text>

            <TextInput
                mode="outlined"
                dense
                label="Nome"
                value={nome}
                onChangeText={setNome}
                placeholder="Digite o nome da comunidade"
            />

            <TextInput
                mode="outlined"
                dense
                label="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Digite a latitude"
                keyboardType="numeric"
            />

            <TextInput
                mode="outlined"
                dense
                label="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Digite a longitude"
                keyboardType="numeric"
            />

            <Button
                mode="contained-tonal"
                icon="map-marker"
                onPress={handleCapturarLocalizacao}
                style={styles.locationButton}
                contentStyle={styles.buttonContent}
            >
                Captar localização atual
            </Button>

            <View style={styles.actions}>
                {onCancel && (
                    <Button
                        mode="outlined"
                        onPress={onCancel}
                        style={styles.actionButton}
                    >
                        Cancelar
                    </Button>
                )}

                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.actionButton}
                    contentStyle={styles.buttonContent}
                >
                    {comunidade ? 'Atualizar' : 'Criar'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    formTitle: {
        fontWeight: '700',
        marginBottom: 4,
    },
    locationButton: {
        marginTop: 4,
        borderRadius: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 12,
    },
    actionButton: {
        borderRadius: 12,
    },
    buttonContent: {
        minHeight: 44,
    },
});