// src/components/FormLago/FormLago.tsx

import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Surface,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';

import type { ILago } from '../../interfaces/Lago';
import type { IComunidade } from '../../interfaces/Comunidade';
import { useLocalComunidades } from '../../hooks/LocalData/comunidade/useLocalComunidades';

interface FormLagoProps {
    lago?: ILago;
    onSubmit: (dados: ILago) => Promise<void> | void;
    onCancel?: () => void;
}

export default function FormLago({
    lago,
    onSubmit,
    onCancel,
}: FormLagoProps) {
    const theme = useTheme();

    const [nome, setNome] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [comunidadeId, setComunidadeId] = useState<string>('');

    const { comunidades, listarComunidades } = useLocalComunidades();
    const [loadingComunidades, setLoadingComunidades] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                await listarComunidades();
            } finally {
                setLoadingComunidades(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (lago) {
            setNome(lago.nome ?? '');
            setLatitude(lago.latitude?.toString() ?? '');
            setLongitude(lago.longitude?.toString() ?? '');
            setComunidadeId(
                lago.comunidadeId != null ? String(lago.comunidadeId) : ''
            );
        }
    }, [lago]);

    const handleSave = async () => {
        if (
            !nome.trim() ||
            !latitude.trim() ||
            !longitude.trim() ||
            !comunidadeId.trim()
        ) {
            Alert.alert(
                'Atenção',
                'Preencha todos os campos ou capte as coordenadas.'
            );
            return;
        }

        try {
            const dados: ILago = {
                ...lago,
                nome,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                comunidadeId: parseInt(comunidadeId, 10),
            };

            await onSubmit(dados);

            setNome('');
            setLatitude('');
            setLongitude('');
            setComunidadeId('');

            Alert.alert('Sucesso', lago ? 'Lago atualizado!' : 'Lago criado!');
        } catch (error) {
            console.error(error);
            Alert.alert(
                'Erro',
                'Não foi possível salvar o lago. Tente novamente.'
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
        } catch {
            Alert.alert('Erro', 'Não foi possível capturar a localização.');
        }
    };

    const comunidadesOrdenadas = useMemo<IComunidade[]>(() => {
        return [...(comunidades ?? [])].sort((a, b) =>
            (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR', {
                sensitivity: 'base',
            })
        );
    }, [comunidades]);

    const isSaveDisabled =
        loadingComunidades || comunidadesOrdenadas.length === 0;

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
                {lago ? 'Editar lago' : 'Novo lago'}
            </Text>

            <TextInput
                mode="outlined"
                dense
                label="Nome do lago"
                value={nome}
                onChangeText={setNome}
                placeholder="Ex.: Lago Mamirauá"
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

            <View style={styles.fieldGroup}>
                <Text
                    variant="labelLarge"
                    style={[
                        styles.label,
                        {
                            color: theme.colors.onSurfaceVariant,
                        },
                    ]}
                >
                    Comunidade
                </Text>

                <Surface
                    mode="flat"
                    style={[
                        styles.pickerWrapper,
                        {
                            backgroundColor: theme.colors.surface,
                            borderColor: theme.colors.outline,
                        },
                    ]}
                >
                    {loadingComunidades ? (
                        <View style={styles.center}>
                            <ActivityIndicator size="small" />

                            <Text
                                variant="bodySmall"
                                style={[
                                    styles.helperText,
                                    {
                                        color: theme.colors.onSurfaceVariant,
                                    },
                                ]}
                            >
                                Carregando comunidades...
                            </Text>
                        </View>
                    ) : comunidadesOrdenadas.length === 0 ? (
                        <View style={styles.center}>
                            <Text
                                variant="bodySmall"
                                style={[
                                    styles.emptyText,
                                    {
                                        color: theme.colors.onSurfaceVariant,
                                    },
                                ]}
                            >
                                Nenhuma comunidade cadastrada.
                            </Text>

                            <Text
                                variant="bodySmall"
                                style={[
                                    styles.emptyText,
                                    {
                                        color: theme.colors.onSurfaceVariant,
                                    },
                                ]}
                            >
                                Cadastre uma comunidade antes de criar um lago.
                            </Text>
                        </View>
                    ) : (
                        <Picker
                            selectedValue={comunidadeId}
                            onValueChange={(val) => setComunidadeId(val)}
                            style={[
                                styles.picker,
                                {
                                    color: theme.colors.onSurface,
                                },
                            ]}
                            dropdownIconColor={theme.colors.primary}
                        >
                            <Picker.Item
                                label="Selecione a comunidade"
                                value=""
                            />

                            {comunidadesOrdenadas.map((comunidade) => (
                                <Picker.Item
                                    key={String(comunidade.id)}
                                    label={
                                        comunidade.nome ??
                                        `#${comunidade.id}`
                                    }
                                    value={String(comunidade.id)}
                                />
                            ))}
                        </Picker>
                    )}
                </Surface>
            </View>

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
                        contentStyle={styles.buttonContent}
                    >
                        Cancelar
                    </Button>
                )}

                <Button
                    mode="contained"
                    onPress={handleSave}
                    disabled={isSaveDisabled}
                    style={styles.actionButton}
                    contentStyle={styles.buttonContent}
                >
                    {lago ? 'Atualizar' : 'Criar'}
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
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontWeight: '600',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        minHeight: 48,
        justifyContent: 'center',
    },
    picker: {
        minHeight: 48,
    },
    center: {
        minHeight: 72,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    helperText: {
        marginTop: 8,
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        lineHeight: 18,
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