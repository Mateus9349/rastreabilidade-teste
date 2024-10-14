import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { IPeixe } from "../../types/Peixe"; // Certifique-se de que o caminho está correto

interface Props {
    peixes: IPeixe[];
}

export default function CardListaConfirma({ peixes }: Props) {
    const [selectedPeixes, setSelectedPeixes] = useState<number[]>([]);

    const togglePeixe = (id: number) => {
        if (selectedPeixes.includes(id)) {
            setSelectedPeixes(selectedPeixes.filter(peixeId => peixeId !== id));
        } else {
            setSelectedPeixes([...selectedPeixes, id]);
        }
    };

    const handleConfirm = () => {
        // Adicione a lógica para confirmar os peixes selecionados
        alert("Confirmado na salgadeira!");
    };

    return (
        <View style={styles.container}>
            {peixes.map(peixe => (
                <View key={peixe.id} style={styles.itemContainer}>
                    <CheckBox
                        checked={selectedPeixes.includes(peixe.id!)}
                        onPress={() => togglePeixe(peixe.id!)}
                        containerStyle={styles.checkboxContainer}
                    />
                    <Text style={styles.peixeText}>{peixe.lacre}</Text>
                </View>
            ))}
            <TouchableOpacity
                onPress={handleConfirm}
                disabled={selectedPeixes.length === 0}
                style={[styles.confirmButton, selectedPeixes.length === 0 && styles.disabledButton]}
            >
                <Text style={styles.confirmButtonText}>Confirmar Seleção</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff', // Fundo branco
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    checkboxContainer: {
        backgroundColor: 'transparent', // Fundo transparente para o CheckBox
        borderWidth: 0,
    },
    peixeText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333', // Cor do texto
    },
    confirmButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#007BFF', // Azul
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff', // Texto branco
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#ccc', // Cor para o botão desativado
    },
});
