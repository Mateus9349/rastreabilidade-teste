// src/components/FormComunidade.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as Location from "expo-location";
import type { IComunidade } from "../../interfaces/Comunidade";

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
    const [nome, setNome] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    useEffect(() => {
        if (comunidade) {
            setNome(comunidade.nome ?? "");
            setLatitude(comunidade.latitude?.toString() ?? "");
            setLongitude(comunidade.longitude?.toString() ?? "");
        }
    }, [comunidade]);

    const handleSave = async () => {
        if (!nome.trim() || !latitude.trim() || !longitude.trim()) {
            Alert.alert("Atenção", "Preencha todos os campos ou capte as coordenadas.");
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

            setNome("");
            setLatitude("");
            setLongitude("");

            Alert.alert("Sucesso", comunidade ? "Comunidade atualizada!" : "Comunidade criada!");
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível salvar a comunidade. Tente novamente.");
        }
    };

    const handleCapturarLocalizacao = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permissão negada", "Não foi possível acessar a localização.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude.toString());
            setLongitude(location.coords.longitude.toString());
        } catch (error) {
            Alert.alert("Erro", "Não foi possível capturar a localização.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Digite o nome da comunidade"
            />

            <Text style={styles.label}>Latitude</Text>
            <TextInput
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Digite a latitude"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Longitude</Text>
            <TextInput
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Digite a longitude"
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.captureButton} onPress={handleCapturarLocalizacao}>
                <Text style={styles.captureText}>📍 Captar localização atual</Text>
            </TouchableOpacity>

            <View style={styles.row}>
                {onCancel && (
                    <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={[styles.button, styles.save]} onPress={handleSave}>
                    <Text style={styles.buttonText}>
                        {comunidade ? "Atualizar" : "Criar"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: "#fff",
        gap: 12,
    },
    label: {
        fontWeight: "600",
        fontSize: 14,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: "#fafafa",
    },
    captureButton: {
        marginTop: 8,
        padding: 10,
        backgroundColor: "#1976d2",
        borderRadius: 8,
        alignItems: "center",
    },
    captureText: {
        color: "#fff",
        fontWeight: "600",
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 12,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    save: {
        backgroundColor: "#2e7d32",
    },
    cancel: {
        backgroundColor: "#b71c1c",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
